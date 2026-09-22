-- Noi dung tinh cua web: truoc day nam trong file .tsx, gio dua vao database
-- de sua duoc tu trang quan tri.
--
-- Moi dong la mot KHOI noi dung, value la JSONB vi cac khoi co hinh dang khac nhau
-- (khoi la danh sach, khoi la doi tuong). Frontend doc theo key, admin co form rieng
-- cho tung khoi — khong bat ai go JSON bang tay.
--
-- Chu trong noi dung ho tro **in dam** kieu markdown.

CREATE TABLE site_settings (
    key         VARCHAR(80) PRIMARY KEY,
    value       JSONB        NOT NULL,
    label       VARCHAR(200) NOT NULL,
    description TEXT,
    sort_order  INT          NOT NULL DEFAULT 0,
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

INSERT INTO site_settings (key, value, label, description, sort_order) VALUES

('shop_contact', '{
  "phone": "[SỐ HOTLINE]",
  "address": "[ĐỊA CHỈ SHOP]",
  "hours": "[GIỜ MỞ CỬA]",
  "city": "Biên Hòa",
  "rating": "[4.9]",
  "reviewCount": "[số]",
  "businessInfo": "[Số ĐKKD] · [Tên chủ hộ kinh doanh]"
}'::jsonb,
 'Thông tin shop',
 'Hiện ở thanh trên cùng, chân trang và hộp mua hàng. Điền đúng rồi bỏ dấu ngoặc vuông đi.', 1),

('trust_points', '[
  "Ảnh chụp đúng cây bạn nhận",
  "Bảo hành 12 tháng, kể cả đàn cũ",
  "Đổi trả trong 7 ngày",
  "Setup lại miễn phí trọn đời",
  "Trả góp 0% qua thẻ"
]'::jsonb,
 'Dải cam kết đầu trang',
 'Năm dòng ngắn nằm ngay dưới thanh điều hướng, hiện trên mọi trang khách.', 2),

('home_hero', '{
  "eyebrow": "Mua · Bán · Trao đổi · Setup · Dạy đàn",
  "titleLine1": "Cây đàn bạn thấy trên web",
  "titleLine2": "là đúng cây bạn nhận.",
  "body": "Mỗi cây đàn ở shop được chụp riêng, cân riêng và ghi rõ serial — không dùng ảnh mẫu của hãng. Trước khi giao, tất cả đều qua **quy trình kiểm tra 32 điểm** của xưởng.",
  "primaryLabel": "Xem đàn đang có",
  "primaryHref": "/dan",
  "secondaryLabel": "Đặt lịch setup / sửa chữa",
  "secondaryHref": "/dich-vu",
  "photoBadge": "Ảnh chụp tại shop · không phải ảnh hãng",
  "stats": [
    { "value": "[900+]", "label": "cây đàn đã qua xưởng" },
    { "value": "[6 năm]", "label": "kinh nghiệm luthier" },
    { "value": "12 tháng", "label": "bảo hành cả đàn cũ" }
  ]
}'::jsonb,
 'Khối đầu trang chủ',
 'Tiêu đề lớn, đoạn giới thiệu và ba con số. Nhớ thay hai con số trong ngoặc vuông bằng số thật.', 3),

('grade_meanings', '{
  "NEW": "Nguyên seal, còn bảo hành hãng, chưa ai chơi.",
  "MINT": "Không một vết, chưa độ chế gì. Nhìn không khác hàng mới.",
  "EXCELLENT": "Vài vết rất nhỏ: vết pick, vết tay ở cần. Phải soi kỹ mới thấy.",
  "VERY_GOOD": "Thấy rõ vết xước, móp sơn hoặc vết khóa thắt lưng ở lưng đàn.",
  "GOOD": "Khuyết điểm rõ rệt nhưng đàn vẫn chơi tốt, mọi thứ hoạt động.",
  "FAIR": "Có lỗi ảnh hưởng sử dụng, đã ghi rõ và trừ vào giá bán."
}'::jsonb,
 'Giải thích 6 mức tình trạng',
 'Hiện ở khối xanh trang chủ. Sáu mức là cố định, chỉ sửa được phần mô tả.', 4),

