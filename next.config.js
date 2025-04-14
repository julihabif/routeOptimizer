/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { dev, isServer }) => {
    // Solo aplicar estas configuraciones en el cliente durante el desarrollo
    if (!isServer && dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 0,
          cacheGroups: {
            styles: {
              name: 'styles',
              test: /\.css$/,
              chunks: 'all',
              enforce: true,
            },
          },
        },
      }
    }
    return config
  },
}

module.exports = nextConfig 