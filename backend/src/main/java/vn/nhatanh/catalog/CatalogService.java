package vn.nhatanh.catalog;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.nhatanh.catalog.CatalogDtos.*;
import vn.nhatanh.common.ApiException;
import vn.nhatanh.common.Enums.ConditionGrade;
import vn.nhatanh.common.Enums.ItemStatus;
import vn.nhatanh.common.Enums.PhotoKind;
import vn.nhatanh.common.PageResponse;
import vn.nhatanh.common.Slugs;
import vn.nhatanh.media.MediaService;

@Service
public class CatalogService {

    private final ItemRepository items;
    private final ProductModelRepository models;
    private final BrandRepository brands;
    private final CategoryRepository categories;
    private final InspectionRepository inspections;
    private final MediaService media;

    public CatalogService(ItemRepository items, ProductModelRepository models, BrandRepository brands,
                          CategoryRepository categories, InspectionRepository inspections, MediaService media) {
        this.items = items;
        this.models = models;
        this.brands = brands;
        this.categories = categories;
        this.inspections = inspections;
        this.media = media;
    }

    // ------------------------------------------------------------------ doc

    public record ItemQuery(String category, List<String> brand, List<ConditionGrade> grade,
                            Long priceMin, Long priceMax, Integer weightMax, String q,
                            String sort, ItemStatus status, int page, int size) {
    }

    @Transactional(readOnly = true)
    public PageResponse<ItemCard> search(ItemQuery query) {
        Specification<Item> spec = Specification.where(ItemSpecs.notDeleted())
                .and(ItemSpecs.status(query.status()))
                .and(ItemSpecs.categorySlug(query.category()))
                .and(ItemSpecs.brandSlugs(query.brand()))
                .and(ItemSpecs.grades(query.grade()))
                .and(ItemSpecs.priceMin(query.priceMin()))
                .and(ItemSpecs.priceMax(query.priceMax()))
                .and(ItemSpecs.weightMax(query.weightMax()))
                .and(ItemSpecs.keyword(query.q()));

        Pageable pageable = PageRequest.of(
                Math.max(query.page(), 0),
                Math.min(Math.max(query.size(), 1), 60),
                sortOf(query.sort()));

        Page<Item> page = items.findAll(spec, pageable);
        return PageResponse.of(page, this::toCard);
    }

