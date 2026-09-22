-- Noi dung chu shop da nhap tren may lap trinh vien truoc khi deploy (hotline,
-- dia chi, gio mo cua, doan gioi thieu...). Dua vao day de ban online len la co san,
-- khong phai nhap lai.
--
-- Dung dollar-quoting ($json$...$json$) de khong phai escape dau nhay don trong
-- tieng Viet. Sau khi da deploy, KHONG sua file nay — muon doi noi dung thi vao
-- /admin/noi-dung.

UPDATE site_settings SET value = $json$
{
  "city": "Long Khánh",
  "hours": "8h - 22h",
  "phone": "0908928517",
  "rating": "",
  "address": "143/5 Hùng Vương ( lầu 1)",
  "reviewCount": "",
  "businessInfo": ""
}$json$::jsonb, updated_at = now()
WHERE key = 'shop_contact';

UPDATE site_settings SET value = $json$
[
  "Ảnh chụp đúng 100% cây đàn bạn nhận",
  "Bảo hành 12 tháng",
  "Đổi trả trong 7 ngày",
  "Setup 3 lần miễn phí từ lúc mua đàn"
]$json$::jsonb, updated_at = now()
WHERE key = 'trust_points';

UPDATE site_settings SET value = $json$
{
  "body": "Với mong muốn mang đến trải nghiệm âm nhạc dễ tiếp cận và chất lượng, NHAT ANH Music luôn lựa chọn những sản phẩm phù hợp, đa dạng phân khúc và cập nhật các mẫu nhạc cụ đang được yêu thích.\n\nKhông chỉ bán nhạc cụ, NHAT ANH Music còn đồng hành cùng khách hàng trong việc tư vấn, lựa chọn, setup và chăm sóc nhạc cụ, giúp bạn tìm được cây đàn phù hợp với nhu cầu và phong cách của mình.",
  "stats": [
    {
      "label": "kinh nghiệm luthier",
      "value": "6 năm"
    },
    {
      "label": "bảo hành cả đàn cũ",
      "value": "12 tháng"
    },
    {
      "value": "50+ mẫu đàn"
    }
  ],
  "eyebrow": "Mua · Bán · Trao đổi · Setup · Dạy đàn",
  "photoBadge": "Ảnh chụp tại shop · không phải ảnh hãng",
  "titleLine1": "NHAT ANH Music là cửa hàng chuyên cung cấp guitar acoustic, electric guitar",
  "titleLine2": "",
  "primaryHref": "/dan",
  "primaryLabel": "Xem đàn đang có",
  "secondaryHref": "/dich-vu",
  "secondaryLabel": "Đặt lịch setup / sửa chữa"
}$json$::jsonb, updated_at = now()
WHERE key = 'home_hero';

UPDATE site_settings SET value = $json$
{
  "NEW": "Nguyên seal, còn bảo hành hãng, chưa ai chơi.",
  "FAIR": "Có lỗi ảnh hưởng sử dụng, đã ghi rõ và trừ vào giá bán.",
  "GOOD": "Khuyết điểm rõ rệt nhưng đàn vẫn chơi tốt, mọi thứ hoạt động.",
  "MINT": "Không một vết, chưa độ chế gì. Nhìn không khác hàng mới.",
  "EXCELLENT": "Vài vết rất nhỏ: vết pick, vết tay ở cần. Phải soi kỹ mới thấy.",
  "VERY_GOOD": "Thấy rõ vết xước, móp sơn hoặc vết khóa thắt lưng ở lưng đàn."
}$json$::jsonb, updated_at = now()
WHERE key = 'grade_meanings';

UPDATE site_settings SET value = $json$
[
  {
    "name": "Kiểm tra & chỉnh nhanh",
    "note": "Chưa gồm tiền dây.",
    "tier": "Gói 1",
    "duration": "60 phút, chờ lấy ngay",
    "featured": false,
    "includes": [
      "Chỉnh action theo tay bạn",
      "Cân lại truss rod",
      "Chỉnh intonation",
      "Kiểm tra tổng quát, báo lỗi nếu có"
    ],
    "priceVnd": 250000,
    "priceFrom": false
  },
  {
    "name": "Setup toàn diện",
    "note": "Đã gồm một bộ dây tiêu chuẩn.",
    "tier": "Gói 2",
    "duration": "2 giờ",
    "featured": true,
    "includes": [
      "Toàn bộ gói 1",
      "Thay dây mới, cỡ dây bạn chọn",
      "Vệ sinh & dưỡng fretboard",
      "Đánh bóng phím",
      "Kiểm tra & siết lại toàn bộ hardware"
    ],
    "priceVnd": 450000,
    "priceFrom": false
  },
  {
    "name": "Xử lý phím (fret work)",
    "note": "Báo giá chính xác sau khi soi cần tại shop.",
    "tier": "Gói 3",
    "duration": "3–5 ngày",
    "featured": false,
    "includes": [
      "Cân lại mặt phím toàn cần (level)",
      "Vê lại đỉnh phím (crown)",
      "Đánh bóng từng phím",
      "Setup lại hoàn chỉnh sau khi làm"
    ],
    "priceVnd": 900000,
    "priceFrom": true
  }
]$json$::jsonb, updated_at = now()
WHERE key = 'service_tiers';