('service_tiers', '[
  {
    "tier": "Gói 1",
    "name": "Kiểm tra & chỉnh nhanh",
    "priceVnd": 250000,
    "priceFrom": false,
    "duration": "60 phút, chờ lấy ngay",
    "includes": [
      "Chỉnh action theo tay bạn",
      "Cân lại truss rod",
      "Chỉnh intonation",
      "Kiểm tra tổng quát, báo lỗi nếu có"
    ],
    "note": "Chưa gồm tiền dây.",
    "featured": false
  },
  {
    "tier": "Gói 2",
    "name": "Setup toàn diện",
    "priceVnd": 450000,
    "priceFrom": false,
    "duration": "2 giờ",
    "includes": [
      "Toàn bộ gói 1",
      "Thay dây mới, cỡ dây bạn chọn",
      "Vệ sinh & dưỡng fretboard",
      "Đánh bóng phím",
      "Kiểm tra & siết lại toàn bộ hardware"
    ],
    "note": "Đã gồm một bộ dây tiêu chuẩn.",
    "featured": true
  },
  {
    "tier": "Gói 3",
    "name": "Xử lý phím (fret work)",
    "priceVnd": 900000,
    "priceFrom": true,
    "duration": "3–5 ngày",
    "includes": [
      "Cân lại mặt phím toàn cần (level)",
      "Vê lại đỉnh phím (crown)",
      "Đánh bóng từng phím",
      "Setup lại hoàn chỉnh sau khi làm"
    ],
    "note": "Báo giá chính xác sau khi soi cần tại shop.",
    "featured": false
  }
]'::jsonb,
 'Ba gói dịch vụ setup',
 'Giá phải khớp với giá shop đang lấy thật. Đây là bảng giá tạm cho tới Giai đoạn 3.', 5),

('sell_steps', '[
  { "step": "01", "title": "Gửi ảnh & mô tả", "body": "Điền form trên web hoặc nhắn Zalo. Mất chừng 3 phút." },
  { "step": "02", "title": "Nhận báo giá trong 24h", "body": "Kèm giải thích shop định giá dựa trên gì. Không mất phí." },
  { "step": "03", "title": "Mang đàn tới kiểm tra", "body": "Soi trực tiếp, chốt giá cuối. Không khớp ảnh thì bạn mang về, không sao cả." },
  { "step": "04", "title": "Nhận tiền ngay", "body": "Tiền mặt hoặc chuyển khoản trong ngày. Ký gửi thì trả sau khi bán được." }
]'::jsonb,
 'Bốn bước bán đàn cho shop',
 'Khối màu đồng ở giữa trang chủ.', 6),

('courses', '[
  {
    "tag": "Nhập môn",
    "tone": "green",
    "name": "Guitar cơ bản — 8 buổi",
    "body": "Cầm đàn đúng, 12 hợp âm nền, 4 điệu quạt chả. Kết khóa đệm được vài bài trọn vẹn.",
    "meta": "90 phút/buổi · Tối đa 6 học viên",
    "priceVnd": 1600000
  },
  {
    "tag": "Phổ biến nhất",
    "tone": "brass",
    "name": "Đệm hát cấp tốc — 12 buổi",
    "body": "Cho người đã biết vài hợp âm nhưng chưa đệm mượt. Tập trung tiết tấu và chuyển hợp âm.",
    "meta": "90 phút/buổi · Tối đa 6 học viên",
    "priceVnd": 2200000
  },
  {
    "tag": "Guitar điện",
    "tone": "green",
    "name": "Điện & solo nhập môn — 10 buổi",
    "body": "Kỹ thuật tay phải, bending, pentatonic và cách chỉnh tone trên amp, pedal.",
    "meta": "90 phút/buổi · Tối đa 4 học viên",
    "priceVnd": 2500000
  }
]'::jsonb,
 'Khóa học trên trang chủ',
 'Danh sách rút gọn. Giai đoạn 5 sẽ có bảng khóa học và lớp riêng, khối này khi đó chỉ còn để giới thiệu.', 7),

('reviews', '[
  { "rating": 5, "body": "[Dán đánh giá thật của khách từ Google Reviews hoặc Facebook vào đây — xin phép trước khi đăng.]", "name": "[Tên khách]", "meta": "Setup Stratocaster · [tháng/năm]" },
  { "rating": 5, "body": "[Đánh giá thật của khách.]", "name": "[Tên khách]", "meta": "Mua Yamaha Pacifica · [tháng/năm]" },
  { "rating": 5, "body": "[Đánh giá thật của khách.]", "name": "[Tên học viên]", "meta": "Lớp guitar cơ bản · [tháng/năm]" }
]'::jsonb,
 'Đánh giá của khách',
 'Chỉ đăng đánh giá thật và phải xin phép khách trước.', 8),

('buybox_promises', '[
  { "icon": "truck", "text": "Giao nội thành {city} trong 24h · miễn phí. Tỉnh khác 2–4 ngày, đóng thùng gỗ." },
  { "icon": "shield", "text": "Bảo hành 12 tháng của shop — áp dụng cả với đàn đã qua sử dụng." },
  { "icon": "return", "text": "Đổi trả trong 7 ngày nếu đàn không đúng như mô tả — shop chịu phí ship chiều về." }
]'::jsonb,
 'Cam kết ở hộp mua hàng',
 'Hiện trong trang chi tiết từng cây đàn. Dùng {city} để chèn tên thành phố từ Thông tin shop.', 9);
