# Static site deploy (no MariaDB)
#
# Use when MySQL is unavailable or you only need a public portfolio + MDX blog.
# Admin CMS is disabled. Blog posts come from content/blog/*.mdx in the repo.

## Server .env

```env
NODE_ENV=production
PORT=3000
HOSTNAME=127.0.0.1
STATIC_SITE=1
JWT_SECRET="optional-not-used-for-public-site"
```

Do **not** set `DATABASE_URL` for static mode.

## Deploy commands

```bash
cd /var/www/eatherahmed
git fetch origin
git reset --hard origin/main
rm -rf node_modules
npm ci
npm run deploy:static
mkdir -p logs
pm2 delete eatherahmed 2>/dev/null; pm2 start deploy/ecosystem.config.cjs
pm2 save
curl -I http://127.0.0.1:3000
sudo setsebool -P httpd_can_network_connect 1
sudo systemctl reload httpd
```

## What works

- Home, About, Experience, Projects, Contact
- Blog (3 MDX articles in `content/blog/`)
- RSS feed, sitemap, robots.txt

## What is disabled

- `/admin` — redirects to home
- Blog CMS (edit posts via git + MDX files instead)

## Switch back to full CMS later

Set `STATIC_SITE=0`, add `DATABASE_URL`, run MariaDB setup, then:

```bash
npm run db:deploy
npm run db:seed
npm run deploy:prod
pm2 restart eatherahmed
```
