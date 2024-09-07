import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Additional Next.js configuration options can be added here
};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development
  register: true, // Registers the service worker
  skipWaiting: true, // Makes the new service worker activate as soon as it's installed
})(nextConfig);
