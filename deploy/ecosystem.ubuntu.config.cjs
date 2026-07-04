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
      env_file: path.join(appRoot, ".env"),
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1",
        APP_ROOT: appRoot,
        UPLOAD_DIR: path.join(appRoot, "public", "uploads"),
      },
      // Tuned for 4 GB RAM (MariaDB + Nginx share the rest)
      node_args: "--max-old-space-size=1536",
      max_memory_restart: "1600M",
      error_file: path.join(appRoot, "logs/pm2-error.log"),
      out_file: path.join(appRoot, "logs/pm2-out.log"),
      merge_logs: true,
      time: true,
    },
  ],
};
