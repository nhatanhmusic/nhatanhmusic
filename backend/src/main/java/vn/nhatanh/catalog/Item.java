package vn.nhatanh.catalog;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;
import org.hibernate.annotations.BatchSize;
import vn.nhatanh.common.Enums.ConditionGrade;
import vn.nhatanh.common.Enums.ItemSource;
import vn.nhatanh.common.Enums.ItemStatus;

/**
 * MOT CAY DAN CO THAT = MOT DONG (muc 3.1).
 * Serial rieng, can nang rieng, tinh trang rieng, anh rieng, gia rieng.
 */
@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_model_id", nullable = false)
    private ProductModel productModel;

    @Column(nullable = false, unique = true)
    private String sku;

    @Column(name = "serial_no", unique = true)
    private String serialNo;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "text")
    private String summary;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition_grade", nullable = false, length = 20)
    private ConditionGrade conditionGrade;

    /** Can tung cay va ghi so vao — muc 15. */
    @Column(name = "weight_grams")
    private Integer weightGrams;

    @Column(name = "year_made")
    private Integer yearMade;

    @Column(name = "made_in")
    private String madeIn;

    /** Tien: BIGINT dong, khong bao gio dung float (muc 3.2). */
    @Column(name = "price_vnd", nullable = false)
    private Long priceVnd;

    @Column(name = "compare_at_price_vnd")
    private Long compareAtPriceVnd;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ItemStatus status = ItemStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ItemSource source = ItemSource.PURCHASED;

    @Column(name = "accepts_offers", nullable = false)
    private boolean acceptsOffers;

    @Column(name = "consignment_id")
    private Long consignmentId;

    @Column(name = "published_at")
    private Instant publishedAt;

    @Column(name = "sold_at")
    private Instant soldAt;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    // Set chu khong phai List: Hibernate khong join-fetch duoc hai "bag" cung luc.
    // @BatchSize de trang danh sach khong sinh N+1 truy van.
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC, id ASC")
    @BatchSize(size = 30)
    private Set<ItemPhoto> photos = new LinkedHashSet<>();

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC, id ASC")
    @BatchSize(size = 30)
    private Set<ItemFlaw> flaws = new LinkedHashSet<>();

    public Long getId() {
        return id;
    }

    public ProductModel getProductModel() {
        return productModel;
    }

    public void setProductModel(ProductModel productModel) {
        this.productModel = productModel;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getSerialNo() {
        return serialNo;
    }

    public void setSerialNo(String serialNo) {
        this.serialNo = serialNo;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public ConditionGrade getConditionGrade() {
        return conditionGrade;
    }

    public void setConditionGrade(ConditionGrade conditionGrade) {
        this.conditionGrade = conditionGrade;
    }

    public Integer getWeightGrams() {
        return weightGrams;
    }

    public void setWeightGrams(Integer weightGrams) {
        this.weightGrams = weightGrams;
    }

    public Integer getYearMade() {
        return yearMade;
    }

    public void setYearMade(Integer yearMade) {
        this.yearMade = yearMade;
    }

    public String getMadeIn() {
        return madeIn;
    }

    public void setMadeIn(String madeIn) {
        this.madeIn = madeIn;
    }

    public Long getPriceVnd() {
        return priceVnd;
    }

    public void setPriceVnd(Long priceVnd) {
        this.priceVnd = priceVnd;
    }

    public Long getCompareAtPriceVnd() {
        return compareAtPriceVnd;
    }

    public void setCompareAtPriceVnd(Long compareAtPriceVnd) {
        this.compareAtPriceVnd = compareAtPriceVnd;
    }

    public ItemStatus getStatus() {
        return status;
    }

    public void setStatus(ItemStatus status) {
        this.status = status;
    }

    public ItemSource getSource() {
        return source;
    }

    public void setSource(ItemSource source) {
        this.source = source;
    }

    public boolean isAcceptsOffers() {
        return acceptsOffers;
    }

    public void setAcceptsOffers(boolean acceptsOffers) {
        this.acceptsOffers = acceptsOffers;
    }

    public Long getConsignmentId() {
        return consignmentId;
    }

    public void setConsignmentId(Long consignmentId) {
        this.consignmentId = consignmentId;
    }

    public Instant getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(Instant publishedAt) {
        this.publishedAt = publishedAt;
    }

    public Instant getSoldAt() {
        return soldAt;
    }

    public void setSoldAt(Instant soldAt) {
        this.soldAt = soldAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public Instant getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(Instant deletedAt) {
        this.deletedAt = deletedAt;
    }

    public Set<ItemPhoto> getPhotos() {
        return photos;
    }

    public Set<ItemFlaw> getFlaws() {
        return flaws;
    }

    public void addPhoto(ItemPhoto photo) {
        photo.setItem(this);
        photos.add(photo);
    }

    public void addFlaw(ItemFlaw flaw) {
        flaw.setItem(this);
        flaws.add(flaw);
    }
}
