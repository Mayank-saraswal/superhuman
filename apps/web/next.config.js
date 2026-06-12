/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@superhuman/services", "@superhuman/database", "@superhuman/corsair"],
};

export default nextConfig;
