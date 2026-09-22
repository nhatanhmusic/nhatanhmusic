# Đưa web lên mạng

Mục tiêu của lần deploy này: **chủ shop vào được `/admin` từ điện thoại hay máy
tính bất kỳ** để nhập ảnh, giá, thông tin thật — không cần cài gì trên máy.

Chưa phải bản bán hàng chính thức. Khi có đủ ảnh thật và thông tin thật thì
cũng chính bản này, không phải deploy lại.

Ba dịch vụ, tất cả có gói free đủ dùng cho việc này:

| Phần | Dịch vụ | Tiền |
|---|---|---|
| Database | **Neon** | Free (0,5 GB — kho 128 cây dùng chừng 5 MB) |
| Backend Spring Boot | **Railway** | ~5 $/tháng — gói free ngủ sau 15 phút, ông chủ mở admin sẽ chờ gần một phút |
| Frontend Next.js | **Vercel** | Free để xem thử. **Gói Hobby cấm dùng thương mại** — lúc bán thật phải lên Pro (20 $) hoặc chuyển Cloudflare Pages |
| Ảnh | **Cloudflare R2** | Free 10 GB. Làm sau, ở bước 5 |

Đẩy code lên GitHub trước (repo private), cả ba dịch vụ đều deploy từ GitHub.

---

## Bước 1 — Neon: tạo database

1. neon.tech → New project → tên `nhatanh`, region **Singapore** (ap-southeast-1)
2. Dashboard → **Connection string** → chọn **JDBC** → copy. Có dạng:
   ```
   jdbc:postgresql://ep-xxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
3. Ghi lại: `DB_URL` (chuỗi trên), `DB_USER`, `DB_PASSWORD` (Neon hiện ở cùng chỗ)

Không cần tạo bảng — Flyway tự chạy 5 migration khi backend khởi động lần đầu.

## Bước 2 — Railway: chạy backend

1. railway.app → New project → **Deploy from GitHub repo** → chọn repo
2. Settings → **Root directory**: `nhatanh/backend`. Railway thấy `Dockerfile` là tự build
3. **Variables** → dán từng dòng trong `backend/.env.server.example`, điền giá trị thật:

   ```
   DB_URL, DB_USER, DB_PASSWORD      ← từ bước 1
   JWT_SECRET                         ← chuỗi ngẫu nhiên ≥ 32 ký tự (xem dưới)
   ADMIN_EMAIL                        ← email chủ shop
   ADMIN_PASSWORD                     ← mật khẩu tạm, ông ấy sẽ tự đổi trong admin
   ADMIN_NAME                         ← tên hiện ở góc trang quản trị
   CORS_ORIGINS                       ← điền sau bước 3
   MEDIA_PUBLIC_BASE_URL              ← điền sau bước 3
   ```

   Sinh `JWT_SECRET` bằng PowerShell:
   ```powershell
   -join ((48..57)+(65..90)+(97..122) | Get-Random -Count 48 | % {[char]$_})
   ```

4. Settings → **Networking → Generate domain**. Được dạng
   `nhatanh-backend-production.up.railway.app`. Ghi lại.
5. Deploy xong, mở `https://<domain-railway>/api/v1/catalog/filters` — thấy JSON là sống.

Backend **từ chối khởi động** nếu thiếu `JWT_SECRET`, `ADMIN_PASSWORD`, `DB_URL`… —
đó là chủ ý, để không bao giờ chạy trên mạng với mật khẩu mặc định `admin123`.
Lỗi sẽ ghi rõ tên biến còn thiếu trong log Railway.

## Bước 3 — Vercel: chạy frontend

