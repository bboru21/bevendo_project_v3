/** @type {import('next').NextConfig} */

const path = require('path');
const fs = require('fs');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['api.bevendo.app'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  }
};

const sassConfig = {
  sassOptions: {
    sassOptions: {
      includeOptions: [path.join(__dirname, 'styles')],
    },
  },
}

// Load local config if it exists
let localConfig = {};
if (fs.existsSync('./next.config.local.js')) {
  localConfig = require('./next.config.local.js');
}

module.exports = {
  ...nextConfig,
  ...sassConfig,
  ...localConfig // override default values with local
};
