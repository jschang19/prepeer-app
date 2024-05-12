const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.ENVIRONMENT === 'development',
  register: true,
  skipWaiting: true
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = withPWA(nextConfig)