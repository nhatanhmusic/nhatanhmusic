import type { MetadataRoute } from 'next';
import { SHOP } from '@/lib/shop';

/**
 * Đặt NEXT_PUBLIC_NOINDEX=true trên Netlify trong lúc web chưa có ảnh thật và
 * thông tin thật — để Google không lưu lại một trang toàn ô kẻ sọc. Bỏ biến đi
 * (hoặc =false) khi sẵn sàng đón khách.
 */
export default function robots(): MetadataRoute.Robots {
  const noindex = process.env.NEXT_PUBLIC_NOINDEX === 'true';
  return {
    rules: noindex
      ? { userAgent: '*', disallow: '/' }
      : { userAgent: '*', allow: '/', disallow: ['/admin', '/dang-nhap'] },
    sitemap: noindex ? undefined : `${SHOP.siteUrl}/sitemap.xml`,
  };
}
