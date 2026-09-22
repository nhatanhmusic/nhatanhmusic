# Nhật Anh Music Gear & Service

Web bán đàn + xưởng setup. Dựng theo `nhat-anh-web-ke-hoach-build.md`, giao diện
dựng lại từ `design-handoff/` (12 màn HTML thật + `tokens.css`).

**Đang ở Giai đoạn 1** — xem được đàn: trang chủ, danh sách có bộ lọc, trang chi
tiết từng cây, và trang quản trị thêm/sửa đàn. Giỏ hàng, dịch vụ, ký gửi, khóa học
là các giai đoạn sau.

---

## Đưa lên mạng

Xem [DEPLOY.md](DEPLOY.md) — Neon + Railway + Vercel, chừng một buổi.

## Chạy trên máy

Cần sẵn: **JDK 21** (biến `JAVA_HOME` trỏ vào đó) và **Node 20+**.
Không cần Docker, không cần cài PostgreSQL.

Mở hai cửa sổ, mỗi cửa sổ chạy một cái:

```
cd backend  && mvn spring-boot:run     → http://localhost:8080
cd frontend && npm run dev             → http://localhost:3000
```

Hoặc dùng `chay-backend.cmd` / `chay-frontend.cmd` ở thư mục gốc.

Lần đầu backend chạy sẽ mất chừng một phút: nó tự tải một bản PostgreSQL 16 thật,
tạo bảng bằng Flyway và nạp 12 cây đàn mẫu.

Trang quản trị: <http://localhost:3000/admin> — `admin@nhatanh.vn` / `admin123`.

### Một chỗ dễ vấp

`java` trong PATH là JDK 17, còn Maven biên dịch bằng JDK 21. Gọi thẳng
`java -jar` sẽ báo `UnsupportedClassVersionError` — script `chay-backend.cmd` gọi
đúng `%JAVA_HOME%in\java.exe` nên không dính.

Dữ liệu database nằm ở `%USERPROFILE%\.nhatanh\localdb`. Muốn làm lại từ đầu thì
xóa thư mục đó rồi chạy lại backend. Chỉ chạy được **một** backend một lúc — mở
cái thứ hai sẽ báo `could not lock`.

### Khi đã có database thật (Neon)

```
set DB_URL=jdbc:postgresql://.../nhatanh
set DB_USER=...
set DB_PASSWORD=...
java -jar backend\target\nhatanh-backend-0.1.0.jar --spring.profiles.active=server
```

`docker-compose.yml` vẫn để đó cho ai muốn chạy Postgres bằng Docker (cổng 5433,
dùng kèm profile `server`).

---

## Cấu trúc

```
nhatanh/
├── backend/                     Spring Boot 3 · Java 21
│   └── src/main/java/vn/nhatanh/
│       ├── catalog/             mẫu sản phẩm, từng cây đàn, ảnh, khuyết điểm, kiểm tra 32 điểm
│       ├── auth/                đăng nhập quản trị (BCrypt + JWT)
│       ├── media/               ký URL upload lên Cloudflare R2
│       ├── config/              bảo mật, OpenAPI, Postgres nhúng
│       └── common/              enum dùng chung, lỗi, phân trang, slug
├── frontend/                    Next.js 15 · TypeScript
│   ├── app/                     route
│   ├── components/              ui · catalog · admin
│   ├── lib/                     gọi API, kiểu dữ liệu, định dạng tiền/cân nặng
│   ├── styles/tokens.css        bản gốc từ thiết kế — mọi màu, cỡ chữ lấy từ đây
│   └── design/                  bản thiết kế HTML để đối chiếu khi sửa giao diện
├── chay-backend.cmd
└── chay-frontend.cmd
```

Chia theo **nghiệp vụ**, không chia theo `controllers/` `services/` `entities/`.

---

## Những quyết định đã ép vào code

| Việc | Ở đâu |
|---|---|
| Một cây đàn = một dòng `items`, tách khỏi `product_models` | `V1__catalog.sql`, `Item.java` |
| Tiền là `BIGINT` đơn vị đồng, không bao giờ dùng số thực | `items.price_vnd`, `formatVnd()` |
| Đổi trạng thái chỉ qua một cửa duy nhất | `ItemStateMachine.java` |
| Sáu mức tình trạng, không thêm bớt | `Enums.java`, `tokens.css`, `types.ts` |
| Khuyết điểm ghi thành bảng riêng để giữ được cam kết hoàn tiền | `item_flaws`, `FlawList.tsx` |
| Xóa mềm bằng `deleted_at`, không `DELETE` thật | `CatalogService.softDelete` |
| Chặn `/admin` ở cả middleware Next.js lẫn `@PreAuthorize` | `middleware.ts`, `AdminItemController` |
| Trang chi tiết render ở server, `og:image` là ảnh thật của cây đó | `app/dan/[slug]/generateMetadata` |
| `schema.org/Product` + sitemap tự sinh | `app/dan/[slug]/page.tsx`, `app/sitemap.ts` |

Thử luồng trạng thái sai sẽ bị chặn thật:

