// Kiểu dữ liệu khớp với DTO của Spring Boot.
// Khi backend chạy, sinh lại bản chính xác bằng: npm run gen:api (mục 8).

export type ConditionGrade = 'NEW' | 'MINT' | 'EXCELLENT' | 'VERY_GOOD' | 'GOOD' | 'FAIR';
export type ItemStatus = 'DRAFT' | 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'RETURNED';
export type ItemSource = 'NEW_STOCK' | 'PURCHASED' | 'CONSIGNMENT';
export type PhotoKind = 'MAIN' | 'BACK' | 'HEADSTOCK' | 'BRIDGE' | 'FRETBOARD' | 'FLAW' | 'OTHER';
export type UserRole = 'CUSTOMER' | 'STAFF' | 'ADMIN';

export const GRADE_LABEL: Record<ConditionGrade, string> = {
  NEW: 'Mới 100%',
  MINT: 'Như mới',
  EXCELLENT: 'Rất tốt',
  VERY_GOOD: 'Tốt',
  GOOD: 'Khá',
  FAIR: 'Cần sửa',
};

export const GRADE_ORDER: ConditionGrade[] = ['NEW', 'MINT', 'EXCELLENT', 'VERY_GOOD', 'GOOD', 'FAIR'];

export const STATUS_LABEL: Record<ItemStatus, string> = {
  DRAFT: 'Nháp',
  AVAILABLE: 'Đang bán',
  RESERVED: 'Đã giữ',
  SOLD: 'Đã bán',
  RETURNED: 'Đã trả lại',
};

export const SOURCE_LABEL: Record<ItemSource, string> = {
  NEW_STOCK: 'Hàng mới',
  PURCHASED: 'Shop thu mua',
  CONSIGNMENT: 'Ký gửi',
};

export const PHOTO_KIND_LABEL: Record<PhotoKind, string> = {
  MAIN: 'Toàn thân',
  BACK: 'Lưng đàn',
  HEADSTOCK: 'Đầu cần',
  BRIDGE: 'Cầu đàn',
  FRETBOARD: 'Mặt phím',
  FLAW: 'Khuyết điểm',
  OTHER: 'Khác',
};

export interface ItemCard {
  id: number;
  slug: string;
  sku: string;
  title: string;
  brandName?: string | null;
  categoryName: string;
  categorySlug: string;
  conditionGrade: ConditionGrade;
  conditionLabel: string;
  weightGrams?: number | null;
  yearMade?: number | null;
  madeIn?: string | null;
  priceVnd: number;
  compareAtPriceVnd?: number | null;
  status: ItemStatus;
  statusLabel: string;
  source: ItemSource;
  acceptsOffers: boolean;
  flawCount: number;
  mainPhotoUrl?: string | null;
  publishedAt?: string | null;
}

export interface PhotoView {
  id: number;
  key: string;
  url: string;
  kind: PhotoKind;
  kindLabel: string;
  sortOrder: number;
  altText?: string | null;
}

export interface FlawView {
  id: number;
  title: string;
  description?: string | null;
  photoId?: number | null;
  photoUrl?: string | null;
}

export interface CheckView {
  code: string;
  label: string;
  groupName: string;
  passed: boolean;
  note?: string | null;
}

export interface InspectionView {
  id: number;
  checkedAt: string;
  note?: string | null;
  passedCount: number;
  totalCount: number;
  checks: CheckView[];
}

export interface ItemDetail {
  card: ItemCard;
  serialNo?: string | null;
  summary?: string | null;
  modelName: string;
  modelSlug: string;
  modelDescription?: string | null;
  specs: Record<string, string>;
  photos: PhotoView[];
  flaws: FlawView[];
  inspection?: InspectionView | null;
}

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

export interface ItemFilters {
  categories: FacetOption[];
  brands: FacetOption[];
  grades: FacetOption[];
  minPriceVnd: number;
  maxPriceVnd: number;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface BrandView {
  id: number;
  name: string;
  slug: string;
}

export interface CategoryView {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
  sortOrder: number;
}

export interface ModelOption {
  id: number;
  name: string;
  slug: string;
  brandName?: string | null;
  categoryName: string;
  unique: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  fields?: Record<string, string>;
}

// ---- Phiếu kiểm tra 32 điểm ----

export interface TemplatePoint {
  code: string;
  label: string;
  groupName: string;
}

// ---- Hãng, danh mục, model (trang quản trị) ----

export interface BrandRow {
  id: number;
  name: string;
  slug: string;
  modelCount: number;
}

export interface CategoryRow {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
  modelCount: number;
}

export interface ModelView {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  specs: Record<string, string>;
  categoryId: number;
  categoryName: string;
  brandId?: number | null;
  brandName?: string | null;
  unique: boolean;
  stockQuantity?: number | null;
  listPriceVnd?: number | null;
  itemCount: number;
}

// ---- Nội dung web ----

export interface SettingView {
  key: string;
  value: unknown;
  label: string;
  description?: string | null;
  sortOrder: number;
  updatedAt: string;
}
