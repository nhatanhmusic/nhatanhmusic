# Website Nhật Anh Music — chi phí vận hành & kế hoạch phát triển

*Tài liệu dành cho chủ shop. Cập nhật tháng 9/2026. Giá tính theo USD, quy đổi tham
khảo 1 $ ≈ 26.000 ₫.*

---

## Tổng chi phí một năm

| | Năm đầu | Mỗi năm sau |
|---|---|---|
| Hạ tầng chạy web (Railway + Neon + Netlify + Cloudflare R2) | 5 $ × 12 tháng = 60 $ ≈ **1.560.000 ₫** | ≈ 1.560.000 ₫ |
| Tên miền `.vn` tại PA Việt Nam | **450.000 ₫** | 512.000 ₫ |
| **Tổng** | **≈ 2.010.000 ₫** | **≈ 2.072.000 ₫** |

Tính ra khoảng **170.000 ₫ mỗi tháng**.

Hạ tầng trả theo tháng bằng thẻ, hủy lúc nào cũng được, không phí cài đặt. Tên miền
trả theo năm. Toàn bộ dữ liệu (đàn, giá, ảnh, nội dung) thuộc về shop và chuyển đi
nơi khác được.

---

## Tên miền — mua ở PA Việt Nam

Bảng giá tại pavietnam.vn, tra ngày 22/9/2026, **chưa gồm VAT** trừ chỗ ghi rõ:

| Đuôi | Đăng ký năm đầu | Gia hạn mỗi năm | Ghi chú |
|---|---|---|---|
| **`.vn`** — đề xuất | **450.000 ₫** (lệ phí 100.000 + phí duy trì 350.000, VAT 0) | **512.000 ₫** (duy trì 350.000 + quản trị 150.000 + VAT 12.000) | Đuôi quốc gia, do Bộ KH&CN quản lý |
| `.com.vn` | 350.000 ₫ | 412.000 ₫ | Rẻ hơn `.vn` 100.000/năm, ít "sang" hơn |
| `.com` | 25.000 ₫ **nhưng phải đăng ký 3 năm một lần** | 429.000 ₫ + VAT ≈ 472.000 ₫ | Đuôi quốc tế |

**Vì sao đề xuất `.vn`:** khách Việt Nam tin đuôi `.vn` hơn — biết chắc là doanh nghiệp
trong nước, có đăng ký thật. Google cũng ưu tiên `.vn` khi người dùng ở Việt Nam tìm
kiếm. Tranh chấp tên miền (nếu có) xử lý trong nước. Chênh với `.com.vn` chỉ 100.000 ₫
một năm.

**Trong giá tên miền đã có:** quản lý DNS (trỏ tên miền về web), bảo vệ thông tin chủ
sở hữu năm đầu, tài khoản quản trị tên miền. **Không cần** mua thêm hosting, email hay
SSL của PA Việt Nam — web đã có hạ tầng riêng, SSL (ổ khóa `https`) được Netlify và
Railway cấp miễn phí, tự gia hạn.

**Tên miền đứng tên ai:** đăng ký bằng thông tin của chủ shop (CMND/CCCD hoặc giấy ĐKKD
với `.vn`). Người kỹ thuật chỉ cần quyền vào phần DNS để trỏ. Tên miền là tài sản của
shop, đổi người làm web không mất.

**Sau khi mua, người kỹ thuật cần ~1 giờ để:**

1. Trỏ `nhatanhmusic.vn` và `www.nhatanhmusic.vn` về Netlify — trang khách
2. Trỏ `api.nhatanhmusic.vn` về Railway — bộ máy xử lý
3. Cập nhật hai biến cấu hình trên Railway cho khớp tên miền mới
4. Chờ 15 phút – vài giờ để tên miền lan ra toàn cầu, SSL tự bật

Đề xuất mua **2 năm một lần** để khỏi quên gia hạn — tên miền hết hạn là web tắt và
sau 30–60 ngày người khác mua mất.

---

## Website gồm bốn phần

