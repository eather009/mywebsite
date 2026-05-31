/** When true, public site reads MDX files — no MySQL or admin CMS. */
export function isStaticSite(): boolean {
  return process.env.STATIC_SITE === "1";
}
