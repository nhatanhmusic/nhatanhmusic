-- Dua not cac tieu de, doan dan, nhan nut con nam cung trong code frontend
-- vao site_settings, de sua duoc tu /admin/noi-dung.
--
-- Cac cho {trong_ngoac} la bien: {count} so cay, {monthly} tien tra gop,
-- {passed}/{total} diem kiem tra, {date} ngay kiem, {city} thanh pho.

INSERT INTO site_settings (key, value, label, description, sort_order) VALUES

('home_sections', '{
  "brands": {
    "title": "Mua theo hãng",
    "linkLabel": "Tất cả {count} hãng"
  },
  "newest": {
    "eyebrow": "Vừa lên kệ",
    "title": "Đàn & gear đang có sẵn",
    "linkLabel": "Xem tất cả {count} sản phẩm",
    "emptyTitle": "Chưa có cây nào lên kệ.",
    "emptyBody": "Vào trang quản trị để thêm cây đàn đầu tiên."
  },
  "grades": {
    "eyebrow": "Minh bạch tình trạng",
    "title": "Đàn cũ được chấm theo thang 6 mức",
    "body": "Mỗi cây đàn đã qua sử dụng đều được xếp một mức tình trạng, kèm ảnh chụp cận từng khuyết điểm. Khi phân vân giữa hai mức, shop luôn chọn mức **thấp hơn** — thà bạn nhận đàn đẹp hơn mong đợi.",
    "footnote": "Mọi khuyết điểm đều được nêu trong phần mô tả **và** chụp ảnh cận — không giấu ở bất kỳ chỗ nào.",
    "linkLabel": "Xem chi tiết thang đánh giá"
  },
  "services": {
    "eyebrow": "Xưởng setup",
    "title": "Ba gói dịch vụ, giá rõ ràng",
    "linkLabel": "Bảng giá đầy đủ & đặt lịch",
    "featuredTag": "Được chọn nhiều nhất",
    "trustLines": [
      "Kiểm tra và báo giá miễn phí, bạn duyệt rồi shop mới làm",
      "Chỉnh lại miễn phí trong 6 tháng nếu chưa vừa tay",
      "Nhận cả đàn không mua tại shop"
    ]
  },
  "sell": {
    "eyebrow": "Thu mua & ký gửi",
    "title": "Có cây đàn không còn chơi tới?",
    "body": "Gửi vài tấm ảnh, shop báo giá trong 24 giờ. Bạn chọn bán đứt lấy tiền ngay, hoặc ký gửi để shop bán giúp với giá cao hơn.",
    "primaryLabel": "Gửi thông tin đàn",
    "secondaryLabel": "So sánh bán đứt / ký gửi"
  },
  "courses": {
    "eyebrow": "Lớp học tại shop",
    "title": "Học guitar từ con số 0",
    "linkLabel": "Xem lịch khai giảng"
  },
  "reviews": {
    "eyebrow": "Khách nói gì",
    "title": "Đánh giá từ người chơi"
  }
}'::jsonb,
 'Tiêu đề các khối trang chủ',
 'Nhãn nhỏ, tiêu đề lớn, đoạn dẫn và chữ trên nút của từng khối. {count} sẽ được thay bằng con số thật.', 10),

('catalog_page', '{
  "title": "Đàn & gear đang có sẵn",
  "subtitle": "{count} cây đang có sẵn tại shop · tất cả đều đã qua kiểm tra 32 điểm",
  "emptyTitle": "Chưa có cây nào khớp bộ lọc này.",
  "emptyBody": "Thử bỏ bớt một vài điều kiện, hoặc để lại số điện thoại — shop báo bạn khi có cây hợp ý về."
}'::jsonb,
 'Trang danh sách đàn',
 'Tiêu đề khi không lọc theo danh mục (lọc theo danh mục thì lấy tên danh mục). {count} là số cây.', 11),

('product_page', '{
  "availableLine": "Chỉ có một cây này · đang ở showroom, thử được ngay",
  "soldTitle": "Cây này đã bán.",
  "soldBody": "Trang được giữ lại để bạn xem lại đúng cây mình đã mua. Kéo xuống cuối trang để xem những cây tương tự đang còn.",
  "reservedTitle": "Cây này đang được giữ chỗ cho một khách khác.",
  "reservedBody": "Gọi {phone} để shop báo bạn ngay nếu khách kia không lấy.",
  "installmentLine": "hoặc **{monthly}/tháng** · trả góp 0% trong 12 tháng",
  "inspectionBoxTitle": "Đã qua kiểm tra 32 điểm của xưởng",
  "inspectionBoxBody": "Đạt {passed}/{total} điểm, kiểm ngày {date}. Xem toàn bộ danh mục bên dưới.",
  "offerHint": "**Trả giá:** gửi mức bạn muốn, shop trả lời trong 24 giờ — đồng ý, từ chối hoặc ra giá lại.",
  "flawsEyebrow": "Không giấu gì",
  "flawsTitle": "Khuyết điểm của đúng cây này",
  "flawsBody": "Mọi vết trên đàn đều được ghi ra đây và chụp cận. Nếu bạn nhận đàn và thấy một vết không có trong danh sách này, shop nhận lại và hoàn tiền.",
  "flawsNone": "Kỹ thuật viên không ghi nhận khuyết điểm nào trên cây này.",
  "inspectionEyebrow": "Trước khi rời shop",
  "inspectionTitle": "Quy trình kiểm tra 32 điểm",
  "inspectionBody": "Áp dụng cho **mọi cây đàn**, không phân biệt giá. Kiểm tra khác với setup: kiểm tra là để chắc đàn không có lỗi, còn setup là chỉnh cho vừa tay người chơi.",
  "descriptionTitle": "Mô tả",
  "specsTitle": "Thông số kỹ thuật",
  "relatedEyebrow": "Có thể bạn cũng thích",
  "relatedEyebrowSold": "Cây này đã bán",
  "relatedTitle": "Những cây tương tự đang còn",
  "relatedLinkLabel": "Xem cả danh mục"
}'::jsonb,
 'Trang chi tiết cây đàn',
 'Các câu cố định trên trang từng cây. Biến: {phone} {monthly} {passed} {total} {date}.', 12),

