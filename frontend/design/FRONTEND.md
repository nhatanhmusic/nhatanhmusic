# Bàn giao thiết kế → frontend

Thư mục này để đưa cho Claude Code (hoặc bất kỳ ai code frontend). Nó chứa
**bản thiết kế ở dạng HTML thật**, không phải ảnh chụp — nghĩa là mọi màu, cỡ chữ,
khoảng cách đều đọc được chính xác từ mã nguồn, không phải đoán từ ảnh.

```
design-handoff/
├── tokens.css          ← copy vào frontend/styles/, import ở layout gốc
├── screens/            ← 12 màn hình, mở bằng trình duyệt được
├── preview/            ← ảnh xem nhanh từng màn
├── assets/             ← logo tròn + banner (nền trong suốt)
└── FRONTEND.md         ← file này
```

---

## Cách dùng với Claude Code

Chép cả thư mục này vào repo, đặt ở `frontend/design/`. Rồi ra lệnh kiểu:

> Đọc `design/screens/chi-tiet-san-pham.html` và `design/tokens.css`.
> Dựng lại trang này thành route `/dan/[slug]` trong Next.js, tách thành các
> component ở mục "Danh sách component" trong `design/FRONTEND.md`.
> Dùng biến CSS trong tokens.css, **không hard-code màu hay cỡ chữ**.
> Dữ liệu lấy từ `GET /api/v1/catalog/items/{slug}`, kiểu dữ liệu đã sinh sẵn ở `lib/api/types.d.ts`.

Ba điều nên nói rõ trong mọi lệnh, vì đây là chỗ AI hay làm sai:

1. **Dùng biến trong tokens.css** — nếu không nhắc, nó sẽ chép thẳng mã màu vào từng
   component, sau này đổi tông màu là phải sửa hàng trăm chỗ.
2. **Giữ đúng bố cục flex/grid có `gap`** trong file thiết kế, đừng đổi sang margin.
3. **Bỏ hết `class="photo-placeholder"`** khi nối ảnh thật.

Mẹo: bảo Claude Code mở file HTML gốc bên cạnh trang nó vừa dựng rồi so sánh —
đây là bản thiết kế chạy được nên đối chiếu trực tiếp được, không cần đoán.

---

## Bản đồ màn hình → route

| File thiết kế | Route Next.js | Ghi chú |
|---|---|---|
| `trang-chu.html` | `/` | Render tĩnh, revalidate 10 phút |
| `danh-sach-dan.html` | `/dan` | Bộ lọc nằm trên URL (`?grade=&shape=&priceMin=`) để chia sẻ link được |
| `chi-tiet-san-pham.html` | `/dan/[slug]` | **Bắt buộc render ở server** — cần `og:image` là ảnh thật của cây đó |
| `gio-hang-thanh-toan.html` | `/gio-hang`, `/thanh-toan` | Tách 2 route, dùng chung component |
| `dich-vu-setup.html` | `/dich-vu` | Lịch trống gọi API lúc chạy |
| `ban-dan-ky-gui.html` | `/ban-dan` | |
| `khoa-hoc.html` | `/khoa-hoc` | |
| `chi-tiet-lop.html` | `/khoa-hoc/[slug]` | |
| `mobile-trang-chu.html` | — | Bản mobile của `/`, không phải route riêng |
| `admin-tong-quan.html` | `/admin` | Chặn quyền ở cả middleware lẫn API |
| `admin-don-hang.html` | `/admin/don-hang` | |
| `admin-lich-sua-chua.html` | `/admin/lich-sua-chua` | |

---

## Danh sách component

### Dùng chung (`components/ui/`)
| Component | Props chính | Có ở màn |
|---|---|---|
| `SiteHeader` | `activeNav`, `cartCount`, `watchCount` | mọi trang khách |
| `UtilityBar` | `rating`, `reviewCount`, `hotline`, `hours` | mọi trang khách |
| `TrustStrip` | — | mọi trang khách |
| `SiteFooter` | — | mọi trang khách |
| `Button` | `variant: primary \| outline \| brass`, `size` | khắp nơi |
| `Card` | `padded`, `accent` | khắp nơi |
| `Eyebrow` | `children` | nhãn nhỏ viết hoa trên tiêu đề |
| `ConditionBadge` | `grade: NEW\|MINT\|EXCELLENT\|VERY_GOOD\|GOOD\|FAIR` | thẻ đàn, chi tiết, form ký gửi |
| `Tag` | `tone` | nhãn phụ ("Ký gửi", "Chỉ còn 1 cây") |
| `BrandChip` | `name` | dải "Mua theo hãng" |
| `Pagination` | `page`, `totalPages` | danh sách, admin |

