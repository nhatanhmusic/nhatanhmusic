package vn.nhatanh.catalog;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import vn.nhatanh.catalog.CatalogDtos.*;
import vn.nhatanh.common.ApiException;
import vn.nhatanh.common.Enums.ConditionGrade;
import vn.nhatanh.common.Enums.ItemStatus;
import vn.nhatanh.common.PageResponse;

/** Muc 4 — phan cong khai, khong can dang nhap. */
@RestController
@RequestMapping("/api/v1/catalog")
public class CatalogController {

    private final CatalogService catalog;

    public CatalogController(CatalogService catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/items")
    public PageResponse<ItemCard> list(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) List<String> brand,
            @RequestParam(required = false) List<ConditionGrade> grade,
            @RequestParam(required = false) Long priceMin,
            @RequestParam(required = false) Long priceMax,
            @RequestParam(required = false) Integer weightMax,
            @RequestParam(required = false) String q,
            @RequestParam(required = false, defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        return catalog.search(new CatalogService.ItemQuery(
                category, brand, grade, priceMin, priceMax, weightMax, q, sort,
                ItemStatus.AVAILABLE, page, size));
    }

    @GetMapping("/items/{slug}")
    public ItemDetail bySlug(@PathVariable String slug) {
        ItemDetail detail = catalog.getBySlug(slug);
        if (detail.card().status() == ItemStatus.DRAFT) {
            throw ApiException.notFound("cây đàn này");
        }
        return detail;
    }

    @GetMapping("/items/{id}/related")
    public List<ItemCard> related(@PathVariable long id,
                                  @RequestParam(defaultValue = "4") int limit) {
        return catalog.related(id, limit);
    }

    @GetMapping("/filters")
    public ItemFilters filters() {
        return catalog.filters();
    }

    @GetMapping("/brands")
    public List<BrandView> brands() {
        return catalog.allBrands();
    }

    @GetMapping("/categories")
    public List<CategoryView> categories() {
        return catalog.allCategories();
    }
}
