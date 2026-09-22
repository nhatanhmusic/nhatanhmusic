import type { CategoryView, FacetOption, ItemFilters } from './types';

/**
 * Menu thả xuống của thanh điều hướng.
 *
 * Nguyên tắc: mọi mục trong menu phải dẫn tới một bộ lọc CÓ THẬT trên
 * `GET /catalog/items`. Không đặt mục chỉ để menu trông đầy — khách bấm vào một
 * link chết là mất lòng tin ngay, mà lòng tin là thứ cả web này dựa vào.
 */

export type MenuLink = { label: string; href: string; count?: number };
export type MenuColumn = { title: string; links: MenuLink[] };
export type NavEntry = {
  label: string;
  href: string;
  columns?: MenuColumn[];
  footerLink?: MenuLink;
};

/** Nhóm nào gom những danh mục nào. Slug khớp với bảng `categories`. */
const GROUPS: { label: string; categories: string[]; withBrands: boolean }[] = [
  {
    label: 'Guitar & Bass',
    categories: ['guitar-dien', 'guitar-acoustic', 'guitar-classic', 'guitar-bass'],
    withBrands: true,
  },
  { label: 'Amp & Pedal', categories: ['ampli'], withBrands: false },
  { label: 'Phụ kiện', categories: ['phu-kien'], withBrands: false },
];

/** Tầm giá dùng chung. Đơn vị đồng, khớp kiểu BIGINT của API. */
const PRICE_BANDS: { label: string; min?: number; max?: number }[] = [
  { label: 'Dưới 5 triệu', max: 5_000_000 },
  { label: '5 – 15 triệu', min: 5_000_000, max: 15_000_000 },
  { label: '15 – 30 triệu', min: 15_000_000, max: 30_000_000 },
  { label: 'Trên 30 triệu', min: 30_000_000 },
];

function danHref(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') sp.set(key, String(value));
  }
  return `/dan${sp.toString() ? `?${sp}` : ''}`;
}

/**
 * Dựng menu từ dữ liệu thật của backend. Thêm một danh mục trong database là
 * menu tự có thêm mục, không phải sửa code ở đây.
 */
export function buildNav(
  categories: CategoryView[] | null,
  filters: ItemFilters | null,
): NavEntry[] {
  // Danh mục lấy từ /catalog/categories chứ không lấy từ bộ đếm: một danh mục
  // tạm hết hàng (hoặc cả kho đang giữ chỗ) vẫn phải nằm trong menu, nếu không
  // khách tưởng shop không bán loại đó.
  const byCategory = new Map<string, CategoryView>(
    (categories ?? []).map((c) => [c.slug, c]),
  );
  const countOf = new Map<string, number>(
    (filters?.categories ?? []).map((c: FacetOption) => [c.value, c.count]),
  );

  const entries: NavEntry[] = GROUPS.map((group) => {
    const cats = group.categories
      .map((slug) => byCategory.get(slug))
      .filter((c): c is CategoryView => Boolean(c));

    // Danh mục chưa có trong database thì bỏ khỏi menu luôn.
    const categoryLinks: MenuLink[] = cats.map((c) => ({
      label: c.name,
      href: danHref({ category: c.slug }),
      // Không có cây nào đang bán thì bỏ số đi cho đỡ nản, đừng hiện "0".
      count: countOf.get(c.slug) || undefined,
    }));

    // Nhóm chỉ có đúng một danh mục thì lọc giá gắn kèm danh mục đó cho chính xác.
    const scope = group.categories.length === 1 ? group.categories[0] : undefined;

    const quickLinks: MenuLink[] = [
      ...PRICE_BANDS.map((band) => ({
        label: band.label,
        href: danHref({ category: scope, priceMin: band.min, priceMax: band.max }),
      })),
      { label: 'Đàn nhẹ, dưới 3,5 kg', href: danHref({ category: scope, weightMax: 3500 }) },
    ];

    const columns: MenuColumn[] = [];
    if (categoryLinks.length > 0) {
      columns.push({ title: 'Loại đàn', links: categoryLinks });
    }
    columns.push({ title: 'Lọc nhanh', links: quickLinks });

    if (group.withBrands) {
      const brands = (filters?.brands ?? []).slice(0, 8);
      if (brands.length > 0) {
        columns.push({
          title: 'Theo hãng',
          links: brands.map((b) => ({
            label: b.label,
            href: danHref({ brand: b.value }),
            count: b.count,
          })),
        });
      }
    }

    const firstCategory = group.categories[0];
    return {
      label: group.label,
      href: danHref({ category: cats.length === 1 ? firstCategory : undefined }),
      columns: columns.length > 0 ? columns : undefined,
      footerLink: {
        label:
          cats.length === 1
            ? `Xem tất cả ${cats[0].name.toLowerCase()}`
            : 'Xem tất cả đàn đang có',
        href: danHref({ category: cats.length === 1 ? firstCategory : undefined }),
      },
    };
  });

  // Hai mục này thuộc Giai đoạn 3 và 5, chưa có trang nên chưa gắn menu con.
  entries.push({ label: 'Setup & Sửa chữa', href: '/dich-vu' });
  entries.push({ label: 'Khóa học', href: '/khoa-hoc' });

  return entries;
}