### Catalog (`components/catalog/`)
| Component | Props chính |
|---|---|
| `ItemCard` | `item` (grade, weightGrams, yearMade, price, comparePrice, photo, watchCount) |
| `ItemGrid` | `items`, `columns` |
| `FilterSidebar` | `facets`, `value`, `onChange` — nhóm: dáng đàn, tình trạng, giá, trả góp, pickup, cầu đàn, hãng, mặt phím, kèm theo |
| `ActiveFilterChips` | `filters`, `onRemove` |
| `SortControl` | `value`, `options` |
| `Gallery` | `photos[]` (kind: MAIN/BACK/HEADSTOCK/BRIDGE/FRETBOARD), `serialNo` |
| `ItemFactsBar` | `weightGrams`, `yearMade`, `madeIn`, `source` |
| `BuyBox` | `item`, `onAddToCart`, `onBuyNow`, `onMakeOffer`, `onWatch` |
| `FlawList` | `flaws[]` (title, description, photo) — phần "Khuyết điểm của đúng cây này" |
| `InspectionChecklist` | `groups[]`, `technician`, `checkedAt` — kiểm tra 32 điểm |
| `SpecTable` | `rows[]` |
| `QASection` | `questions[]` |
| `RelatedItems` | `items[]` |

### Đơn hàng (`components/order/`)
`Stepper` · `CartLine` · `OrderSummary` · `AddressForm` · `DeliveryMethodPicker` · `PaymentMethodList`

### Dịch vụ (`components/service/`)
`ServiceTierCard` (`tier`, `price`, `duration`, `includes[]`) · `PriceTable` ·
`ProcessSteps` · `BookingCalendar` (`month`, `disabledDates`) ·
`TimeSlotPicker` (`slots[]` với `taken`) · `BookingSummary` · `TechnicianCard` · `FaqGrid`

### Bán đàn & ký gửi (`components/sell/`)
`CompareTable` (bán đứt / ký gửi) · `CommissionTiers` · `StepList` ·
`AcceptList` / `RejectList` · `GradePicker` (khách tự chấm 6 mức) ·
`PhotoUploader` (tối đa 8 ảnh, gợi ý 5 góc) · `SellIntentPicker`

### Khóa học (`components/course/`)
`CourseCard` · `ClassScheduleTable` · `SyllabusList` · `OutcomeList` ·
`CoursePriceBox` (`schedule options`, `seatsLeft`) · `EnrollForm`

### Quản trị (`components/admin/`)
`AdminSidebar` · `AdminTopbar` · `KpiTile` · `RevenueBarChart` (12 tháng, một màu `--chart-1`) ·
`RevenueSourceBar` (thanh xếp chồng + chú giải, 4 màu `--chart-*`) ·
`DataTable` · `StatusPill` · `OrderDetailPanel` · `WeekCalendar` · `RepairTicketPanel`

---

## Quy ước phải giữ

**Thang tình trạng đúng 6 mức**, không thêm bớt. Mã màu đã ở trong `tokens.css`:

| Enum | Nhãn tiếng Việt |
|---|---|
| `NEW` | Mới 100% |
| `MINT` | Như mới |
| `EXCELLENT` | Rất tốt |
| `VERY_GOOD` | Tốt |
| `GOOD` | Khá |
| `FAIR` | Cần sửa |

**Tiền:** API trả `BIGINT` đơn vị đồng. Frontend format bằng
`new Intl.NumberFormat('vi-VN').format(v) + '₫'` → `18.900.000₫`.
Không dùng `toLocaleString()` mặc định vì máy khách có thể ở locale khác.

**Cân nặng:** API trả gram, hiển thị `3,52 kg` (dấu phẩy thập phân kiểu Việt).

**Nút và ô nhập trên mobile:** không dưới `--tap-min` (44px).

**Ảnh:** mọi `<img>` phải có `alt` mô tả thật ("Fender Player Stratocaster
Sunburst — mặt trước"), không để rỗng. Vừa cho người khiếm thị, vừa cho SEO.

---

## Việc không nằm trong thiết kế, phải tự làm khi code

Bản thiết kế là ảnh tĩnh của trạng thái "mọi thứ bình thường". Khi code phải bổ sung:

- [ ] **Trạng thái rỗng** — chưa có đàn nào khớp bộ lọc, giỏ hàng trống, chưa có lịch hẹn
- [ ] **Trạng thái đang tải** — khung xám nhấp nháy (skeleton), không phải vòng xoay giữa màn
- [ ] **Trạng thái lỗi** — API chết, mất mạng, ảnh hỏng
- [ ] **Lỗi nhập liệu** — chữ đỏ ngay dưới ô sai, không phải popup
- [ ] **Trạng thái đã bán** — cây đàn `SOLD` thì ẩn nút mua, hiện "Đã bán" + gợi ý cây tương tự
- [ ] **Focus bàn phím** — viền rõ khi tab qua, dùng `--color-brass`
- [ ] **Bề rộng trung gian** — thiết kế có 1440px và 390px, còn tablet ~768px phải tự xử lý
