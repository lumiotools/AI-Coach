/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["your-image-domain.com"],
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(mp4)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[hash][ext][query]',
      },
    });

    return config;
  },
};

export default nextConfig;
