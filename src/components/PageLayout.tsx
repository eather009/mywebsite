import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSiteConfig } from "@/lib/site-config";

export async function PageLayout({ children }: { children: React.ReactNode }) {
  const siteConfig = await getSiteConfig();

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer siteConfig={siteConfig} />
    </>
  );
}
