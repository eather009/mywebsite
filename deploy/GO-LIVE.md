# Go live — DNS ready (eatherahmed.com + www.eatherahmed.com)

DNS A records point to your Lightsail IP. Run these on the **server** as `ec2-user`.

## 1. App running

```bash
cd /var/www/eatherahmed
git pull
npm ci
npm run db:deploy
npm run build:prod
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
pm2 restart eatherahmed || pm2 start deploy/ecosystem.config.cjs
pm2 save
curl -I http://127.0.0.1:3000
```

## 2. Apache vhost

```bash
sudo cp deploy/httpd/eatherahmed.conf /etc/httpd/conf.d/eatherahmed.conf
sudo apachectl configtest
sudo systemctl reload httpd
```

Test HTTP (before SSL):

```bash
curl -I -H "Host: eatherahmed.com" http://127.0.0.1/
curl -I -H "Host: www.eatherahmed.com" http://127.0.0.1/
```

## 3. HTTPS — both domains

```bash
sudo certbot --apache -d eatherahmed.com -d www.eatherahmed.com
```

Certbot creates `eatherahmed-le-ssl.conf` and HTTP→HTTPS redirect.

Verify:

```bash
curl -I https://eatherahmed.com
curl -I https://www.eatherahmed.com
```

**Canonical URL:** `https://eatherahmed.com` (www redirects to non-www via Next.js).

## 4. Admin

- https://eatherahmed.com/admin/login
- Change password: **Admin → Account**

## 5. Troubleshooting

| Issue | Check |
|-------|--------|
| 502 Bad Gateway | `pm2 logs eatherahmed` |
| Wrong site / default Apache page | `sudo apachectl -S` — confirm `eatherahmed.com` vhost |
| SSL error | `sudo certbot certificates` |
| DB error | `grep DATABASE_URL .env` + `mysql -u portfolio -p portfolio` |