UPDATE site_settings SET value = $json$
[
  {
    "body": "Điền form trên web hoặc nhắn Zalo. Mất chừng 3 phút.",
    "step": "01",
    "title": "Gửi ảnh & mô tả"
  },
  {
    "body": "Kèm giải thích shop định giá dựa trên gì. Không mất phí.",
    "step": "02",
    "title": "Nhận báo giá trong 24h"
  },
  {
    "body": "Soi trực tiếp, chốt giá cuối. Không khớp ảnh thì bạn mang về, không sao cả.",
    "step": "03",
    "title": "Mang đàn tới kiểm tra"
  },
  {
    "body": "Tiền mặt hoặc chuyển khoản trong ngày. Ký gửi thì trả sau khi bán được.",
    "step": "04",
    "title": "Nhận tiền ngay"
  }
]$json$::jsonb, updated_at = now()
WHERE key = 'sell_steps';

UPDATE site_settings SET value = $json$
[
  {
    "tag": "Nhập môn",
    "body": "Cầm đàn đúng, 12 hợp âm nền, 4 điệu quạt chả. Kết khóa đệm được vài bài trọn vẹn.",
    "meta": "90 phút/buổi · Tối đa 6 học viên",
    "name": "Guitar cơ bản — 8 buổi",
    "tone": "green",
    "priceVnd": 1600000
  },
  {
    "tag": "Phổ biến nhất",
    "body": "Cho người đã biết vài hợp âm nhưng chưa đệm mượt. Tập trung tiết tấu và chuyển hợp âm.",
    "meta": "90 phút/buổi · Tối đa 6 học viên",
    "name": "Đệm hát cấp tốc — 12 buổi",
    "tone": "brass",
    "priceVnd": 2200000
  },
  {
    "tag": "Guitar điện",
    "body": "Kỹ thuật tay phải, bending, pentatonic và cách chỉnh tone trên amp, pedal.",
    "meta": "90 phút/buổi · Tối đa 4 học viên",
    "name": "Điện & solo nhập môn — 10 buổi",
    "tone": "green",
    "priceVnd": 2500000
  }
]$json$::jsonb, updated_at = now()
WHERE key = 'courses';

UPDATE site_settings SET value = $json$
[
  {
    "body": "[Dán đánh giá thật của khách từ Google Reviews hoặc Facebook vào đây — xin phép trước khi đăng.]",
    "meta": "Setup Stratocaster · [tháng/năm]",
    "name": "[Tên khách]",
    "rating": 5
  },
  {
    "body": "[Đánh giá thật của khách.]",
    "meta": "Mua Yamaha Pacifica · [tháng/năm]",
    "name": "[Tên khách]",
    "rating": 5
  },
  {
    "body": "[Đánh giá thật của khách.]",
    "meta": "Lớp guitar cơ bản · [tháng/năm]",
    "name": "[Tên học viên]",
    "rating": 5
  }
]$json$::jsonb, updated_at = now()
WHERE key = 'reviews';

UPDATE site_settings SET value = $json$
[
  {
    "icon": "truck",
    "text": "Giao nội thành {city} trong 24h · miễn phí. Tỉnh khác 2–4 ngày, đóng thùng gỗ."
  },
  {
    "icon": "shield",
    "text": "Bảo hành 12 tháng của shop — áp dụng cả với đàn đã qua sử dụng."
  },
  {
    "icon": "return",
    "text": "Đổi trả trong 7 ngày nếu đàn không đúng như mô tả — shop chịu phí ship chiều về."
  }
]$json$::jsonb, updated_at = now()
WHERE key = 'buybox_promises';

