/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com'],
  },
  // تعطيل فحص التحديثات لتجنب مشاكل الاتصال
  experimental: {
    disableOptimizedLoading: true,
  },
  // تعطيل التحقق من النسخة
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig
