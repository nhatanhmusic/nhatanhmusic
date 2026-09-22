import { GRADE_LABEL, GRADE_ORDER } from './types';

/**
 * Mô tả hình dạng từng khối nội dung, để trang quản trị dựng ra form tử tế thay
 * vì bắt người dùng gõ JSON. Thêm một khối mới trong migration thì thêm một mục
 * ở đây; khối chưa khai báo vẫn sửa được bằng ô JSON thô, chỉ là xấu hơn.
 */

export type Field =
  | { kind: 'text'; key: string; label: string; hint?: string; placeholder?: string }
  | { kind: 'textarea'; key: string; label: string; hint?: string }
  /** Một nhóm ô con, hiện thành khung có tiêu đề. */
  | { kind: 'group'; key: string; label: string; hint?: string; fields: Field[] }
  | { kind: 'number'; key: string; label: string; hint?: string }
  | { kind: 'boolean'; key: string; label: string }
  | { kind: 'select'; key: string; label: string; options: { value: string; label: string }[] }
  | { kind: 'stringList'; key: string; label: string; hint?: string }
  | { kind: 'objectList'; key: string; label: string; titleKey: string; fields: Field[] };

export type SettingSchema =
  | { shape: 'object'; fields: Field[] }
  | { shape: 'objectList'; itemNoun: string; titleKey: string; fields: Field[] }
  | { shape: 'stringList'; itemNoun: string }
  | { shape: 'map'; entries: { key: string; label: string }[]; multiline: boolean };

export const SCHEMAS: Record<string, SettingSchema> = {
  shop_contact: {
    shape: 'object',
    fields: [
      { kind: 'text', key: 'phone', label: 'Hotline / Zalo', placeholder: '0966 000 000' },
      { kind: 'text', key: 'address', label: 'Địa chỉ shop' },
      { kind: 'text', key: 'hours', label: 'Giờ mở cửa', placeholder: '8:30 – 20:00, thứ 2 đến chủ nhật' },
      {
        kind: 'text',
        key: 'city',
        label: 'Thành phố',
        hint: 'Dùng cho câu "Giao nội thành … trong 24h".',
      },
      { kind: 'text', key: 'rating', label: 'Điểm Google', placeholder: '4.9' },
      { kind: 'text', key: 'reviewCount', label: 'Số đánh giá Google', placeholder: '128' },
      { kind: 'text', key: 'businessInfo', label: 'Thông tin đăng ký kinh doanh', hint: 'Hiện ở chân trang.' },
    ],
  },

  trust_points: { shape: 'stringList', itemNoun: 'dòng cam kết' },

  home_hero: {
    shape: 'object',
    fields: [
      { kind: 'text', key: 'eyebrow', label: 'Nhãn nhỏ phía trên' },
      { kind: 'text', key: 'titleLine1', label: 'Tiêu đề — dòng 1' },
      { kind: 'text', key: 'titleLine2', label: 'Tiêu đề — dòng 2' },
      {
        kind: 'textarea',
        key: 'body',
        label: 'Đoạn giới thiệu',
        hint: 'Bọc **hai dấu sao** quanh cụm chữ muốn in đậm.',
      },
      { kind: 'text', key: 'primaryLabel', label: 'Nút chính — chữ' },
      { kind: 'text', key: 'primaryHref', label: 'Nút chính — đường dẫn' },
      { kind: 'text', key: 'secondaryLabel', label: 'Nút phụ — chữ' },
      { kind: 'text', key: 'secondaryHref', label: 'Nút phụ — đường dẫn' },
      { kind: 'text', key: 'photoBadge', label: 'Nhãn trên ảnh' },
      {
        kind: 'objectList',
        key: 'stats',
        label: 'Ba con số',
        titleKey: 'label',
        fields: [
          { kind: 'text', key: 'value', label: 'Con số' },
          { kind: 'text', key: 'label', label: 'Chú thích' },
        ],
      },
    ],
  },

  grade_meanings: {
    shape: 'map',
    multiline: true,
    entries: GRADE_ORDER.map((grade) => ({ key: grade, label: GRADE_LABEL[grade] })),
  },

  service_tiers: {
    shape: 'objectList',
    itemNoun: 'gói dịch vụ',
    titleKey: 'name',
    fields: [
      { kind: 'text', key: 'tier', label: 'Nhãn gói', placeholder: 'Gói 1' },
      { kind: 'text', key: 'name', label: 'Tên gói' },
      { kind: 'number', key: 'priceVnd', label: 'Giá (đồng)', hint: 'Số nguyên, không dấu chấm.' },
      { kind: 'boolean', key: 'priceFrom', label: 'Hiện chữ "từ" trước giá' },
      { kind: 'text', key: 'duration', label: 'Thời gian làm' },
      { kind: 'stringList', key: 'includes', label: 'Gồm những gì' },
      { kind: 'text', key: 'note', label: 'Ghi chú cuối thẻ' },
      { kind: 'boolean', key: 'featured', label: 'Đánh dấu "Được chọn nhiều nhất"' },
    ],
  },

  sell_steps: {
    shape: 'objectList',
    itemNoun: 'bước',
    titleKey: 'title',
    fields: [
      { kind: 'text', key: 'step', label: 'Số thứ tự', placeholder: '01' },
      { kind: 'text', key: 'title', label: 'Tiêu đề bước' },
      { kind: 'textarea', key: 'body', label: 'Mô tả' },
    ],
  },

  courses: {
    shape: 'objectList',
    itemNoun: 'khóa học',
    titleKey: 'name',
    fields: [
      { kind: 'text', key: 'tag', label: 'Nhãn' },
      {
        kind: 'select',
        key: 'tone',
        label: 'Màu nhãn',
        options: [
          { value: 'green', label: 'Xanh rêu' },
          { value: 'brass', label: 'Màu đồng' },
        ],
      },
      { kind: 'text', key: 'name', label: 'Tên khóa' },
      { kind: 'textarea', key: 'body', label: 'Mô tả' },
      { kind: 'text', key: 'meta', label: 'Dòng thông tin', placeholder: '90 phút/buổi · Tối đa 6 học viên' },
      { kind: 'number', key: 'priceVnd', label: 'Học phí (đồng)' },
    ],
  },

  reviews: {
    shape: 'objectList',
    itemNoun: 'đánh giá',
    titleKey: 'name',
    fields: [
      { kind: 'number', key: 'rating', label: 'Số sao (1–5)' },
      { kind: 'textarea', key: 'body', label: 'Nội dung đánh giá', hint: 'Chỉ đăng đánh giá thật, xin phép khách trước.' },
      { kind: 'text', key: 'name', label: 'Tên khách' },
      { kind: 'text', key: 'meta', label: 'Ghi chú', placeholder: 'Setup Stratocaster · 08/2026' },
    ],
  },

  buybox_promises: {
    shape: 'objectList',
    itemNoun: 'cam kết',
    titleKey: 'text',
    fields: [
      {
        kind: 'select',
        key: 'icon',
        label: 'Biểu tượng',
        options: [
          { value: 'truck', label: 'Xe giao hàng' },
          { value: 'shield', label: 'Khiên bảo hành' },
          { value: 'return', label: 'Mũi tên đổi trả' },
        ],
      },
      {
        kind: 'textarea',
        key: 'text',
        label: 'Nội dung',
        hint: 'Gõ {city} để chèn tên thành phố từ khối Thông tin shop.',
      },
    ],
  },

  // ---- Tiêu đề & câu chữ trên từng trang ----

  home_sections: {
    shape: 'object',
    fields: [
      section('brands', 'Mua theo hãng', [
        { kind: 'text', key: 'title', label: 'Tiêu đề' },
        { kind: 'text', key: 'linkLabel', label: 'Chữ link', hint: '{count} = số hãng' },
      ]),
      section('newest', 'Đàn mới về', [
        { kind: 'text', key: 'eyebrow', label: 'Nhãn nhỏ' },
        { kind: 'text', key: 'title', label: 'Tiêu đề' },
        { kind: 'text', key: 'linkLabel', label: 'Chữ link', hint: '{count} = số cây' },
        { kind: 'text', key: 'emptyTitle', label: 'Khi chưa có cây nào — tiêu đề' },
        { kind: 'text', key: 'emptyBody', label: 'Khi chưa có cây nào — mô tả' },
      ]),
      section('grades', 'Thang tình trạng (khối xanh)', [
        { kind: 'text', key: 'eyebrow', label: 'Nhãn nhỏ' },
        { kind: 'text', key: 'title', label: 'Tiêu đề' },
        { kind: 'textarea', key: 'body', label: 'Đoạn dẫn' },
        { kind: 'textarea', key: 'footnote', label: 'Dòng ghi chú dưới cùng' },
        { kind: 'text', key: 'linkLabel', label: 'Chữ link' },
      ]),
      section('services', 'Dịch vụ setup', [
        { kind: 'text', key: 'eyebrow', label: 'Nhãn nhỏ' },
        { kind: 'text', key: 'title', label: 'Tiêu đề' },
        { kind: 'text', key: 'linkLabel', label: 'Chữ link' },
        { kind: 'text', key: 'featuredTag', label: 'Nhãn gói nổi bật' },
        { kind: 'stringList', key: 'trustLines', label: 'Ba dòng cam kết dưới bảng giá' },
      ]),
      section('sell', 'Bán đàn cho shop', [
        { kind: 'text', key: 'eyebrow', label: 'Nhãn nhỏ' },
        { kind: 'text', key: 'title', label: 'Tiêu đề' },
        { kind: 'textarea', key: 'body', label: 'Đoạn dẫn' },
        { kind: 'text', key: 'primaryLabel', label: 'Nút chính' },
        { kind: 'text', key: 'secondaryLabel', label: 'Nút phụ' },
      ]),
      section('courses', 'Khóa học', [
        { kind: 'text', key: 'eyebrow', label: 'Nhãn nhỏ' },
        { kind: 'text', key: 'title', label: 'Tiêu đề' },
        { kind: 'text', key: 'linkLabel', label: 'Chữ link' },
      ]),
      section('reviews', 'Đánh giá', [
        { kind: 'text', key: 'eyebrow', label: 'Nhãn nhỏ' },
        { kind: 'text', key: 'title', label: 'Tiêu đề' },
      ]),
    ],
  },

  catalog_page: {
    shape: 'object',
    fields: [
      { kind: 'text', key: 'title', label: 'Tiêu đề khi không lọc theo danh mục' },
      { kind: 'text', key: 'subtitle', label: 'Dòng phụ', hint: '{count} = số cây' },
      { kind: 'text', key: 'emptyTitle', label: 'Không có kết quả — tiêu đề' },
      { kind: 'textarea', key: 'emptyBody', label: 'Không có kết quả — mô tả' },
    ],
  },

  product_page: {
    shape: 'object',
    fields: [
      section('buy', 'Hộp mua hàng', [
        { kind: 'text', key: 'availableLine', label: 'Dòng "còn hàng"' },
        { kind: 'text', key: 'installmentLine', label: 'Dòng trả góp', hint: '{monthly} = tiền mỗi tháng' },
        { kind: 'text', key: 'inspectionBoxTitle', label: 'Ô kiểm tra — tiêu đề' },
        { kind: 'text', key: 'inspectionBoxBody', label: 'Ô kiểm tra — mô tả', hint: '{passed}/{total} {date}' },
        { kind: 'textarea', key: 'offerHint', label: 'Giải thích trả giá' },
        { kind: 'text', key: 'soldTitle', label: 'Đã bán — tiêu đề' },
        { kind: 'textarea', key: 'soldBody', label: 'Đã bán — mô tả' },
        { kind: 'text', key: 'reservedTitle', label: 'Đang giữ chỗ — tiêu đề' },
        { kind: 'textarea', key: 'reservedBody', label: 'Đang giữ chỗ — mô tả', hint: '{phone} = hotline' },
      ]),
      section('flaws', 'Khối khuyết điểm', [
        { kind: 'text', key: 'flawsEyebrow', label: 'Nhãn nhỏ' },
        { kind: 'text', key: 'flawsTitle', label: 'Tiêu đề' },
        { kind: 'textarea', key: 'flawsBody', label: 'Đoạn dẫn' },
        { kind: 'text', key: 'flawsNone', label: 'Khi không có khuyết điểm' },
      ]),
      section('inspection', 'Khối kiểm tra 32 điểm', [
        { kind: 'text', key: 'inspectionEyebrow', label: 'Nhãn nhỏ' },
        { kind: 'text', key: 'inspectionTitle', label: 'Tiêu đề' },
        { kind: 'textarea', key: 'inspectionBody', label: 'Đoạn dẫn' },
      ]),
      section('more', 'Phần dưới', [
        { kind: 'text', key: 'descriptionTitle', label: 'Tiêu đề "Mô tả"' },
        { kind: 'text', key: 'specsTitle', label: 'Tiêu đề "Thông số"' },
        { kind: 'text', key: 'relatedEyebrow', label: 'Cây tương tự — nhãn nhỏ' },
        { kind: 'text', key: 'relatedEyebrowSold', label: 'Cây tương tự — nhãn khi đã bán' },
        { kind: 'text', key: 'relatedTitle', label: 'Cây tương tự — tiêu đề' },
        { kind: 'text', key: 'relatedLinkLabel', label: 'Cây tương tự — chữ link' },
      ]),
    ],
  },

  footer: {
    shape: 'object',
    fields: [
      { kind: 'text', key: 'tagline', label: 'Câu giới thiệu' },
      { kind: 'textarea', key: 'privacyNote', label: 'Ghi chú bảo mật' },
      {
        kind: 'objectList',
        key: 'columns',
        label: 'Các cột link',
        titleKey: 'title',
        fields: [
          { kind: 'text', key: 'title', label: 'Tên cột' },
          {
            kind: 'objectList',
            key: 'links',
            label: 'Link',
            titleKey: 'label',
            fields: [
              { kind: 'text', key: 'label', label: 'Chữ' },
              { kind: 'text', key: 'href', label: 'Đường dẫn', placeholder: '/dan?category=guitar-dien' },
            ],
          },
        ],
      },
    ],
  },

  placeholder_pages: {
    shape: 'object',
    fields: [
      { kind: 'text', key: 'contactTitle', label: 'Tiêu đề ô liên hệ' },
      { kind: 'text', key: 'backLabel', label: 'Chữ nút quay lại' },
      ...[
        ['dich-vu', 'Trang Setup & sửa chữa'],
        ['khoa-hoc', 'Trang Khóa học'],
        ['ban-dan', 'Trang Bán đàn cho shop'],
        ['gio-hang', 'Trang Giỏ hàng'],
        ['theo-doi', 'Trang Theo dõi'],
        ['thang-tinh-trang', 'Trang Thang tình trạng'],
        ['bao-hanh', 'Trang Bảo hành & đổi trả'],
        ['chinh-sach-bao-mat', 'Trang Chính sách bảo mật'],
      ].map(([slug, label]) =>
        section(slug, label, [
          { kind: 'text', key: 'eyebrow', label: 'Nhãn nhỏ' },
          { kind: 'text', key: 'title', label: 'Tiêu đề' },
          { kind: 'textarea', key: 'body', label: 'Nội dung' },
        ]),
      ),
    ],
  },
};

function section(key: string, label: string, fields: Field[]): Field {
  return { kind: 'group', key, label, fields };
}