UPDATE site_settings SET value = $json$
{
  "sell": {
    "body": "Gửi vài tấm ảnh, shop báo giá trong 24 giờ. Bạn chọn bán đứt lấy tiền ngay, hoặc ký gửi để shop bán giúp với giá cao hơn.",
    "title": "Có cây đàn không còn chơi tới?",
    "eyebrow": "Thu mua & ký gửi",
    "primaryLabel": "Gửi thông tin đàn",
    "secondaryLabel": "So sánh bán đứt / ký gửi"
  },
  "brands": {
    "title": "Mua theo hãng",
    "linkLabel": "Tất cả {count} hãng"
  },
  "grades": {
    "body": "Mỗi cây đàn đã qua sử dụng đều được xếp một mức tình trạng, kèm ảnh chụp cận từng khuyết điểm. Khi phân vân giữa hai mức, shop luôn chọn mức **thấp hơn** — thà bạn nhận đàn đẹp hơn mong đợi.",
    "title": "Đàn cũ được chấm theo thang 6 mức",
    "eyebrow": "Minh bạch tình trạng",
    "footnote": "Mọi khuyết điểm đều được nêu trong phần mô tả **và** chụp ảnh cận — không giấu ở bất kỳ chỗ nào.",
    "linkLabel": "Xem chi tiết thang đánh giá"
  },
  "newest": {
    "title": "Đàn & gear đang có sẵn",
    "eyebrow": "Vừa lên kệ",
    "emptyBody": "Vào trang quản trị để thêm cây đàn đầu tiên.",
    "linkLabel": "Xem tất cả {count} sản phẩm",
    "emptyTitle": "Chưa có cây nào lên kệ."
  },
  "courses": {
    "title": "Học guitar từ con số 0",
    "eyebrow": "Lớp học tại shop",
    "linkLabel": "Xem lịch khai giảng"
  },
  "reviews": {
    "title": "Đánh giá từ người chơi",
    "eyebrow": "Khách nói gì"
  },
  "services": {
    "title": "Ba gói dịch vụ, giá rõ ràng",
    "eyebrow": "Xưởng setup",
    "linkLabel": "Bảng giá đầy đủ & đặt lịch",
    "trustLines": [
      "Kiểm tra và báo giá miễn phí, bạn duyệt rồi shop mới làm",
      "Chỉnh lại miễn phí trong 6 tháng nếu chưa vừa tay",
      "Nhận cả đàn không mua tại shop"
    ],
    "featuredTag": "Được chọn nhiều nhất"
  }
}$json$::jsonb, updated_at = now()
WHERE key = 'home_sections';

UPDATE site_settings SET value = $json$
{
  "title": "Đàn & gear đang có sẵn",
  "subtitle": "{count} cây đang có sẵn tại shop · tất cả đều đã qua kiểm tra 32 điểm",
  "emptyBody": "Thử bỏ bớt một vài điều kiện, hoặc để lại số điện thoại — shop báo bạn khi có cây hợp ý về.",
  "emptyTitle": "Chưa có cây nào khớp bộ lọc này."
}$json$::jsonb, updated_at = now()
WHERE key = 'catalog_page';

UPDATE site_settings SET value = $json$
{
  "soldBody": "Trang được giữ lại để bạn xem lại đúng cây mình đã mua. Kéo xuống cuối trang để xem những cây tương tự đang còn.",
  "flawsBody": "Mọi vết trên đàn đều được ghi ra đây và chụp cận. Nếu bạn nhận đàn và thấy một vết không có trong danh sách này, shop nhận lại và hoàn tiền.",
  "flawsNone": "Kỹ thuật viên không ghi nhận khuyết điểm nào trên cây này.",
  "offerHint": "**Trả giá:** gửi mức bạn muốn, shop trả lời trong 24 giờ — đồng ý, từ chối hoặc ra giá lại.",
  "soldTitle": "Cây này đã bán.",
  "flawsTitle": "Khuyết điểm của đúng cây này",
  "specsTitle": "Thông số kỹ thuật",
  "flawsEyebrow": "Không giấu gì",
  "relatedTitle": "Những cây tương tự đang còn",
  "reservedBody": "Gọi {phone} để shop báo bạn ngay nếu khách kia không lấy.",
  "availableLine": "Chỉ có một cây này · đang ở showroom, thử được ngay",
  "reservedTitle": "Cây này đang được giữ chỗ cho một khách khác.",
  "inspectionBody": "Áp dụng cho **mọi cây đàn**, không phân biệt giá. Kiểm tra khác với setup: kiểm tra là để chắc đàn không có lỗi, còn setup là chỉnh cho vừa tay người chơi.",
  "relatedEyebrow": "Có thể bạn cũng thích",
  "inspectionTitle": "Quy trình kiểm tra 32 điểm",
  "installmentLine": "hoặc **{monthly}/tháng** · trả góp 0% trong 12 tháng",
  "descriptionTitle": "Mô tả",
  "relatedLinkLabel": "Xem cả danh mục",
  "inspectionBoxBody": "Đạt {passed}/{total} điểm, kiểm ngày {date}. Xem toàn bộ danh mục bên dưới.",
  "inspectionEyebrow": "Trước khi rời shop",
  "inspectionBoxTitle": "Đã qua kiểm tra 32 điểm của xưởng",
  "relatedEyebrowSold": "Cây này đã bán"
}$json$::jsonb, updated_at = now()
WHERE key = 'product_page';

