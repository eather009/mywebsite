import path from "path";

function resolveAppRoot(): string | null {
  if (process.env.APP_ROOT) {
    return process.env.APP_ROOT;
  }

  const cwd = process.cwd();
  const marker = `${path.sep}.next${path.sep}standalone`;
  const idx = cwd.indexOf(marker);
  if (idx > 0) {
    return cwd.slice(0, idx);
  }

  return null;
}

/**
 * Persistent upload directory. Nginx/Apache serve /uploads from app-root public/uploads.
 * PM2 standalone cwd is .next/standalone — never write only there.
 */
export function getUploadsDir(): string {
  if (process.env.UPLOAD_DIR) {
    return process.env.UPLOAD_DIR;
  }

  const appRoot = resolveAppRoot();
  if (appRoot) {
    return path.join(appRoot, "public", "uploads");
  }

  return path.join(process.cwd(), "public", "uploads");
}

export function getAppRoot(): string | null {
  return resolveAppRoot();
}