Một website bán hàng không phải một thứ duy nhất mà là bốn phần ghép lại, mỗi phần
thuê ở một nơi chuyên làm việc đó. Tách ra như vậy để phần nào cũng dùng được gói
rẻ nhất, và hỏng phần nào chỉ thay phần đó.

| Phần | Làm gì | Ví dụ đời thường | Thuê ở |
|---|---|---|---|
| **Giao diện** | Những gì khách nhìn thấy trên điện thoại, máy tính | Mặt tiền cửa hàng | Netlify |
| **Bộ máy xử lý** | Tìm kiếm, lọc đàn, đăng nhập quản trị, tính toán | Nhân viên đứng quầy | Railway |
| **Cơ sở dữ liệu** | Nơi lưu từng cây đàn, giá, khuyết điểm, phiếu kiểm tra, nội dung web | Sổ sách kho | Neon |
| **Kho ảnh** | Toàn bộ ảnh đàn, mỗi cây 5–6 tấm cộng ảnh cận khuyết điểm | Album ảnh | Cloudflare R2 |

---

## Hạ tầng chạy web — 5 $/tháng gồm những gì

| Dịch vụ | Gói | Giá/tháng | Gói này cho được gì | Đủ tới mức nào |
|---|---|---|---|---|
| **Railway** — bộ máy xử lý | Hobby | **5 $** | Máy chạy 24/24, không tắt | Vài nghìn lượt xem/ngày vẫn thoải mái |
| **Neon** — cơ sở dữ liệu | Free | 0 $ | 0,5 GB dữ liệu, tự sao lưu, khôi phục về 6 giờ trước | Kho 128 cây dùng ~5 MB, tức **1 %**. Vài nghìn cây vẫn chưa hết |
| **Netlify** — giao diện | Free | 0 $ | 300 "credit"/tháng, xem giải thích bên dưới | Đủ cho lượng khách hiện tại |
| **Cloudflare R2** — kho ảnh | Free | 0 $ | 10 GB ảnh, **không tính phí tải ảnh ra** | ≈ **3.000 cây đàn** với 6 ảnh mỗi cây |
| **Tổng** | | **5 $** | | |

### Về Netlify Free — điều duy nhất cần để mắt

Netlify tính bằng "credit": mỗi tháng có 300, hết là web **tạm tắt tới đầu tháng
sau**. Cách tiêu credit:

- Mỗi lần cập nhật code lên web: 15 credit → tối đa **20 lần/tháng**
- Mỗi GB khách tải: 20 credit → khoảng **15 GB/tháng** ≈ 30.000 lượt xem trang

Với shop, phần tốn nhất là số lần cập nhật code lúc đang phát triển. Thời gian phát
triển sẽ được **gom nhiều thay đổi rồi mới đẩy lên một lần** để không chạm ngưỡng.
Sửa giá, thêm đàn, đổi nội dung trong trang quản trị **không tốn credit** — chỉ code
mới tốn.

Nếu một tháng nào đó web tắt vì hết credit: nâng lên gói Personal **9 $/tháng**
(1.000 credit, và mua thêm được). Chưa cần lúc này.

---

## Sau này nếu khách đông hơn

Không cần làm gì bây giờ. Ghi ra để biết trước chỗ nào có thể phát sinh và bao nhiêu:

| Khi nào | Dịch vụ | Thêm bao nhiêu |
|---|---|---|
| Chạy quảng cáo, khách vào nhiều, web hết credit | Netlify → gói Personal | +9 $/tháng |
| Vài chục nghìn lượt xem một ngày | Railway tính thêm theo mức dùng | +3 – 8 $/tháng |
| Trên 3.000 cây đàn có ảnh | Cloudflare R2 | ~4.000 ₫/tháng cho mỗi 10 GB thêm |
| Trên 0,5 GB dữ liệu (hàng chục nghìn cây) | Neon | +19 $/tháng |

Cả bốn dịch vụ đều có giới hạn rõ, **không tự tính thêm tiền** khi chưa được bật.

---

## Khoản không nằm trong bảng trên

- **Phí thanh toán online** (Giai đoạn 2): VNPay thu theo từng giao dịch, thường
  1–2 % + vài nghìn đồng, chỉ phát sinh khi khách trả tiền qua web. Chuyển khoản
  QR thì không mất phí.
