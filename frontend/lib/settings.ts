import { API_BASE } from './api';
import { fill } from './richtext';
import type { ConditionGrade } from './types';

/**
 * Nội dung tĩnh của web, lấy từ bảng `site_settings` (sửa ở /admin/noi-dung).
 *
 * Giá trị mặc định ở đây cố tình để tối thiểu: chỉ đủ cho trang không vỡ khi
 * backend chết. Không chép lại toàn bộ nội dung, vì hai bản nội dung song song
 * thì sớm muộn cũng lệch nhau, và lúc đó không ai biết bản nào đúng.
 */

export interface ShopContact {
  phone: string;
  address: string;
  hours: string;
  city: string;
  rating: string;
  reviewCount: string;
  businessInfo: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface HomeHero {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  body: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  photoBadge: string;
  stats: HeroStat[];
}

export interface ServiceTier {
  tier: string;
  name: string;
  priceVnd: number;
  priceFrom: boolean;
  duration: string;
  includes: string[];
  note: string;
  featured: boolean;
}

export interface SellStep {
  step: string;
  title: string;
  body: string;
}

export interface CourseCard {
  tag: string;
  tone: 'green' | 'brass';
  name: string;
  body: string;
  meta: string;
  priceVnd: number;
}

export interface Review {
  rating: number;
  body: string;
  name: string;
  meta: string;
}

export interface BuyBoxPromise {
  icon: 'truck' | 'shield' | 'return';
  text: string;
}

export interface SectionText {
  eyebrow?: string;
  title: string;
  body?: string;
  linkLabel?: string;
  footnote?: string;
  emptyTitle?: string;
  emptyBody?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  featuredTag?: string;
  trustLines?: string[];
}

export interface HomeSections {
  brands: SectionText;
  newest: SectionText;
  grades: SectionText;
  services: SectionText;
  sell: SectionText;
  courses: SectionText;
  reviews: SectionText;
}

export interface CatalogPage {
  title: string;
  subtitle: string;
  emptyTitle: string;
  emptyBody: string;
}

export interface ProductPage {
  availableLine: string;
  soldTitle: string;
  soldBody: string;
  reservedTitle: string;
  reservedBody: string;
  installmentLine: string;
  inspectionBoxTitle: string;
  inspectionBoxBody: string;
  offerHint: string;
  flawsEyebrow: string;
  flawsTitle: string;
  flawsBody: string;
  flawsNone: string;
  inspectionEyebrow: string;
  inspectionTitle: string;
  inspectionBody: string;
  descriptionTitle: string;
  specsTitle: string;
  relatedEyebrow: string;
  relatedEyebrowSold: string;
  relatedTitle: string;
  relatedLinkLabel: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSettings {
  tagline: string;
  privacyNote: string;
  columns: { title: string; links: FooterLink[] }[];
}

export interface PlaceholderPage {
  eyebrow: string;
  title: string;
  body: string;
}

export type PlaceholderPages = Record<string, PlaceholderPage> & {
  contactTitle?: string;
  backLabel?: string;
};

export interface SiteSettings {
  shop_contact: ShopContact;
  trust_points: string[];
  home_hero: HomeHero;
  grade_meanings: Record<ConditionGrade, string>;
  service_tiers: ServiceTier[];
  sell_steps: SellStep[];
  courses: CourseCard[];
  reviews: Review[];
  buybox_promises: BuyBoxPromise[];
  home_sections: HomeSections;
  catalog_page: CatalogPage;
  product_page: ProductPage;
  footer: FooterSettings;
  placeholder_pages: PlaceholderPages;
}

const T = (title: string): SectionText => ({ title });

const FALLBACK: SiteSettings = {
  shop_contact: {
    phone: '[SỐ HOTLINE]',
    address: '[ĐỊA CHỈ SHOP]',
    hours: '[GIỜ MỞ CỬA]',
    city: '[THÀNH PHỐ]',
    rating: '—',
    reviewCount: '—',
    businessInfo: '',
  },
  trust_points: [],
  home_hero: {
    eyebrow: '',
    titleLine1: 'Nhật Anh Music Gear & Service',
    titleLine2: '',
    body: '',
    primaryLabel: 'Xem đàn đang có',
    primaryHref: '/dan',
    secondaryLabel: '',
    secondaryHref: '/dich-vu',
    photoBadge: '',
    stats: [],
  },
  grade_meanings: {} as Record<ConditionGrade, string>,
  service_tiers: [],
  sell_steps: [],
  courses: [],
  reviews: [],
  buybox_promises: [],
  home_sections: {
    brands: T('Mua theo hãng'),
    newest: T('Đàn & gear đang có sẵn'),
    grades: T('Thang tình trạng'),
    services: T('Dịch vụ'),
    sell: T('Bán đàn cho shop'),
    courses: T('Khóa học'),
    reviews: T('Đánh giá'),
  },
  catalog_page: {
    title: 'Đàn & gear đang có sẵn',
    subtitle: '{count} cây',
    emptyTitle: 'Chưa có cây nào khớp.',
    emptyBody: '',
  },
  product_page: {
    availableLine: '',
    soldTitle: 'Cây này đã bán.',
    soldBody: '',
    reservedTitle: 'Cây này đang được giữ chỗ.',
    reservedBody: '',
    installmentLine: '',
    inspectionBoxTitle: 'Đã qua kiểm tra 32 điểm',
    inspectionBoxBody: 'Đạt {passed}/{total} điểm.',
    offerHint: '',
    flawsEyebrow: '',
    flawsTitle: 'Khuyết điểm của đúng cây này',
    flawsBody: '',
    flawsNone: 'Không ghi nhận khuyết điểm.',
    inspectionEyebrow: '',
    inspectionTitle: 'Quy trình kiểm tra 32 điểm',
    inspectionBody: '',
    descriptionTitle: 'Mô tả',
    specsTitle: 'Thông số kỹ thuật',
    relatedEyebrow: '',
    relatedEyebrowSold: '',
    relatedTitle: 'Những cây tương tự',
    relatedLinkLabel: 'Xem cả danh mục',
  },
  footer: { tagline: '', privacyNote: '', columns: [] },
  placeholder_pages: {} as PlaceholderPages,
};

/**
 * Một lần gọi lấy hết mọi khối. Sửa ở trang quản trị thì chậm nhất 30 giây sau
 * trang khách đổi theo.
 */
export async function getSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${API_BASE}/settings`, { next: { revalidate: 30 } });
    if (!res.ok) return FALLBACK;
    const data = (await res.json()) as Partial<SiteSettings>;
    return { ...FALLBACK, ...data };
  } catch {
    return FALLBACK;
  }
}

/** Biến từ Thông tin shop, dùng chung cho mọi câu có {city} {phone}… */
export function contactVars(contact: ShopContact): Record<string, string> {
  return { city: contact.city, phone: contact.phone, address: contact.address, hours: contact.hours };
}

/** Chèn {city} và các chỗ trống khác trong câu cam kết. */
export function fillPlaceholders(text: string, contact: ShopContact): string {
  return fill(text, contactVars(contact));
}
