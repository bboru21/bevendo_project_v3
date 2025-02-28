/** @type {import('next').NextConfig} */

const path = require('path');
const fs = require('fs');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['api.bevendo.app'],
  },
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
