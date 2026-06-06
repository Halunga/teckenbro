/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "teckensprakslexikon.su.se",
        pathname: "/photos/**"
      }
    ]
  }
};

export default nextConfig;
