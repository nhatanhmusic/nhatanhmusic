package vn.nhatanh.catalog;

import jakarta.persistence.*;
import java.time.Instant;
import vn.nhatanh.common.Enums.PhotoKind;

@Entity
@Table(name = "item_photos")
public class ItemPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    /** Duong dan trong R2, khong phai URL day du (muc 5). */
    @Column(name = "r2_key", nullable = false)
    private String r2Key;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PhotoKind kind = PhotoKind.OTHER;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Column(name = "alt_text")
    private String altText;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private Instant createdAt;

    public Long getId() {
        return id;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public String getR2Key() {
        return r2Key;
    }

    public void setR2Key(String r2Key) {
        this.r2Key = r2Key;
    }

    public PhotoKind getKind() {
        return kind;
    }

    public void setKind(PhotoKind kind) {
        this.kind = kind;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(int sortOrder) {
        this.sortOrder = sortOrder;
    }

    public String getAltText() {
        return altText;
    }

    public void setAltText(String altText) {
        this.altText = altText;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