UPDATE site_settings SET value = $json$
{
  "columns": [
    {
      "links": [
        {
          "href": "/dan?category=guitar-dien",
          "label": "Guitar điện"
        },
        {
          "href": "/dan?category=guitar-acoustic",
          "label": "Guitar acoustic"
        },
        {
          "href": "/dan?category=guitar-classic",
          "label": "Guitar classic"
        },
        {
          "href": "/dan?category=guitar-bass",
          "label": "Guitar bass"
        },
        {
          "href": "/dan",
          "label": "Tất cả sản phẩm"
        }
      ],
      "title": "Mua sắm"
    },
    {
      "links": [
        {
          "href": "/dich-vu",
          "label": "Setup & sửa chữa"
        },
        {
          "href": "/ban-dan",
          "label": "Bán đàn cho shop"
        },
        {
          "href": "/ban-dan",
          "label": "Ký gửi"
        },
        {
          "href": "/khoa-hoc",
          "label": "Khóa học"
        }
      ],
      "title": "Dịch vụ"
    },
    {
      "links": [
        {
          "href": "/thang-tinh-trang",
          "label": "Thang đánh giá tình trạng"
        },
        {
          "href": "/bao-hanh",
          "label": "Bảo hành & đổi trả"
        },
        {
          "href": "/chinh-sach-bao-mat",
          "label": "Chính sách bảo mật"
        }
      ],
      "title": "Chính sách"
    }
  ],
  "tagline": "Cửa hàng nhạc cụ & xưởng setup guitar.",
  "privacyNote": "Shop chỉ dùng thông tin của bạn để xử lý đơn và liên hệ về đàn — không bán, không chia sẻ cho bên thứ ba."
}$json$::jsonb, updated_at = now()
WHERE key = 'footer';

UPDATE site_settings SET value = $json$
{
  "ban-dan": {
    "body": "Muốn bán hoặc ký gửi đàn thì chụp 5 tấm ảnh (toàn thân, lưng, đầu cần, cầu đàn, mặt phím) rồi nhắn Zalo. Shop báo giá trong 24 giờ.",
    "title": "Form gửi thông tin đàn đang được xây",
    "eyebrow": "Thu mua & ký gửi"
  },
  "dich-vu": {
    "body": "Bảng giá ba gói dịch vụ đã có trên trang chủ. Đặt lịch online chưa mở — gọi hoặc nhắn Zalo, shop xếp lịch ngay trong ngày.",
    "title": "Đặt lịch setup đang được xây",
    "eyebrow": "Setup & sửa chữa"
  },
  "bao-hanh": {
    "body": "Bảo hành 12 tháng của shop áp dụng cả với đàn đã qua sử dụng.\n\nĐổi trả trong 7 ngày nếu đàn không đúng mô tả, shop chịu phí ship chiều về.\n\nVăn bản đầy đủ đang được soạn.",
    "title": "Bảo hành & đổi trả",
    "eyebrow": "Chính sách"
  },
  "gio-hang": {
    "body": "Hiện tại chốt đơn qua điện thoại hoặc Zalo. Mỗi cây đàn chỉ có một, nên cứ gọi trước để shop giữ cho bạn.",
    "title": "Đặt hàng online đang được xây",
    "eyebrow": "Giỏ hàng"
  },
  "khoa-hoc": {
    "body": "Ba khóa học và học phí đã có trên trang chủ. Đăng ký giữ chỗ online chưa mở — nhắn Zalo để hỏi lớp gần nhất.",
    "title": "Lịch khai giảng đang được cập nhật",
    "eyebrow": "Khóa học"
  },
  "theo-doi": {
    "body": "Chức năng lưu cây đàn bạn thích và báo khi giảm giá sẽ có sau. Tạm thời nhắn Zalo tên cây, shop ghi lại và báo bạn.",
    "title": "Danh sách theo dõi đang được xây",
    "eyebrow": "Theo dõi"
  },
  "backLabel": "Xem đàn đang có",
  "contactTitle": "Liên hệ trực tiếp",
  "thang-tinh-trang": {
    "body": "Sáu mức từ Mới 100% đến Cần sửa, giải thích từng mức đã có ở khối màu xanh trên trang chủ. Trang riêng với ảnh minh họa từng mức sẽ được bổ sung.",
    "title": "Thang đánh giá tình trạng đàn",
    "eyebrow": "Minh bạch tình trạng"
  },
  "chinh-sach-bao-mat": {
    "body": "Shop chỉ dùng thông tin của bạn để xử lý đơn và liên hệ về đàn. Không bán, không chia sẻ cho bên thứ ba.\n\nVăn bản đầy đủ theo Luật Bảo vệ dữ liệu cá nhân đang được soạn.",
    "title": "Chính sách bảo mật",
    "eyebrow": "Chính sách"
  }
}$json$::jsonb, updated_at = now()
WHERE key = 'placeholder_pages';