```
PUT /api/v1/admin/items/11/status  {"status":"DRAFT"}
→ 409 {"code":"ILLEGAL_STATE_TRANSITION","message":"Không chuyển được từ \"Đã bán\" sang \"Nháp\"."}
```

---

## Sửa nội dung ở đâu

| Thứ cần sửa | Sửa ở đâu |
|---|---|
| Từng cây đàn: giá, tình trạng, cân nặng, ảnh, khuyết điểm | `/admin/dan` |
| Phiếu kiểm tra 32 điểm của từng cây | `/admin/dan/{id}` — khối dưới cùng |
| Model sản phẩm, thông số kỹ thuật | `/admin/model` |
| Hãng và danh mục (quyết định menu trên web) | `/admin/danh-muc` |
| Hotline, địa chỉ, giờ mở cửa, tiêu đề trang chủ, giá dịch vụ, khóa học, đánh giá, dải cam kết | `/admin/noi-dung` |

Nội dung ở `/admin/noi-dung` lưu trong bảng `site_settings`, trang khách đọc qua
`GET /settings` và làm mới sau **30 giây**. Có 14 khối: thông tin shop, dải cam kết,
hero, 6 mức tình trạng, gói dịch vụ, bước bán đàn, khóa học, đánh giá, cam kết hộp
mua, **tiêu đề các khối trang chủ, trang danh sách, trang chi tiết, chân trang, 8
trang tạm**.

Mọi ô văn bản có thanh công cụ: **đậm**, _nghiêng_, link, gạch đầu dòng, xem trước
(Ctrl+B / Ctrl+I / Ctrl+K). Bên dưới lưu là chữ thuần với cú pháp `**đậm**`
`_nghiêng_` `[chữ](đường-dẫn)`, không phải HTML — xem `lib/richtext.tsx`.

Cỡ chữ và màu **không cho chỉnh**: chúng đi theo vị trí trên trang (tiêu đề, đoạn
dẫn, chú thích) để cả web nhìn như một thể. Đây là quyết định có chủ ý.

Còn nằm trong code (chữ của giao diện, không phải nội dung): nhãn menu trên cùng
(`lib/nav.ts`), "Tài khoản", "Giỏ hàng", nút "Mua ngay / Thêm vào giỏ / Trả giá /
Theo dõi", nhãn trong bộ lọc, và toàn bộ trang quản trị.

## Ảnh

Hiện chưa nối Cloudflare R2 nên ảnh là **ô chờ ảnh** do
`app/media/[...path]/route.ts` vẽ ra. Database đã lưu đúng `r2_key` theo quy ước
`items/{id}/{góc}-1.webp`, nên khi có R2 thật chỉ cần:

1. Tạo bucket, điền `R2_ACCOUNT_ID` / `R2_ACCESS_KEY` / `R2_SECRET_KEY` / `R2_BUCKET`
2. Đổi `MEDIA_PUBLIC_BASE_URL` sang domain R2
3. Xóa `app/media/[...path]/route.ts`

Từ đó ảnh đi thẳng từ CDN, không qua Next.js và không qua Spring Boot.

---

## API

Swagger: <http://localhost:8080/swagger-ui.html> · JSON: `/v3/api-docs`

Sinh lại kiểu TypeScript từ backend đang chạy (mục 8 của kế hoạch):

```bash
cd frontend && npm run gen:api
```

**Công khai**

```
GET  /api/v1/catalog/items          ?category=&brand=&grade=&priceMin=&priceMax=&weightMax=&q=&sort=&page=&size=
GET  /api/v1/catalog/items/{slug}
GET  /api/v1/catalog/items/{id}/related
GET  /api/v1/catalog/filters
GET  /api/v1/catalog/brands  ·  /categories
POST /api/v1/auth/login
```

**Quản trị** (`ROLE_STAFF` / `ROLE_ADMIN`)

```
GET/POST/PUT/DELETE  /api/v1/admin/items
PUT                  /api/v1/admin/items/{id}/status
POST                 /api/v1/admin/items/{id}/photos/presign
GET                  /api/v1/admin/product-models
```

---

## Việc tiếp theo

Theo lộ trình ở mục 11 của kế hoạch:

- **Giai đoạn 2** — `customers`, `orders`, `order_lines`, `OrderStateMachine`, khóa
  `items` khi đặt (`SELECT ... FOR UPDATE`), giỏ hàng, chuyển khoản QR.
- **Giai đoạn 3** — dịch vụ sửa chữa, đặt lịch, phiếu sửa.
- Màn thiết kế cho các giai đoạn này đã có sẵn trong `frontend/design/screens/`.

Và mấy việc chỉ chủ shop làm được (mục 15) — không có thì web vẫn không bán được hàng:

- [ ] Ảnh thật 5 góc từng cây, cộng ảnh cận mọi khuyết điểm
- [ ] Cân từng cây, ghi số vào
- [ ] Bảng giá dịch vụ đúng giá đang lấy
- [ ] Địa chỉ, hotline, giờ mở cửa → điền vào `frontend/.env.local`
      (đang hiện `[trong ngoặc vuông]` ở chân trang và thanh trên cùng)
