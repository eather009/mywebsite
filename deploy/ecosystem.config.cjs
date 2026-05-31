const path = require("path");

const appRoot = "/var/www/eatherahmed";
const standaloneDir = path.join(appRoot, ".next/standalone");

module.exports = {
  apps: [
    {
      name: "eatherahmed",
      cwd: standaloneDir,
      script: "server.js",
      instances: 1,
      exec_mode: "fork",
      // PM2 injects DATABASE_URL, JWT_SECRET, etc. before Node starts
      env_file: path.join(appRoot, ".env"),
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1",
      },
      max_memory_restart: "512M",
      error_file: path.join(appRoot, "logs/pm2-error.log"),
      out_file: path.join(appRoot, "logs/pm2-out.log"),
    },
  ],
};
