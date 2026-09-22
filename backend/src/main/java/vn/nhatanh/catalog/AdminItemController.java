package vn.nhatanh.catalog;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.nhatanh.catalog.CatalogDtos.*;
import vn.nhatanh.common.Enums.ConditionGrade;
import vn.nhatanh.common.Enums.ItemStatus;
import vn.nhatanh.common.PageResponse;
import vn.nhatanh.media.MediaService;

/**
 * Muc 6 — chan o CA HAI dau. Day la dau Spring; middleware Next.js la dau con lai.
 * Chan moi frontend la khong chan gi ca.
 */
@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasAnyRole('STAFF','ADMIN')")
public class AdminItemController {

    private final CatalogService catalog;
    private final MediaService media;

    public AdminItemController(CatalogService catalog, MediaService media) {
        this.catalog = catalog;
        this.media = media;
    }

    @GetMapping("/items")
    public PageResponse<ItemCard> list(
            @RequestParam(required = false) ItemStatus status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) List<String> brand,
            @RequestParam(required = false) List<ConditionGrade> grade,
            @RequestParam(required = false) String q,
            @RequestParam(required = false, defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return catalog.search(new CatalogService.ItemQuery(
                category, brand, grade, null, null, null, q, sort, status, page, size));
    }

    @GetMapping("/items/{id}")
    public ItemDetail one(@PathVariable long id) {
        return catalog.getById(id);
    }

    @PostMapping("/items")
    @ResponseStatus(HttpStatus.CREATED)
    public ItemDetail create(@Valid @RequestBody ItemUpsert body) {
        return catalog.create(body);
    }

    @PutMapping("/items/{id}")
    public ItemDetail update(@PathVariable long id, @Valid @RequestBody ItemUpsert body) {
        return catalog.update(id, body);
    }

    @PutMapping("/items/{id}/status")
    public ItemDetail changeStatus(@PathVariable long id, @Valid @RequestBody StatusChange body) {
        return catalog.changeStatus(id, body.status());
    }

    @DeleteMapping("/items/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable long id) {
        catalog.softDelete(id);
    }

    @GetMapping("/product-models")
    public List<ModelOption> models() {
        return catalog.modelOptions();
    }

    // ---- Phieu kiem tra 32 diem ----

    /** Mau 32 diem de dung form kiem tra. */
    @GetMapping("/inspection-template")
    public List<TemplatePoint> inspectionTemplate() {
        return InspectionTemplate.POINTS.stream()
                .map(p -> new TemplatePoint(p.code(), p.label(), p.groupName()))
                .toList();
    }

    @PutMapping("/items/{id}/inspection")
    public ItemDetail saveInspection(@PathVariable long id,
                                     @Valid @RequestBody InspectionUpsert body) {
        return catalog.saveInspection(id, body);
    }

    @DeleteMapping("/items/{id}/inspection")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInspection(@PathVariable long id) {
        catalog.deleteInspection(id);
    }

    // ---- Anh ----

    /**
     * Muc 5 — xin URL de trinh duyet PUT thang len R2. Anh KHONG di qua Spring.
     *
     * variant: display (1600px webp, hien tren web) | thumb (600px webp) | original (giu nguyen).
     * Trinh duyet tu thu nho anh truoc khi upload (xem components/admin/PhotoUploader.tsx).
     */
    public record PresignRequest(String kind, Integer index, String contentType,
                                 String variant, String extension) {
    }

    @PostMapping("/items/{id}/photos/presign")
    public MediaService.PresignResult presign(@PathVariable long id, @RequestBody PresignRequest body) {
        String kind = body.kind() == null ? "other" : body.kind();
        int index = body.index() == null ? 1 : Math.max(1, body.index());
        String variant = body.variant() == null ? "display" : body.variant();

        String key;
        String contentType;
        switch (variant) {
            case "thumb" -> {
                key = media.buildThumbKey(id, kind, index);
                contentType = "image/webp";
            }
            case "original" -> {
                key = media.buildOriginalKey(id, body.extension());
                contentType = body.contentType() == null ? "image/jpeg" : body.contentType();
            }
            default -> {
                key = media.buildDisplayKey(id, kind, index);
                contentType = "image/webp";
            }
        }
        return media.presignUpload(key, contentType);
    }

    /** Frontend hoi truoc: co R2 chua, de an/hien nut chon file. */
    @GetMapping("/media/status")
    public MediaStatus mediaStatus() {
        return new MediaStatus(media.isConfigured(), media.publicBaseUrl());
    }

    public record MediaStatus(boolean configured, String publicBaseUrl) {
    }
}
