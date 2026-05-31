module.exports = {
  apps: [
    {
      name: "eatherahmed",
      cwd: "/var/www/eatherahmed",
      script: ".next/standalone/server.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1",
      },
      max_memory_restart: "512M",
    },
  ],
};