- **Thẻ thanh toán**: Railway và Netlify thu bằng thẻ Visa/Mastercard. Nên dùng thẻ
  đứng tên shop hoặc chủ shop.
- **Công phát triển các giai đoạn tiếp** (giỏ hàng, đặt lịch sửa, ký gửi, khóa
  học) — thỏa thuận riêng, không thuộc chi phí vận hành.

---

## Vận hành hằng ngày — ai làm gì

**Chủ shop tự làm, không cần người kỹ thuật:**

- Thêm cây đàn mới, chụp 5 góc ảnh và tải lên, ghi khuyết điểm, cân và ghi số cân
- Lập phiếu kiểm tra 32 điểm cho từng cây
- Đổi giá, đánh dấu đã giữ chỗ / đã bán
- Sửa mọi chữ trên web: hotline, giờ mở cửa, giá dịch vụ, học phí, đánh giá khách,
  tiêu đề các mục — có trình soạn thảo in đậm, nghiêng, link, gạch đầu dòng
- Thêm hãng đàn, danh mục mới (menu trên web tự cập nhật theo)
- Đổi mật khẩu quản trị

**Người kỹ thuật làm khi có yêu cầu:**

- Thêm tính năng mới, sửa giao diện — đẩy code lên, web tự cập nhật trong 2–3 phút,
  không gián đoạn
- Nâng gói khi tới ngưỡng ở bảng trên
- Kết nối VNPay; trỏ tên miền khi mua xong

---

## Dữ liệu của shop được giữ thế nào

- **Cơ sở dữ liệu** (Neon): tự sao lưu liên tục, khôi phục được về bất kỳ thời điểm
  nào trong **6 giờ** gần nhất. Ngoài ra, theo kế hoạch vận hành, mỗi tuần sao lưu
  thêm một bản ra kho ảnh, giữ 8 bản gần nhất — lỡ tay xóa nhầm cả tuần vẫn lấy lại
  được.
- **Ảnh** (Cloudflare R2): mỗi ảnh tải lên được giữ **cả bản gốc**, không bao giờ
  xóa. Sau này đổi cách hiển thị hay cần in ấn thì vẫn còn ảnh gốc để làm lại.
- **Mã nguồn** (GitHub, kho riêng tư): toàn bộ code của web, có lịch sử từng thay đổi.

Ba tài khoản Railway, Neon, Netlify và tài khoản GitHub **nên đứng tên chủ shop**
(email của shop), người kỹ thuật được mời vào làm việc. Như vậy đổi người làm kỹ
thuật về sau không ảnh hưởng gì tới web.

---

## Lộ trình phát triển (theo kế hoạch đã thống nhất)

| Giai đoạn | Nội dung |
|---|---|
| **1 — đang có** | Xem đàn, lọc, chi tiết từng cây, trang quản trị đầy đủ |
| 2 | Giỏ hàng, đặt hàng, chuyển khoản QR, quản lý đơn |
| 3 | Đặt lịch setup/sửa chữa, phiếu sửa, lịch xưởng |
| 4 | Form bán đàn / ký gửi, nút trả giá |
| 5 | Khóa học, đăng ký lớp, tài khoản khách, VNPay |
| 6 | Báo cáo doanh thu, đánh giá khách, tối ưu tìm kiếm Google |

Kiến trúc hiện tại đã được xây để đi hết sáu giai đoạn mà **không phải làm lại** và
không đổi nhà cung cấp. Chi phí vận hành giữ nguyên qua các giai đoạn, trừ khi khách
đông tới mức ở bảng "Sau này nếu khách đông hơn".

## Nếu muốn rẻ hơn nữa về lâu dài

Khi shop chạy ổn định, có thể gom cả bốn phần về **một máy chủ thuê riêng** ở
Singapore, ~6 $/tháng, không phụ thuộc ai, không lo ngưỡng credit. Đổi lại cần người
kỹ thuật trông máy (cập nhật, sao lưu). Chưa cần nghĩ tới trong năm đầu — nêu ra để
biết có đường đó.
