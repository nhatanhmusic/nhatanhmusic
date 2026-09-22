import type { Metadata } from 'next';
import { SHOP } from '@/lib/shop';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SHOP.siteUrl),
  title: {
    default: `${SHOP.name} — Đàn cũ đúng cây bạn nhận`,
    template: `%s | ${SHOP.shortName}`,
  },
  description:
    'Mỗi cây đàn ở shop được chụp riêng, cân riêng, ghi rõ serial và qua kiểm tra 32 điểm trước khi giao.',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: SHOP.name,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
