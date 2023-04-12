/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites() {
    return [
      {
        source: '/log-in',
        destination: '/create-account',
      },
    ];
  },
};

module.exports = nextConfig;
