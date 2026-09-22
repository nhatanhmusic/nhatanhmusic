package vn.nhatanh.catalog;

import jakarta.validation.constraints.*;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import vn.nhatanh.common.Enums.ConditionGrade;
import vn.nhatanh.common.Enums.ItemSource;
import vn.nhatanh.common.Enums.ItemStatus;
import vn.nhatanh.common.Enums.PhotoKind;

public final class CatalogDtos {

    private CatalogDtos() {
    }

    public record BrandView(Long id, String name, String slug) {
    }

    public record CategoryView(Long id, String name, String slug, Long parentId, int sortOrder) {
    }

    public record PhotoView(Long id, String key, String url, PhotoKind kind, String kindLabel,
                            int sortOrder, String altText) {
    }

    public record FlawView(Long id, String title, String description, Long photoId, String photoUrl) {
    }

    public record CheckView(String code, String label, String groupName, boolean passed, String note) {
    }

    public record InspectionView(Long id, Instant checkedAt, String note,
                                 int passedCount, int totalCount, List<CheckView> checks) {
    }

    /** Ban rut gon cho danh sach — khong keo theo khuyet diem va phieu kiem tra. */
    public record ItemCard(
            Long id,
            String slug,
            String sku,
            String title,
            String brandName,
            String categoryName,
            String categorySlug,
            ConditionGrade conditionGrade,
            String conditionLabel,
            Integer weightGrams,
            Integer yearMade,
            String madeIn,
            long priceVnd,
            Long compareAtPriceVnd,
            ItemStatus status,
            String statusLabel,
            ItemSource source,
            boolean acceptsOffers,
            int flawCount,
            String mainPhotoUrl,
            Instant publishedAt) {
    }

    public record ItemDetail(
            ItemCard card,
            String serialNo,
            String summary,
            String modelName,
            String modelSlug,
            String modelDescription,
            Map<String, String> specs,
            List<PhotoView> photos,
            List<FlawView> flaws,
            InspectionView inspection) {
    }

    public record FacetOption(String value, String label, long count) {
    }

    public record ItemFilters(
            List<FacetOption> categories,
            List<FacetOption> brands,
            List<FacetOption> grades,
            long minPriceVnd,
            long maxPriceVnd) {
    }

    // ---- Admin ----

    public record PhotoInput(
            @NotBlank String key,
            PhotoKind kind,
            String altText) {
    }

    public record FlawInput(
            @NotBlank(message = "Khuyết điểm phải có tiêu đề.") String title,
            String description) {
    }

    public record ItemUpsert(
            @NotNull(message = "Chọn model sản phẩm.") Long productModelId,
            @NotBlank(message = "SKU không được để trống.") String sku,
            String serialNo,
            @NotBlank(message = "Tiêu đề không được để trống.") String title,
            String slug,
            String summary,
            @NotNull(message = "Chọn mức tình trạng.") ConditionGrade conditionGrade,
            @Positive(message = "Cân nặng phải lớn hơn 0.") Integer weightGrams,
            @Min(value = 1900, message = "Năm sản xuất chưa hợp lệ.") Integer yearMade,
            String madeIn,
            @NotNull(message = "Nhập giá bán.")
            @PositiveOrZero(message = "Giá không được âm.") Long priceVnd,
            @PositiveOrZero(message = "Giá so sánh không được âm.") Long compareAtPriceVnd,
            @NotNull ItemStatus status,
            @NotNull ItemSource source,
            boolean acceptsOffers,
            List<PhotoInput> photos,
            List<FlawInput> flaws) {
    }

    public record StatusChange(@NotNull ItemStatus status) {
    }

    public record ModelOption(Long id, String name, String slug, String brandName,
                              String categoryName, boolean unique) {
    }

    // ---- Phieu kiem tra 32 diem ----

    public record CheckInput(
            @NotBlank String code,
            boolean passed,
            String note) {
    }

    public record InspectionUpsert(
            String note,
            List<CheckInput> checks) {
    }

    public record TemplatePoint(String code, String label, String groupName) {
    }

    // ---- Hang, danh muc, model ----

    public record BrandUpsert(
            @NotBlank(message = "Tên hãng không được để trống.") String name,
            String slug) {
    }

    public record CategoryUpsert(
            @NotBlank(message = "Tên danh mục không được để trống.") String name,
            String slug,
            Integer sortOrder) {
    }

    public record ModelUpsert(
            @NotNull(message = "Chọn danh mục.") Long categoryId,
            Long brandId,
            @NotBlank(message = "Tên model không được để trống.") String name,
            String slug,
            String description,
            Map<String, String> specs,
            boolean unique,
            @PositiveOrZero(message = "Số lượng tồn không được âm.") Integer stockQuantity,
            @PositiveOrZero(message = "Giá không được âm.") Long listPriceVnd) {
    }

    public record ModelView(
            Long id,
            String name,
            String slug,
            String description,
            Map<String, String> specs,
            Long categoryId,
            String categoryName,
            Long brandId,
            String brandName,
            boolean unique,
            Integer stockQuantity,
            Long listPriceVnd,
            long itemCount) {
    }

    public record BrandRow(Long id, String name, String slug, long modelCount) {
    }

    public record CategoryRow(Long id, String name, String slug, int sortOrder, long modelCount) {
    }
}
