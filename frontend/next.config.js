/** @type {import('next').NextConfig} */

const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

const sassConfig = {
  sassOptions: {
    sassOptions: {
      includeOptions: [path.join(__dirname, 'styles')],
    },
  },
}

module.exports = {
  ...nextConfig,
  ...sassConfig
};
