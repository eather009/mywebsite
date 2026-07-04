-- Legacy manual SQL — prefer the automated script:
--
--   cd /var/www/eatherahmed
--   bash scripts/setup-database.sh
--
-- That script creates a fresh database + user, generates a password,
-- writes DATABASE_URL to .env, and saves credentials to .db-credentials
--
-- Defaults: database `eatherahmed`, user `eatherahmed_app`
--
-- Custom names:
--   DB_NAME=mydb DB_USER=myuser DB_PASSWORD='secret' bash scripts/setup-database.sh
--
-- Manual fallback (edit password first):
--   sudo mysql -u root < deploy/mariadb/init-portfolio.sql

CREATE DATABASE IF NOT EXISTS eatherahmed
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Replace password before running manually:
CREATE USER IF NOT EXISTS 'eatherahmed_app'@'localhost' IDENTIFIED BY 'CHANGE_ME_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON eatherahmed.* TO 'eatherahmed_app'@'localhost';
FLUSH PRIVILEGES;
