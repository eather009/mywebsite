/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.eatherahmed.com" }],
        destination: "https://eatherahmed.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
