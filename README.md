# eatherahmed.com — Professional Portfolio

Professional portfolio website for **Iftekhar Ahmed Eather** with admin portal for blog management and job availability settings.

**Live domain:** [eatherahmed.com](https://eatherahmed.com)

## Features

### Public Site
- Recruiter-focused homepage with configurable availability badge
- Experience, projects, skills, certifications, LinkedIn references
- Database-driven blog with rich content rendering and cover images
- RSS feed, sitemap, SEO, structured data
- Accessible light theme with engineer aesthetic (Inter + JetBrains Mono)

### Admin Portal (`/admin`)
- **Login** — secure JWT session authentication
- **Account** — change admin password
- **Site Settings** — configure job availability (open / selective / not looking / hidden)
- **Blog CMS** — Medium-like TipTap editor with:
  - Headings, bold, italic, underline, highlight
  - Lists, blockquotes, code blocks
  - Links and image uploads
  - Cover image showcase
  - Draft / publish workflow
  - Tags and SEO description

## Tech Stack

- Next.js 16 (App Router)
- TypeScript + Tailwind CSS 4
- Prisma + MySQL
- TipTap rich text editor
- JWT auth (jose + bcryptjs)

## Getting Started

```bash
cp .env.example .env
npm install
npm run db:up          # starts MySQL via Docker
npm run db:setup       # migrate + seed (wait ~10s after db:up on first run)
npm run dev
```

Or with an existing MySQL server, set `DATABASE_URL` in `.env` then run:

```bash
npm run db:deploy
npm run db:seed
npm run dev
```

- **Site:** http://localhost:3000
- **Admin:** http://localhost:3000/admin/login

### Environment Variables

```env
DATABASE_URL="mysql://portfolio:portfolio@localhost:3306/portfolio"
JWT_SECRET="your-long-random-secret"
ADMIN_EMAIL="admin@eatherahmed.com"
ADMIN_PASSWORD="your-secure-password"
```

For production, use your host’s MySQL connection string, e.g.:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Migrate, seed, and build for production |
| `npm run db:up` | Start local MySQL (Docker) |
| `npm run db:setup` | Start MySQL, migrate, and seed |
| `npm run db:deploy` | Apply migrations (production) |
| `npm run db:migrate` | Create/apply dev migrations |
| `npm run db:seed` | Seed admin user and sample data |
| `npm run db:studio` | Open Prisma Studio |

## Project Structure

```
prisma/              # Database schema, migrations, seed
content/blog/        # Legacy MDX (auto-imported on first seed)
public/uploads/      # Blog image uploads
src/
  app/admin/         # Admin portal pages
  app/api/admin/     # Admin API routes
  components/admin/  # RichEditor, PostEditor, SettingsForm
  lib/               # auth, blog-db, site-settings, tiptap
docs/PLAN.md         # Implementation plan
```

## Deploy on AWS Lightsail / existing server

| Your setup | Guide |
|------------|--------|
| **1 GB RAM Lightsail** + MariaDB + CMS | **[deploy/DEPLOY-1GB.md](deploy/DEPLOY-1GB.md)** |
| **Already using httpd (Apache)** with PHP/Python | **[docs/DEPLOY-APACHE-EXISTING-SERVER.md](docs/DEPLOY-APACHE-EXISTING-SERVER.md)** |
| **New Lightsail instance** (Amazon Linux + httpd) | **[docs/DEPLOY-LIGHTSAIL.md](docs/DEPLOY-LIGHTSAIL.md)** |

### 1 GB Lightsail — quick steps (MariaDB + CMS)

```bash
# On server (ec2-user) — 1 GB RAM, 2 vCPU, 40 GB SSD
cd /var/www/eatherahmed
git clone git@github.com:eather009/mywebsite.git .
bash scripts/setup-1gb-server.sh
nano deploy/mariadb/init-portfolio.sql   # set DB password
sudo mysql -u root -p < deploy/mariadb/init-portfolio.sql
cp .env.production.example .env && nano .env
npm run db:deploy && npm run db:seed
bash scripts/deploy-1gb.sh
sudo cp deploy/httpd/eatherahmed.conf /etc/httpd/conf.d/
sudo certbot --apache -d eatherahmed.com -d www.eatherahmed.com
```

Future updates: `bash scripts/deploy-1gb.sh`

### Existing Apache server — quick steps

```bash
# On server (ec2-user)
bash scripts/amazon-linux-setup.sh          # MariaDB + Node 20 + PM2
# Create DB/user in mysql (see guide)
cd /var/www/eatherahmed && git clone ... && cp .env.production.example .env
npm ci && npm run db:deploy && npm run db:seed && npm run build:prod
pm2 start deploy/ecosystem.config.cjs
sudo cp deploy/httpd/eatherahmed.conf /etc/httpd/conf.d/
sudo apachectl configtest && sudo systemctl reload httpd
sudo certbot --apache -d eatherahmed.com -d www.eatherahmed.com
```

### New Lightsail instance — quick summary (Amazon Linux)

1. Create **Lightsail instance** — blueprint **Amazon Linux 2023** (**1 GB RAM** is OK — see `deploy/DEPLOY-1GB.md`)
2. Install **MariaDB locally** on the instance (recommended for 1 GB) or use Lightsail managed MySQL
3. Point **eatherahmed.com** A record to the instance IP
4. SSH as **`ec2-user`**: `ssh -i key.pem ec2-user@<IP>`
5. Run `bash scripts/lightsail-setup.sh`
6. Clone repo to `/var/www/eatherahmed`, copy `.env.production.example` → `.env`
7. `npm ci && npm run db:deploy && npm run db:seed && npm run build:prod`
8. `pm2 start deploy/ecosystem.config.cjs`
9. `sudo cp deploy/httpd/eatherahmed.conf /etc/httpd/conf.d/` + Certbot

Future updates: `./scripts/lightsail-deploy.sh ec2-user@YOUR_IP ~/.ssh/key.pem`

## Deploy Notes

1. Set production environment variables (see `.env.production.example`)
2. Point `DATABASE_URL` at Lightsail managed MySQL
3. Blog uploads persist in `public/uploads/` — backed up on the server volume
4. Change default admin password in **Admin → Account** after first login

## Links

- [LinkedIn](https://www.linkedin.com/in/iftekhareather/)
- [GitHub](https://github.com/eather009)

© Iftekhar Ahmed Eather