    private Sort sortOf(String sort) {
        return switch (sort == null ? "" : sort) {
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "priceVnd");
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "priceVnd");
            case "weight_asc" -> Sort.by(Sort.Direction.ASC, "weightGrams");
            case "sku" -> Sort.by(Sort.Direction.ASC, "sku");
            default -> Sort.by(Sort.Direction.DESC, "publishedAt").and(Sort.by(Sort.Direction.DESC, "id"));
        };
    }

    @Transactional(readOnly = true)
    public ItemDetail getBySlug(String slug) {
        Item item = items.findBySlugAndDeletedAtIsNull(slug)
                .orElseThrow(() -> ApiException.notFound("cây đàn này"));
        return toDetail(item);
    }

    @Transactional(readOnly = true)
    public ItemDetail getById(long id) {
        Item item = items.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> ApiException.notFound("cây đàn này"));
        return toDetail(item);
    }

    @Transactional(readOnly = true)
    public List<ItemCard> related(long itemId, int limit) {
        Item item = items.findByIdAndDeletedAtIsNull(itemId)
                .orElseThrow(() -> ApiException.notFound("cây đàn này"));
        return items.findRelated(item.getId(),
                        item.getProductModel().getCategory().getId(),
                        item.getPriceVnd(),
                        ItemStatus.AVAILABLE,
                        PageRequest.of(0, Math.min(Math.max(limit, 1), 12)))
                .stream().map(this::toCard).toList();
    }

    @Transactional(readOnly = true)
    public ItemFilters filters() {
        List<FacetOption> cats = items.countByCategory(ItemStatus.AVAILABLE).stream()
                .map(r -> new FacetOption((String) r[0], (String) r[1], (Long) r[2])).toList();
        List<FacetOption> brandFacets = items.countByBrand(ItemStatus.AVAILABLE).stream()
                .map(r -> new FacetOption((String) r[0], (String) r[1], (Long) r[2])).toList();

        Map<ConditionGrade, Long> gradeCounts = new java.util.EnumMap<>(ConditionGrade.class);
        for (Object[] r : items.countByGrade(ItemStatus.AVAILABLE)) {
            gradeCounts.put((ConditionGrade) r[0], (Long) r[1]);
        }
        // Giu dung thu tu 6 muc cua web, ke ca muc dang khong co cay nao.
        List<FacetOption> grades = new ArrayList<>();
        for (ConditionGrade g : ConditionGrade.values()) {
            grades.add(new FacetOption(g.name(), g.label(), gradeCounts.getOrDefault(g, 0L)));
        }

        Object[] range = items.priceRange(ItemStatus.AVAILABLE).get(0);
        return new ItemFilters(cats, brandFacets, grades, toLong(range[0]), toLong(range[1]));
    }

    private static long toLong(Object o) {
        return o instanceof Number n ? n.longValue() : 0L;
    }

    @Transactional(readOnly = true)
    public List<BrandView> allBrands() {
        return brands.findAllByOrderByNameAsc().stream()
                .map(b -> new BrandView(b.getId(), b.getName(), b.getSlug())).toList();
    }

    @Transactional(readOnly = true)
    public List<CategoryView> allCategories() {
        return categories.findAllByOrderBySortOrderAscNameAsc().stream()
                .map(c -> new CategoryView(c.getId(), c.getName(), c.getSlug(),
                        c.getParent() == null ? null : c.getParent().getId(), c.getSortOrder()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ModelOption> modelOptions() {
        return models.findAll().stream()
                .filter(m -> m.getDeletedAt() == null)
                .map(m -> new ModelOption(m.getId(), m.getName(), m.getSlug(),
                        m.getBrand() == null ? null : m.getBrand().getName(),
                        m.getCategory().getName(), m.isUnique()))
                .toList();
    }

    // ----------------------------------------------------------------- ghi

    @Transactional
    public ItemDetail create(ItemUpsert input) {
        Item item = new Item();
        applyBasics(item, input);
        if (items.existsBySkuIgnoreCase(item.getSku())) {
            throw ApiException.conflict("SKU_TAKEN", "SKU \"" + item.getSku() + "\" đã có cây khác dùng rồi.");
        }
        item.setStatus(ItemStatus.DRAFT);
        moveStatus(item, input.status());
        replacePhotos(item, input.photos());
        replaceFlaws(item, input.flaws());
        return toDetail(items.save(item));
    }

    @Transactional
    public ItemDetail update(long id, ItemUpsert input) {
        Item item = items.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> ApiException.notFound("cây đàn này"));
        String oldSku = item.getSku();
        applyBasics(item, input);
        if (!oldSku.equalsIgnoreCase(item.getSku()) && items.existsBySkuIgnoreCase(item.getSku())) {
            throw ApiException.conflict("SKU_TAKEN", "SKU \"" + item.getSku() + "\" đã có cây khác dùng rồi.");
        }
        moveStatus(item, input.status());
        replacePhotos(item, input.photos());
        replaceFlaws(item, input.flaws());
        return toDetail(items.save(item));
    }

    @Transactional
    public ItemDetail changeStatus(long id, ItemStatus to) {
        Item item = items.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> ApiException.notFound("cây đàn này"));
        moveStatus(item, to);
        return toDetail(items.save(item));
    }

    /** Xoa mem (muc 3.2) — du lieu nghiep vu khong DELETE that. */
    @Transactional
    public void softDelete(long id) {
        Item item = items.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> ApiException.notFound("cây đàn này"));
        if (item.getStatus() == ItemStatus.SOLD) {
            throw ApiException.conflict("ITEM_SOLD", "Cây đã bán thì giữ lại để tra cứu, không xóa.");
        }
        item.setDeletedAt(Instant.now());
        items.save(item);
    }

    /** Mot cua duy nhat de doi trang thai (muc 3.5). */
    private void moveStatus(Item item, ItemStatus to) {
        ItemStatus from = item.getStatus();
        if (from == to) {
            return;
        }
        ItemStateMachine.assertCanMove(from, to);
        item.setStatus(to);
        if (to == ItemStatus.AVAILABLE && item.getPublishedAt() == null) {
            item.setPublishedAt(Instant.now());
        }
        if (to == ItemStatus.SOLD) {
            item.setSoldAt(Instant.now());
        }
        if (from == ItemStatus.SOLD) {
            item.setSoldAt(null);
        }
    }

    private void applyBasics(Item item, ItemUpsert in) {
        ProductModel model = models.findById(in.productModelId())
                .orElseThrow(() -> ApiException.badRequest("MODEL_NOT_FOUND", "Model sản phẩm không tồn tại."));
        if (!model.isUnique()) {
            throw ApiException.badRequest("MODEL_NOT_UNIQUE",
                    "Model này là phụ kiện tính theo số lượng tồn, không tạo từng cây được.");
        }
        item.setProductModel(model);
        item.setSku(in.sku().trim());
        item.setSerialNo(blankToNull(in.serialNo()));
        item.setTitle(in.title().trim());
        item.setSlug(resolveSlug(item, in));
        item.setSummary(blankToNull(in.summary()));
        item.setConditionGrade(in.conditionGrade());
        item.setWeightGrams(in.weightGrams());
        item.setYearMade(in.yearMade());
        item.setMadeIn(blankToNull(in.madeIn()));
        item.setPriceVnd(in.priceVnd());
        item.setCompareAtPriceVnd(in.compareAtPriceVnd());
        item.setSource(in.source());
        item.setAcceptsOffers(in.acceptsOffers());
    }

    /** URL sach, co SKU o cuoi de khong bao gio trung (muc 10). */
    private String resolveSlug(Item item, ItemUpsert in) {
        String wanted = (in.slug() == null || in.slug().isBlank())
                ? Slugs.of(in.title() + "-" + in.sku())
                : Slugs.of(in.slug());
        if (wanted.isBlank()) {
            wanted = Slugs.of(in.sku());
        }
        if (wanted.equals(item.getSlug())) {
            return wanted;
        }
        String candidate = wanted;
        int n = 2;
        while (items.existsBySlug(candidate)) {
            candidate = wanted + "-" + n++;
        }
        return candidate;
    }

    private void replacePhotos(Item item, List<PhotoInput> inputs) {
        item.getPhotos().clear();
        if (inputs == null) {
            return;
        }
        int order = 0;
        for (PhotoInput in : inputs) {
            if (in.key() == null || in.key().isBlank()) {
                continue;
            }
            ItemPhoto photo = new ItemPhoto();
            photo.setR2Key(in.key().trim());
            photo.setKind(in.kind() == null ? PhotoKind.OTHER : in.kind());
            photo.setAltText(blankToNull(in.altText()));
            photo.setSortOrder(order++);
            item.addPhoto(photo);
        }
    }

    private void replaceFlaws(Item item, List<FlawInput> inputs) {
        item.getFlaws().clear();
        if (inputs == null) {
            return;
        }
        int order = 0;
        for (FlawInput in : inputs) {
            if (in.title() == null || in.title().isBlank()) {
                continue;
            }
            ItemFlaw flaw = new ItemFlaw();
            flaw.setTitle(in.title().trim());
            flaw.setDescription(blankToNull(in.description()));
            flaw.setSortOrder(order++);
            item.addFlaw(flaw);
        }
    }

    private static String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }

    // ---------------------------------------------------------------- map

    ItemCard toCard(Item i) {
        ProductModel m = i.getProductModel();
        String mainUrl = i.getPhotos().stream()
                .filter(p -> p.getKind() == PhotoKind.MAIN)
                .findFirst()
                .or(() -> i.getPhotos().stream().findFirst())
                .map(p -> media.urlFor(p.getR2Key()))
                .orElse(null);

        return new ItemCard(
                i.getId(), i.getSlug(), i.getSku(), i.getTitle(),
                m.getBrand() == null ? null : m.getBrand().getName(),
                m.getCategory().getName(), m.getCategory().getSlug(),
                i.getConditionGrade(), i.getConditionGrade().label(),
                i.getWeightGrams(), i.getYearMade(), i.getMadeIn(),
                i.getPriceVnd(), i.getCompareAtPriceVnd(),
                i.getStatus(), i.getStatus().label(), i.getSource(),
                i.isAcceptsOffers(), i.getFlaws().size(), mainUrl, i.getPublishedAt());
    }

    ItemDetail toDetail(Item i) {
        ProductModel m = i.getProductModel();

        List<PhotoView> photos = i.getPhotos().stream()
                .map(p -> new PhotoView(p.getId(), p.getR2Key(), media.urlFor(p.getR2Key()),
                        p.getKind(), p.getKind().label(), p.getSortOrder(), p.getAltText()))
                .toList();

        Map<Long, String> photoUrlById = photos.stream()
                .filter(p -> p.id() != null)
                .collect(java.util.stream.Collectors.toMap(PhotoView::id, PhotoView::url));

        List<FlawView> flaws = i.getFlaws().stream()
                .map(f -> new FlawView(f.getId(), f.getTitle(), f.getDescription(), f.getPhotoId(),
                        f.getPhotoId() == null ? null : photoUrlById.get(f.getPhotoId())))
                .toList();

        InspectionView inspection = inspections.findFirstByItemIdOrderByCheckedAtDesc(i.getId())
                .map(this::toInspectionView)
                .orElse(null);

        return new ItemDetail(toCard(i), i.getSerialNo(), i.getSummary(),
                m.getName(), m.getSlug(), m.getDescription(), m.getSpecs(),
                photos, flaws, inspection);
    }

    private InspectionView toInspectionView(Inspection ins) {
        List<CheckView> checks = ins.getChecks().stream()
                .map(c -> new CheckView(c.getCode(), c.getLabel(), c.getGroupName(),
                        c.isPassed(), c.getNote()))
                .toList();
        int passed = (int) checks.stream().filter(CheckView::passed).count();
        return new InspectionView(ins.getId(), ins.getCheckedAt(), ins.getNote(),
                passed, checks.size(), checks);
    }

    @Transactional(readOnly = true)
    public Optional<ItemDetail> findBySlugQuiet(String slug) {
        return items.findBySlugAndDeletedAtIsNull(slug).map(this::toDetail);
    }

    // ------------------------------------------------ phieu kiem tra 32 diem

    /**
     * Ghi phieu kiem tra. Moi cay giu dung mot phieu moi nhat — ky lai thi thay
     * phieu cu, vi trang san pham chi hien mot ket qua.
     */
    @Transactional
    public ItemDetail saveInspection(long itemId, InspectionUpsert input) {
        Item item = items.findByIdAndDeletedAtIsNull(itemId)
                .orElseThrow(() -> ApiException.notFound("cây đàn này"));

        Inspection inspection = inspections.findFirstByItemIdOrderByCheckedAtDesc(itemId)
                .orElseGet(() -> {
                    Inspection fresh = new Inspection();
                    fresh.setItem(item);
                    return fresh;
                });

        inspection.setNote(blankToNull(input.note()));
        inspection.setCheckedAt(Instant.now());
        inspection.getChecks().clear();

        Map<String, CheckInput> sent = new java.util.HashMap<>();
        for (CheckInput c : (input.checks() == null ? List.<CheckInput>of() : input.checks())) {
            if (c.code() != null) {
                sent.put(c.code(), c);
            }
        }

        // Duyet theo mau chu khong theo du lieu gui len: thieu diem nao thi coi nhu
        // chua dat, khong de sot am tham mot diem roi van khoe dat 32/32.
        int order = 1;
        for (InspectionTemplate.Point point : InspectionTemplate.POINTS) {
            CheckInput sentCheck = sent.get(point.code());
            InspectionCheck check = new InspectionCheck();
            check.setCode(point.code());
            check.setLabel(point.label());
            check.setGroupName(point.groupName());
            check.setPassed(sentCheck != null && sentCheck.passed());
            check.setNote(sentCheck == null ? null : blankToNull(sentCheck.note()));
            check.setSortOrder(order++);
            inspection.addCheck(check);
        }

        inspections.save(inspection);
        return getById(itemId);
    }

    @Transactional
    public void deleteInspection(long itemId) {
        inspections.findFirstByItemIdOrderByCheckedAtDesc(itemId).ifPresent(inspections::delete);
    }

    // ------------------------------------------------------- hang & danh muc

    @Transactional(readOnly = true)
    public List<BrandRow> brandRows() {
        Map<Long, Long> counts = new java.util.HashMap<>();
        for (Object[] row : models.countByBrand()) {
            counts.put((Long) row[0], (Long) row[1]);
        }
        return brands.findAllByOrderByNameAsc().stream()
                .map(b -> new BrandRow(b.getId(), b.getName(), b.getSlug(),
                        counts.getOrDefault(b.getId(), 0L)))
                .toList();
    }

    @Transactional
    public BrandRow saveBrand(Long id, BrandUpsert input) {
        Brand brand = id == null ? new Brand()
                : brands.findById(id).orElseThrow(() -> ApiException.notFound("hãng này"));
        brand.setName(input.name().trim());
        brand.setSlug(uniqueSlug(input.slug(), input.name(), brand.getSlug(),
                candidate -> brands.findBySlug(candidate).isPresent()));
        Brand saved = brands.save(brand);
        return new BrandRow(saved.getId(), saved.getName(), saved.getSlug(), 0);
    }

    @Transactional
    public void deleteBrand(long id) {
        if (models.countByBrandId(id) > 0) {
            throw ApiException.conflict("BRAND_IN_USE",
                    "Còn model đang thuộc hãng này. Chuyển chúng sang hãng khác trước đã.");
        }
        brands.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<CategoryRow> categoryRows() {
        Map<Long, Long> counts = new java.util.HashMap<>();
        for (Object[] row : models.countByCategory()) {
            counts.put((Long) row[0], (Long) row[1]);
        }
        return categories.findAllByOrderBySortOrderAscNameAsc().stream()
                .map(c -> new CategoryRow(c.getId(), c.getName(), c.getSlug(), c.getSortOrder(),
                        counts.getOrDefault(c.getId(), 0L)))
                .toList();
    }

    @Transactional
    public CategoryRow saveCategory(Long id, CategoryUpsert input) {
        Category category = id == null ? new Category()
                : categories.findById(id).orElseThrow(() -> ApiException.notFound("danh mục này"));
        category.setName(input.name().trim());
        category.setSortOrder(input.sortOrder() == null ? 0 : input.sortOrder());
        category.setSlug(uniqueSlug(input.slug(), input.name(), category.getSlug(),
                candidate -> categories.findBySlug(candidate).isPresent()));
        Category saved = categories.save(category);
        return new CategoryRow(saved.getId(), saved.getName(), saved.getSlug(),
                saved.getSortOrder(), 0);
    }

    @Transactional
    public void deleteCategory(long id) {
        if (models.countByCategoryId(id) > 0) {
            throw ApiException.conflict("CATEGORY_IN_USE",
                    "Còn model đang thuộc danh mục này. Chuyển chúng đi trước đã.");
        }
        categories.deleteById(id);
    }

    // --------------------------------------------------------------- model

    @Transactional(readOnly = true)
    public List<ModelView> modelRows() {
        Map<Long, Long> itemCounts = new java.util.HashMap<>();
        for (Object[] row : items.countByModel()) {
            itemCounts.put((Long) row[0], (Long) row[1]);
        }
        return models.findAll().stream()
                .filter(m -> m.getDeletedAt() == null)
                .sorted(java.util.Comparator.comparing(ProductModel::getName))
                .map(m -> toModelView(m, itemCounts.getOrDefault(m.getId(), 0L)))
                .toList();
    }

    private ModelView toModelView(ProductModel m, long itemCount) {
        return new ModelView(m.getId(), m.getName(), m.getSlug(), m.getDescription(), m.getSpecs(),
                m.getCategory().getId(), m.getCategory().getName(),
                m.getBrand() == null ? null : m.getBrand().getId(),
                m.getBrand() == null ? null : m.getBrand().getName(),
                m.isUnique(), m.getStockQuantity(), m.getListPriceVnd(), itemCount);
    }

    @Transactional
    public ModelView saveModel(Long id, ModelUpsert input) {
        ProductModel model = id == null ? new ProductModel()
                : models.findById(id).orElseThrow(() -> ApiException.notFound("model này"));

        Category category = categories.findById(input.categoryId())
                .orElseThrow(() -> ApiException.badRequest("CATEGORY_NOT_FOUND",
                        "Danh mục không tồn tại."));
        model.setCategory(category);
        model.setBrand(input.brandId() == null ? null
                : brands.findById(input.brandId()).orElseThrow(
                        () -> ApiException.badRequest("BRAND_NOT_FOUND", "Hãng không tồn tại.")));

        model.setName(input.name().trim());
        model.setDescription(blankToNull(input.description()));
        model.setSpecs(input.specs());
        model.setUnique(input.unique());

        if (input.unique()) {
            // Dan thi tung cay mot dong trong `items`, o day khong giu ton kho.
            model.setStockQuantity(null);
            model.setListPriceVnd(null);
        } else {
            if (input.stockQuantity() == null) {
                throw ApiException.badRequest("STOCK_REQUIRED", "Phụ kiện phải có số lượng tồn.");
            }
            model.setStockQuantity(input.stockQuantity());
            model.setListPriceVnd(input.listPriceVnd());
        }

        model.setSlug(uniqueSlug(input.slug(), input.name(), model.getSlug(),
                candidate -> models.findBySlugAndDeletedAtIsNull(candidate).isPresent()));

        return toModelView(models.save(model), 0);
    }

    @Transactional
    public void deleteModel(long id) {
        ProductModel model = models.findById(id)
                .orElseThrow(() -> ApiException.notFound("model này"));
        if (items.countByModelId(id) > 0) {
            throw ApiException.conflict("MODEL_IN_USE",
                    "Còn cây đàn thuộc model này. Xóa hoặc chuyển chúng trước đã.");
        }
        model.setDeletedAt(Instant.now());
        models.save(model);
    }

    /** Slug tu sinh tu ten neu de trong, va them so dem neu bi trung. */
    private String uniqueSlug(String wanted, String fallbackName, String current,
                              java.util.function.Predicate<String> taken) {
        String base = Slugs.of(wanted == null || wanted.isBlank() ? fallbackName : wanted);
        if (base.isBlank()) {
            throw ApiException.badRequest("EMPTY_SLUG", "Không sinh được đường dẫn từ tên này.");
        }
        if (base.equals(current)) {
            return base;
        }
        String candidate = base;
        int n = 2;
        while (taken.test(candidate)) {
            candidate = base + "-" + n++;
        }
        return candidate;
    }
}