1. vercel.com → Add New → Project → import repo
2. **Root directory**: `nhatanh/frontend`. Framework tự nhận Next.js
3. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_BASE   = https://<domain-railway>/api/v1
   NEXT_PUBLIC_SITE_URL   = https://<domain-vercel>     (điền sau khi có)
   ```
4. Deploy. Được domain dạng `nhatanh.vercel.app`.
5. **Quay lại Railway**, điền nốt hai biến rồi Redeploy:
   ```
   CORS_ORIGINS           = https://nhatanh.vercel.app
   MEDIA_PUBLIC_BASE_URL  = https://nhatanh.vercel.app/media
   ```
   (`/media` là route vẽ ô chờ ảnh — dùng tạm tới khi có R2 ở bước 5)

## Bước 4 — Bàn giao cho chủ shop

Gửi ba thứ:

- Link: `https://nhatanh.vercel.app/admin`
- Email và mật khẩu tạm (`ADMIN_EMAIL` / `ADMIN_PASSWORD` ở bước 2)
- Dặn: vào **Tài khoản & mật khẩu** đổi mật khẩu ngay lần đầu, rồi vào
  **Nội dung web** điền hotline, địa chỉ, giờ mở cửa

Sau đó ông ấy tự làm được mọi thứ ở mục "Sửa nội dung ở đâu" trong README.

## Bước 5 — Cloudflare R2: kho ảnh (làm khi bắt đầu chụp ảnh thật)

Không có bước này thì nút **Chọn ảnh** trong admin bị ẩn và trang hiện ô chờ ảnh.

1. Cloudflare → R2 → Create bucket `nhatanh-media`, location **APAC**
2. Bucket → Settings → **Public access** → Allow (hoặc gắn custom domain
   `anh.tenmien.vn`). Ghi lại URL công khai
3. Bucket → Settings → **CORS policy**:
   ```json
   [{
     "AllowedOrigins": ["https://nhatanh.vercel.app"],
     "AllowedMethods": ["PUT", "GET"],
     "AllowedHeaders": ["Content-Type", "Cache-Control"],
     "MaxAgeSeconds": 3600
   }]
   ```
   Thiếu bước này thì trình duyệt không PUT được — nút Chọn ảnh sẽ báo "R2 từ chối".
4. R2 → **Manage R2 API Tokens** → Create token, quyền *Object Read & Write*, giới hạn
   vào bucket này. Ghi lại Access Key ID và Secret
5. Railway → Variables:
   ```
   R2_ACCOUNT_ID          = (Cloudflare dashboard, góc phải)
   R2_ACCESS_KEY          = …
   R2_SECRET_KEY          = …
   R2_BUCKET              = nhatanh-media
   MEDIA_PUBLIC_BASE_URL  = https://pub-xxxx.r2.dev   ← URL công khai ở mục 2
   ```
   Redeploy. Nút **Chọn ảnh** xuất hiện trong form sửa cây đàn.

Ảnh đi thẳng từ trình duyệt lên R2, không qua Spring Boot, không qua Vercel. Mỗi lần
chọn một file, trình duyệt tự đẩy ba bản: hiển thị 1600px, thu nhỏ 600px, và bản gốc.

---

## Kiểm tra sau khi lên

```
https://<vercel>/                          trang chủ hiện 12 cây mẫu
https://<vercel>/dan?category=guitar-dien  bộ lọc chạy
https://<vercel>/admin                     đăng nhập được, sửa được một cây
https://<railway>/swagger-ui.html          tài liệu API
```

## Khi sửa code về sau

Push lên GitHub là cả Railway lẫn Vercel tự build và deploy lại. Migration mới
(`V6__…sql`) tự chạy lúc backend khởi động. **Không bao giờ sửa file migration
đã chạy** — Flyway sẽ báo checksum lệch và từ chối khởi động; viết file mới.

## Trước khi mở bán thật

- [ ] Ảnh thật cho từng cây (bước 5 xong)
- [ ] Hotline, địa chỉ, ĐKKD điền thật trong Nội dung web
- [ ] Tắt tài khoản `khach@nhatanh.vn` — profile `server` đã tắt sẵn
- [ ] Vercel Pro hoặc Cloudflare Pages (Hobby cấm thương mại)
- [ ] Tên miền riêng, gắn vào cả Vercel lẫn Railway
- [ ] Backup: Neon có point-in-time restore 7 ngày trên gói free — bật lên
