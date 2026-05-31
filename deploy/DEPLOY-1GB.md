# Deploy on 1 GB RAM Lightsail (MariaDB + CMS)

**Instance:** 1 GB RAM · 2 vCPU · 40 GB SSD · Amazon Linux · Apache httpd

This guide fits a small Lightsail box running **MariaDB locally**, **Next.js on PM2**, and **Apache** as reverse proxy.

## Memory budget (~1 GB)

| Service        | Target RAM |
|----------------|------------|
| OS + buffers   | ~200 MB    |
| MariaDB        | ~128–200 MB (tuned) |
| Node (PM2)     | ~256–384 MB |
| Apache httpd   | ~50–80 MB  |
| **Swap**       | **2 GB** (required for `npm run build`) |

Without swap, `next build` will likely be OOM-killed on 1 GB.

---

## One-shot system setup

SSH as `ec2-user`:

```bash
cd /var/www/eatherahmed
git clone git@github.com:eather009/mywebsite.git .   # skip if already cloned
bash scripts/setup-1gb-server.sh
```

This installs: **2 GB swap**, **MariaDB** (low-memory config), **Node 20**, **PM2**, **httpd**, SELinux fix.

---

## Create database

```bash
nano deploy/mariadb/init-portfolio.sql   # set a strong password
sudo mysql -u root -p < deploy/mariadb/init-portfolio.sql
```

Test:

```bash
mysql -u portfolio -p portfolio -e "SELECT 1;"
```

---

## Configure `.env`

```bash
cp .env.production.example .env
nano .env
```

```env
NODE_ENV=production
PORT=3000
HOSTNAME=127.0.0.1
STATIC_SITE=0

DATABASE_URL="mysql://portfolio:YOUR_PASSWORD@localhost:3306/portfolio?connection_limit=5"
JWT_SECRET="<openssl rand -base64 48>"
ADMIN_EMAIL="admin@eatherahmed.com"
ADMIN_PASSWORD="change-me-after-first-login"
```

`connection_limit=5` keeps Prisma from opening too many MariaDB connections on a small instance.

---

## First deploy

```bash
cd /var/www/eatherahmed
npm ci
npm run db:deploy
npm run db:seed
bash scripts/deploy-1gb.sh
```

Or step by step:

```bash
export NODE_OPTIONS=--max-old-space-size=512
pm2 stop eatherahmed 2>/dev/null || true
npm run deploy:prod
pm2 start deploy/ecosystem.config.cjs
pm2 save
```

---

## Apache + HTTPS

```bash
sudo cp deploy/httpd/eatherahmed.conf /etc/httpd/conf.d/eatherahmed.conf
sudo apachectl configtest
sudo systemctl reload httpd
sudo certbot --apache -d eatherahmed.com -d www.eatherahmed.com
```

Verify:

```bash
curl -I http://127.0.0.1:3000
curl -I https://eatherahmed.com
bash scripts/diagnose-server.sh
```

---

## Future updates

```bash
cd /var/www/eatherahmed
bash scripts/deploy-1gb.sh
```

If `npm ci` is **Killed** (OOM on 1 GB):

1. Confirm swap exists: `swapon --show` (need 2 GB — run `bash scripts/setup-1gb-server.sh`)
2. Re-run deploy — script now stops MariaDB + PM2 before `npm ci`
3. Skip reinstall when lockfile unchanged: `SKIP_NPM_CI=1 bash scripts/deploy-1gb.sh`
4. Last resort — build on laptop and rsync (see below)

---

## If build still runs out of memory

**Option A — build on your laptop, copy to server:**

```bash
# On laptop (same repo, production .env not required for build)
npm ci && npm run build:prod
rsync -avz --delete .next/standalone/ ec2-user@YOUR_IP:/var/www/eatherahmed/.next/standalone/
rsync -avz .next/static/ ec2-user@YOUR_IP:/var/www/eatherahmed/.next/static/
ssh ec2-user@YOUR_IP 'cd /var/www/eatherahmed && npm run sync:standalone && pm2 restart eatherahmed'
```

**Option B — static mode (no MariaDB, no admin CMS):**

Set `STATIC_SITE=1` in `.env` and run `bash scripts/deploy-1gb.sh`.

---

## MariaDB files

| File | Purpose |
|------|---------|
| `deploy/mariadb/99-portfolio-lowmem.cnf` | 128 MB buffer pool, 20 max connections |
| `deploy/mariadb/init-portfolio.sql` | Create `portfolio` DB and user |

Re-apply MariaDB tuning after git pull:

```bash
sudo cp deploy/mariadb/99-portfolio-lowmem.cnf /etc/my.cnf.d/
sudo systemctl restart mariadb
```

---

## Admin after go-live

1. https://eatherahmed.com/admin/login  
2. **Admin → Account** — change password  
3. Remove `ADMIN_PASSWORD` from `.env` after seed

---

## Monitoring on 1 GB

```bash
free -h
pm2 monit
sudo systemctl status mariadb httpd
pm2 logs eatherahmed --lines 20
```

If MariaDB is restarted often (OOM), confirm lowmem config is loaded:

```bash
mysql -e "SHOW VARIABLES LIKE 'innodb_buffer_pool_size';"
# Should show 134217728 (128M)
```
