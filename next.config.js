/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com', '217.76.53.136'],
    unoptimized: true, // للسماح بتحميل الصور من مصادر خارجية
  },
  // تمكين standalone output للـ Docker
  output: 'standalone',
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
