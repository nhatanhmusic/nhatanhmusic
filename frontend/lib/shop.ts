/**
 * Thông tin shop hiện khắp giao diện. Bản thiết kế để [trong ngoặc vuông] —
 * điền vào .env.local rồi bỏ ngoặc (Giai đoạn 0 trong kế hoạch build).
 */
export const SHOP = {
  name: 'Nhật Anh Music Gear & Service',
  shortName: 'Nhật Anh',
  phone: process.env.NEXT_PUBLIC_SHOP_PHONE ?? '[SỐ HOTLINE]',
  address: process.env.NEXT_PUBLIC_SHOP_ADDRESS ?? '[ĐỊA CHỈ SHOP]',
  hours: process.env.NEXT_PUBLIC_SHOP_HOURS ?? '[GIỜ MỞ CỬA]',
  city: process.env.NEXT_PUBLIC_SHOP_CITY ?? 'Biên Hòa',
  rating: process.env.NEXT_PUBLIC_SHOP_RATING ?? '[4.9]',
  reviewCount: process.env.NEXT_PUBLIC_SHOP_REVIEWS ?? '[số]',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
};

export const TRUST_POINTS = [
  'Ảnh chụp đúng cây bạn nhận',
  'Bảo hành 12 tháng, kể cả đàn cũ',
  'Đổi trả trong 7 ngày',
  'Setup lại miễn phí trọn đời',
  'Trả góp 0% qua thẻ',
];

export const NAV = [
  { href: '/dan?category=guitar-dien', label: 'Guitar & Bass' },
  { href: '/dan?category=ampli', label: 'Amp & Pedal' },
  { href: '/dan?category=phu-kien', label: 'Phụ kiện' },
  { href: '/dich-vu', label: 'Setup & Sửa chữa' },
  { href: '/khoa-hoc', label: 'Khóa học' },
];
