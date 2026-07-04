# Deploy on Ubuntu 24.04 LTS (4 GB RAM)

**Instance:** 4 GB RAM · Ubuntu 24.04 · Nginx · MariaDB · Node 20 · PM2  
**App directory:** `/var/www/eatherahmed`

This replaces the old 1 GB Amazon Linux + Apache workflow. No swap tricks or low-memory builds are required.

---

## Memory budget (~4 GB)

| Service   | Target RAM |
|-----------|------------|
| OS        | ~400 MB    |
| MariaDB   | ~512 MB (tuned) |
| Node PM2  | ~1.0–1.5 GB |
| Nginx     | ~50 MB     |
| Build     | ~2 GB heap during `next build` |

---

## 1. Fresh server — one-shot setup

SSH into the server, then:

```bash
# Create app directory and clone (if starting fresh)
sudo mkdir -p /var/www/eatherahmed
sudo chown $USER:$USER /var/www/eatherahmed
cd /var/www/eatherahmed
git clone git@github-eather:eather009/mywebsite.git .

# System packages: MariaDB, Nginx, Node 20, PM2, UFW, Certbot
sudo bash scripts/setup-ubuntu-server.sh
```

This installs and enables:

- **MariaDB** with `deploy/mariadb/99-portfolio.cnf`
- **Nginx** reverse proxy (`deploy/nginx/eatherahmed.conf`)
- **Node.js 20** + **PM2**
- **UFW** — SSH + Nginx (HTTP/HTTPS) only

---

## 2. Create database and user

MariaDB is already running on your server. Create a **new** database and app user (separate from any old server):

```bash
cd /var/www/eatherahmed
bash scripts/setup-database.sh
```

This will:

- Create database `eatherahmed` (override with `DB_NAME=...`)
- Create user `eatherahmed_app@localhost` with a **new random password**
- Write `DATABASE_URL` into `.env`
- Save credentials to `.db-credentials` (chmod 600, gitignored)

Custom names or password:

```bash
DB_NAME=eatherahmed DB_USER=eatherahmed_app DB_PASSWORD='YourSecurePass123' bash scripts/setup-database.sh
```

If MariaDB root needs a password:

```bash
MYSQL_ROOT_PASSWORD='your-root-password' bash scripts/setup-database.sh
```

Import data from the old server (optional):

```bash
mysql -u eatherahmed_app -p eatherahmed < portfolio.sql
```

Verify:

```bash
mysql -u eatherahmed_app -p eatherahmed -e "SELECT 1;"
```

---

## 3. Configure `.env`

```bash
cp .env.production.example .env   # skip if setup-database.sh already created .env
nano .env
```

Set `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`. `DATABASE_URL` is filled by `setup-database.sh`.

```env
NODE_ENV=production
PORT=3000
HOSTNAME=127.0.0.1
STATIC_SITE=0

DATABASE_URL="mysql://eatherahmed_app:YOUR_PASSWORD@localhost:3306/eatherahmed?connection_limit=10"
JWT_SECRET="<openssl rand -base64 48>"
ADMIN_EMAIL="admin@eatherahmed.com"
ADMIN_PASSWORD="change-me-after-first-login"
```

Generate JWT secret:

```bash
openssl rand -base64 48
```

---

## 4. First deploy

```bash
cd /var/www/eatherahmed
RUN_SEED=1 bash scripts/deploy.sh
```

`RUN_SEED=1` runs the initial admin user + site settings seed (first time only).

Verify Node:

```bash
curl -I http://127.0.0.1:3000/
pm2 logs eatherahmed --lines 20
```

Verify Nginx proxy:

```bash
curl -I -H "Host: eatherahmed.com" http://127.0.0.1/
```

---

## 5. HTTPS

Point DNS A records for `eatherahmed.com` and `www.eatherahmed.com` to this server, then:

```bash
sudo certbot --nginx -d eatherahmed.com -d www.eatherahmed.com
```

Certbot auto-renews via systemd timer.

---

## 6. Routine deploys

After code changes are pushed to GitHub:

```bash
cd /var/www/eatherahmed
bash scripts/deploy.sh
```

Optional flags:

| Flag | Effect |
|------|--------|
| `SKIP_NPM_CI=1` | Skip `npm ci` when `package-lock.json` unchanged |
| `SKIP_GIT_PULL=1` | Skip `git pull` |
| `RUN_SEED=1` | Re-run seed (usually not needed) |

Blog posts and admin settings update **live** after deploy — no special cache step.

---

## 7. Static mode (no database)

Set in `.env`:

```env
STATIC_SITE=1
```

Deploy still works; database migrate/seed steps are skipped.

---

## 8. PM2 on boot

Setup script configures PM2 startup. If needed manually:

```bash
pm2 startup systemd -u $USER --hp $HOME
# run the printed sudo command
pm2 save
```

---

## 9. Troubleshooting

Run diagnostics:

```bash
bash scripts/diagnose-server.sh
```

Common fixes:

| Problem | Fix |
|---------|-----|
| 502/503 from Nginx | `pm2 logs eatherahmed` — rebuild with `bash scripts/deploy.sh` |
| DB connection error | Check `DATABASE_URL`, `sudo systemctl status mariadb` |
| Build OOM | Unlikely on 4 GB; set `NODE_OPTIONS=--max-old-space-size=3072` |
| Uploads 404 | Ensure `public/uploads` exists and Nginx `/uploads/` alias is active |

Nginx logs:

```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

PM2 logs:

```bash
pm2 logs eatherahmed
tail -f /var/www/eatherahmed/logs/pm2-error.log
```

---

## 10. Migrating from old 1 GB Amazon Linux server

1. Export MariaDB on old server: `mysqldump -u portfolio -p portfolio > portfolio.sql`
2. Set up new Ubuntu server (step 1 above)
3. Create **new** DB user on new server: `bash scripts/setup-database.sh`
4. Import dump: `mysql -u eatherahmed_app -p eatherahmed < portfolio.sql`
5. Copy `/var/www/eatherahmed/public/uploads/` from old server
6. Set `JWT_SECRET`, `ADMIN_*` in `.env` (DATABASE_URL is set by setup-database)
7. Run `RUN_SEED=0 bash scripts/deploy.sh` (skip seed if import has data)
8. Update DNS to new IP, run Certbot
9. Decommission old instance after verification

---

## File reference

| File | Purpose |
|------|---------|
| `scripts/setup-ubuntu-server.sh` | First-time OS + stack setup |
| `scripts/setup-database.sh` | Create DB + user + password, update `.env` |
| `scripts/deploy.sh` | Pull, build, migrate, restart PM2 |
| `deploy/ecosystem.ubuntu.config.cjs` | PM2 config (4 GB) |
| `deploy/nginx/eatherahmed.conf` | Nginx reverse proxy |
| `deploy/mariadb/init-portfolio.sql` | Manual SQL fallback |
| `deploy/mariadb/99-portfolio.cnf` | MariaDB tuning (4 GB) |

Legacy 1 GB scripts remain in `scripts/deploy-1gb.sh` and `deploy/DEPLOY-1GB.md`.
