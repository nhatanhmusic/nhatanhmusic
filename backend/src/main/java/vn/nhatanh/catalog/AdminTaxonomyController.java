package vn.nhatanh.catalog;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.nhatanh.catalog.CatalogDtos.*;

/**
 * Quan tri hang, danh muc va model san pham — de them mot cay dan hang moi
 * khong phai goi tho code viet migration.
 */
@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasAnyRole('STAFF','ADMIN')")
public class AdminTaxonomyController {

    private final CatalogService catalog;

    public AdminTaxonomyController(CatalogService catalog) {
        this.catalog = catalog;
    }

    // ---- Hang ----

    @GetMapping("/brands")
    public List<BrandRow> brands() {
        return catalog.brandRows();
    }

    @PostMapping("/brands")
    @ResponseStatus(HttpStatus.CREATED)
    public BrandRow createBrand(@Valid @RequestBody BrandUpsert body) {
        return catalog.saveBrand(null, body);
    }

    @PutMapping("/brands/{id}")
    public BrandRow updateBrand(@PathVariable long id, @Valid @RequestBody BrandUpsert body) {
        return catalog.saveBrand(id, body);
    }

    @DeleteMapping("/brands/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBrand(@PathVariable long id) {
        catalog.deleteBrand(id);
    }

    // ---- Danh muc ----

    @GetMapping("/categories")
    public List<CategoryRow> categories() {
        return catalog.categoryRows();
    }

    @PostMapping("/categories")
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryRow createCategory(@Valid @RequestBody CategoryUpsert body) {
        return catalog.saveCategory(null, body);
    }

    @PutMapping("/categories/{id}")
    public CategoryRow updateCategory(@PathVariable long id, @Valid @RequestBody CategoryUpsert body) {
        return catalog.saveCategory(id, body);
    }

    @DeleteMapping("/categories/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable long id) {
        catalog.deleteCategory(id);
    }

    // ---- Model san pham ----

    @GetMapping("/models")
    public List<ModelView> models() {
        return catalog.modelRows();
    }

    @PostMapping("/models")
    @ResponseStatus(HttpStatus.CREATED)
    public ModelView createModel(@Valid @RequestBody ModelUpsert body) {
        return catalog.saveModel(null, body);
    }

    @PutMapping("/models/{id}")
    public ModelView updateModel(@PathVariable long id, @Valid @RequestBody ModelUpsert body) {
        return catalog.saveModel(id, body);
    }

    @DeleteMapping("/models/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteModel(@PathVariable long id) {
        catalog.deleteModel(id);
    }
}
