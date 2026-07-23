When we tried to send Google Chat alerts for new **Blog** posts on export-japan.co.jp, Make.com’s WordPress connector kept failing — even though the REST API looked open and the connected user was an Administrator.

This post walks through the real cause, how we diagnosed it, and the working pattern we use now.

## What is Make.com?

[Make.com](https://www.make.com) (formerly Integromat) is a no-code automation platform. You connect apps — WordPress, Google Chat, Slack, email, and many others — into **scenarios**: visual workflows that run on a schedule or when something happens.

In our case, Make watches for new WordPress Blog posts and sends a Google Chat message when one is published. That saves the team from checking the CMS manually and keeps everyone informed in the channel they already use.

The catch: Make’s official WordPress connector does not always behave the same for custom post types as it does for built-in `posts`. That mismatch is what this article is about.

## The Symptom

Make called the WordPress REST API like this:

```
/wp-json/wp/v2/blog?status=publish&context=edit&per_page=100
```

And returned errors such as:

- `insufficient_permissions` (403) from the Make WordPress plugin
- or earlier, `rest_forbidden_context` when auth/context did not line up

Public listing **without** `context=edit` worked fine:

```
/wp-json/wp/v2/blog?status=publish
```

So the CPT was registered for REST. The failure was specifically tied to **edit context** and Make’s connector.

## What We Learned

### 1. Make’s WordPress module always uses `context=edit`

For list/get operations, Make requests editable fields. WordPress only allows `context=edit` for authenticated users who can edit that post type.

We authenticated with the official Make / Integromat plugin API key (`iwc-api-key`), not Application Passwords.

### 2. Auth was fine — the CPT was blocked

Tests showed:

| Request | Result |
|---------|--------|
| `/wp/v2/users/me` + API key | OK (Administrator) |
| `/wp/v2/posts?context=edit` + API key | OK |
| `/wp/v2/blog?context=edit` + API key | `insufficient_permissions` |

So this was **not** Cloudflare, nginx security headers, or a missing Administrator role. The Make connector allowed normal `posts`, but refused our custom post type `blog` under `context=edit`.

### 3. Post IDs are a bad “new post” signal

On our site, newer publishes can have **smaller** IDs than older ones (drafts, imports, out-of-order creation). Example pattern:

- Newer by date → lower ID
- Older by date → higher ID

So filtering with `id > last_id` can miss real new publishes. **Publish date** (`date_gmt`) is the reliable signal.

## The Solution

We stopped using Make’s native WordPress “list posts” module for this CPT and built a small HTTP-based scenario.

### Step 1 — Fetch public blog posts (no `context=edit`)

**HTTP → Make a request**

- URL: `https://www.export-japan.co.jp/wp-json/wp/v2/blog`
- Method: `GET`
- Parse response: **Yes**

Query parameters:

| Name | Value |
|------|--------|
| `status` | `publish` |
| `per_page` | `5` |
| `orderby` | `date` |
| `order` | `desc` |
| `_fields` | `id,title,date,date_gmt,link` |

No Make API key required for public published content.

### Step 2 — Remember the last notified publish time

In a Make **Data store** (we use one store named `EXJ`), keep a single record:

| Key | Field | Meaning |
|-----|--------|---------|
| `blog_last_post` | `last_published_at` | Last `date_gmt` we already notified |

### Step 3 — Iterate and filter by date

```
HTTP
 → Data store: Get record (blog_last_post)
 → Iterator (HTTP data array)
 → Filter: Iterator.date_gmt  Later than  stored last_published_at
 → Google Chat message
 → Array aggregator (date_gmt)
 → Data store: Add/replace (update last_published_at)
```

Google Chat message (map from **Iterator**, not HTTP):

```
A new Blog `{{title.rendered}}` was published at {{date}}

To check, please visit {{link}}
```

Important: use `title.rendered` — `title` alone is an object and prints blank.

### Step 4 — Save the newest date correctly

After sending messages, aggregate all passed `date_gmt` values, then overwrite the store.

**Do not use numeric `max()` on dates.** In Make, `max()` is for numbers. On date strings (or an empty map), it can save **`-Infinity`** and break every future run.

Working formula:

```
{{last(sort(map(15.array; "date_gmt")))}}
```

(Replace `15` with your Array aggregator module number; keep `"date_gmt"` in quotes.)

Also: only run Add/replace when the aggregator actually has items, so an empty run never wipes the stored date.

## Final Scenario Checklist

1. HTTP GET blogs without `context=edit`
2. Get `last_published_at` from Data store key `blog_last_post`
3. Iterator over `data`
4. Filter: `date_gmt` later than stored value
5. Google Chat from Iterator fields
6. Array aggregator on `date_gmt`
7. Add/replace with `last(sort(map(...; "date_gmt")))`

## Why This Approach Works

| Approach | Result |
|----------|--------|
| Make WordPress module + `context=edit` on CPT `blog` | Blocked by connector permissions |
| Public HTTP without `context=edit` | Works for published blogs |
| Dedupe by post ID | Unreliable when IDs are out of date order |
| Dedupe by `date_gmt` | Matches “when it was published,” including older drafts published later |

## Practical Tips

- Seed `last_published_at` once with the current newest post’s `date_gmt`, or the first run will notify several historical posts.
- Prefer `date_gmt` over `date` so timezone does not confuse comparisons.
- If you later need drafts or raw content, use WordPress **Application Passwords** with HTTP Basic Auth — not only the Make plugin key — and test `/wp/v2/blog?context=edit` with `curl` first.
- Rotate any API keys that were pasted into chats or tickets.

## Conclusion

The REST API was never “closed.” Make’s WordPress connector was asking for **edit** context on a custom post type it would not authorize. Switching to a public HTTP request, filtering on **publish time**, and storing the last notified `date_gmt` gave us reliable Google Chat alerts without fighting CPT permission quirks.

If you run the same stack (WordPress CPT + Make + Chat), start with a simple `curl` comparison of `posts?context=edit` vs `your-cpt?context=edit`. That single test usually tells you whether to fix connector permissions — or bypass them with HTTP.
