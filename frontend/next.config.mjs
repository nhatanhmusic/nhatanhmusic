/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },

  async redirects() {
    return [
      // Truoc day dang nhap quan tri o duong dan rieng. Gio chung mot trang.
      { source: '/admin/dang-nhap', destination: '/dang-nhap', permanent: true },
    ];
  },
};

export default nextConfig;