('footer', '{
  "tagline": "Cửa hàng nhạc cụ & xưởng setup guitar.",
  "privacyNote": "Shop chỉ dùng thông tin của bạn để xử lý đơn và liên hệ về đàn — không bán, không chia sẻ cho bên thứ ba.",
  "columns": [
    { "title": "Mua sắm", "links": [
      { "label": "Guitar điện", "href": "/dan?category=guitar-dien" },
      { "label": "Guitar acoustic", "href": "/dan?category=guitar-acoustic" },
      { "label": "Guitar classic", "href": "/dan?category=guitar-classic" },
      { "label": "Guitar bass", "href": "/dan?category=guitar-bass" },
      { "label": "Tất cả sản phẩm", "href": "/dan" }
    ]},
    { "title": "Dịch vụ", "links": [
      { "label": "Setup & sửa chữa", "href": "/dich-vu" },
      { "label": "Bán đàn cho shop", "href": "/ban-dan" },
      { "label": "Ký gửi", "href": "/ban-dan" },
      { "label": "Khóa học", "href": "/khoa-hoc" }
    ]},
    { "title": "Chính sách", "links": [
      { "label": "Thang đánh giá tình trạng", "href": "/thang-tinh-trang" },
      { "label": "Bảo hành & đổi trả", "href": "/bao-hanh" },
      { "label": "Chính sách bảo mật", "href": "/chinh-sach-bao-mat" }
    ]}
  ]
}'::jsonb,
 'Chân trang',
 'Câu giới thiệu, ghi chú bảo mật và ba cột link.', 13),

('placeholder_pages', '{
  "dich-vu": { "eyebrow": "Setup & sửa chữa", "title": "Đặt lịch setup đang được xây", "body": "Bảng giá ba gói dịch vụ đã có trên trang chủ. Đặt lịch online chưa mở — gọi hoặc nhắn Zalo, shop xếp lịch ngay trong ngày." },
  "khoa-hoc": { "eyebrow": "Khóa học", "title": "Lịch khai giảng đang được cập nhật", "body": "Ba khóa học và học phí đã có trên trang chủ. Đăng ký giữ chỗ online chưa mở — nhắn Zalo để hỏi lớp gần nhất." },
  "ban-dan": { "eyebrow": "Thu mua & ký gửi", "title": "Form gửi thông tin đàn đang được xây", "body": "Muốn bán hoặc ký gửi đàn thì chụp 5 tấm ảnh (toàn thân, lưng, đầu cần, cầu đàn, mặt phím) rồi nhắn Zalo. Shop báo giá trong 24 giờ." },
  "gio-hang": { "eyebrow": "Giỏ hàng", "title": "Đặt hàng online đang được xây", "body": "Hiện tại chốt đơn qua điện thoại hoặc Zalo. Mỗi cây đàn chỉ có một, nên cứ gọi trước để shop giữ cho bạn." },
  "theo-doi": { "eyebrow": "Theo dõi", "title": "Danh sách theo dõi đang được xây", "body": "Chức năng lưu cây đàn bạn thích và báo khi giảm giá sẽ có sau. Tạm thời nhắn Zalo tên cây, shop ghi lại và báo bạn." },
  "thang-tinh-trang": { "eyebrow": "Minh bạch tình trạng", "title": "Thang đánh giá tình trạng đàn", "body": "Sáu mức từ Mới 100% đến Cần sửa, giải thích từng mức đã có ở khối màu xanh trên trang chủ. Trang riêng với ảnh minh họa từng mức sẽ được bổ sung." },
  "bao-hanh": { "eyebrow": "Chính sách", "title": "Bảo hành & đổi trả", "body": "Bảo hành 12 tháng của shop áp dụng cả với đàn đã qua sử dụng.\n\nĐổi trả trong 7 ngày nếu đàn không đúng mô tả, shop chịu phí ship chiều về.\n\nVăn bản đầy đủ đang được soạn." },
  "chinh-sach-bao-mat": { "eyebrow": "Chính sách", "title": "Chính sách bảo mật", "body": "Shop chỉ dùng thông tin của bạn để xử lý đơn và liên hệ về đàn. Không bán, không chia sẻ cho bên thứ ba.\n\nVăn bản đầy đủ theo Luật Bảo vệ dữ liệu cá nhân đang được soạn." },
  "contactTitle": "Liên hệ trực tiếp",
  "backLabel": "Xem đàn đang có"
}'::jsonb,
 'Các trang tạm (chưa xây)',
 'Nội dung 8 trang đang giữ chỗ: dịch vụ, khóa học, bán đàn, giỏ hàng, theo dõi và 3 trang chính sách. Viết dài được, xuống dòng hai lần là đoạn mới.', 14);
