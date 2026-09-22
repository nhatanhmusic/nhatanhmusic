# Đưa web lên mạng

Mục tiêu của lần deploy này: **chủ shop vào được `/admin` từ điện thoại hay máy
tính bất kỳ** để nhập ảnh, giá, thông tin thật — không cần cài gì trên máy.

Chưa phải bản bán hàng chính thức. Khi có đủ ảnh thật và thông tin thật thì
cũng chính bản này, không phải deploy lại.

Ba dịch vụ, tổng **5 $/tháng** (hoặc **0 $** nếu backend chạy Render Free và chấp nhận
ngủ sau 15 phút — xem "Bước 2 thay thế"):

| Phần | Dịch vụ | Tiền |
|---|---|---|
| Database | **Neon** | Free (0,5 GB — kho 128 cây dùng chừng 5 MB) |
| Backend Spring Boot | **Railway** | ~5 $/tháng — gói free ngủ sau 15 phút, ông chủ mở admin sẽ chờ gần một phút |
| Frontend Next.js | **Netlify** | Free 300 credit/tháng (≈20 lần deploy hoặc 15 GB), **hết là web tắt tới đầu tháng** — gom code rồi deploy, đừng push lắt nhắt. Cho phép thương mại. Khi bán thật: Personal 9 $ |
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

Không cần tạo bảng — Flyway tự chạy 7 migration khi backend khởi động lần đầu.
**Kho đàn lên production là trống** (đàn mẫu chỉ nạp ở máy lập trình viên); nội dung
chủ shop đã nhập ở local (hotline, địa chỉ, đoạn giới thiệu) có sẵn nhờ V7.

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

4. Settings → **Deploy → Healthcheck path**: `/actuator/health`
5. Settings → **Networking → Generate domain**. Được dạng
   `nhatanh-backend-production.up.railway.app`. Ghi lại.
6. Deploy xong, mở `https://<domain-railway>/api/v1/catalog/filters` — thấy JSON là sống.

Backend **từ chối khởi động** nếu thiếu `JWT_SECRET`, `ADMIN_PASSWORD`, `DB_URL`… —
đó là chủ ý, để không bao giờ chạy trên mạng với mật khẩu mặc định `admin123`.
Lỗi sẽ ghi rõ tên biến còn thiếu trong log Railway.

### Bước 2 (thay thế) — Render Free: chạy backend 0 đồng, chấp nhận ngủ

Chỉ để chủ shop nhập liệu, chưa cần luôn-chạy thì dùng Render thay Railway — **không mất
tiền, không cần thẻ**. Backend ngủ sau 15 phút không ai dùng; lần đầu mở trong ngày chờ
~1 phút. Database **vẫn ở Neon** (bước 1) — không dùng Postgres của Render vì nó tự xóa
sau 30 ngày.

1. render.com → New → **Web Service** → connect GitHub → chọn repo
2. **Root Directory**: `nhatanh/backend` · **Runtime**: Docker · **Instance type**: Free
   · **Region**: Singapore
3. **Environment** → dán cùng bộ biến như Railway ở trên (`DB_URL`, `JWT_SECRET`,
   `ADMIN_PASSWORD`…). Thêm `JAVA_OPTS=-Xmx320m` cho vừa 512 MB RAM của gói Free
4. **Health Check Path**: `/actuator/health`
5. Deploy. Domain dạng `nhatanh-backend.onrender.com` — dùng domain này ở bước 3
   thay cho domain Railway

Muốn hết ngủ về sau: tạo service trên Railway với cùng biến môi trường, trỏ cùng
`DB_URL` → dữ liệu giữ nguyên, chỉ đổi `NEXT_PUBLIC_API_BASE` bên Netlify.

## Bước 3 — Netlify: chạy frontend

1. netlify.com → Add new site → **Import an existing project** → GitHub → chọn repo
2. **Base directory**: `nhatanh/frontend`. Netlify tự nhận Next.js và cài adapter,
   không cần chỉnh lệnh build
3. **Environment variables** (Site configuration → Environment variables):
   ```
   NEXT_PUBLIC_API_BASE   = https://<domain-railway>/api/v1
   NEXT_PUBLIC_SITE_URL   = https://<domain-netlify>     (điền sau khi có)
   NEXT_PUBLIC_NOINDEX    = true    ← chặn Google index khi chưa có ảnh thật; xóa biến này lúc mở bán
   ```
4. Deploy. Được domain dạng `nhatanh.netlify.app`. Đổi tên ở Site configuration →
   Change site name nếu muốn gọn hơn.
5. **Quay lại Railway**, điền nốt hai biến rồi Redeploy:
   ```
   CORS_ORIGINS           = https://nhatanh.netlify.app
   MEDIA_PUBLIC_BASE_URL  = https://nhatanh.netlify.app/media
   ```
   (`/media` là route vẽ ô chờ ảnh — dùng tạm tới khi có R2 ở bước 5)

## Bước 4 — Bàn giao cho chủ shop

Gửi ba thứ:

- Link: `https://nhatanh.netlify.app/admin`
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
     "AllowedOrigins": ["https://nhatanh.netlify.app"],
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

Ảnh đi thẳng từ trình duyệt lên R2, không qua Spring Boot, không qua Netlify. Mỗi lần
chọn một file, trình duyệt tự đẩy ba bản: hiển thị 1600px, thu nhỏ 600px, và bản gốc.

---

## Kiểm tra sau khi lên

```
https://<netlify>/                          trang chủ hiện 12 cây mẫu
https://<netlify>/dan?category=guitar-dien  bộ lọc chạy
https://<netlify>/admin                     đăng nhập được, sửa được một cây
https://<railway>/swagger-ui.html          tài liệu API
```

## Khi sửa code về sau

Push lên GitHub là cả Railway lẫn Netlify tự build và deploy lại. Migration mới
(`V7__…sql`) tự chạy lúc backend khởi động. **Không bao giờ sửa file migration
đã chạy** — Flyway sẽ báo checksum lệch và từ chối khởi động; viết file mới.

## Trước khi mở bán thật

- [ ] Ảnh thật cho từng cây (bước 5 xong)
- [ ] Xóa biến `NEXT_PUBLIC_NOINDEX` trên Netlify để Google bắt đầu index
- [ ] Hotline, địa chỉ, ĐKKD điền thật trong Nội dung web
- [ ] Tắt tài khoản `khach@nhatanh.vn` — profile `server` đã tắt sẵn
- [ ] Tên miền riêng, gắn vào cả Netlify lẫn Railway
- [ ] Backup: Neon free chỉ khôi phục 6 giờ — đặt lịch `pg_dump` hằng tuần lên R2 theo mục 13 kế hoạch
- [ ] Netlify lên Personal 9 $ trước khi chạy quảng cáo, kẻo hết credit giữa tháng là web tắt
