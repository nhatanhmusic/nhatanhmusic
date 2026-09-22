package vn.nhatanh.catalog;

import jakarta.persistence.criteria.JoinType;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import vn.nhatanh.common.Enums.ConditionGrade;
import vn.nhatanh.common.Enums.ItemStatus;

/** Bo loc cho GET /catalog/items (muc 4). */
public final class ItemSpecs {

    private ItemSpecs() {
    }

    public static Specification<Item> notDeleted() {
        return (root, q, cb) -> cb.isNull(root.get("deletedAt"));
    }

    public static Specification<Item> status(ItemStatus status) {
        return status == null ? null : (root, q, cb) -> cb.equal(root.get("status"), status);
    }

    public static Specification<Item> categorySlug(String slug) {
        if (slug == null || slug.isBlank()) {
            return null;
        }
        return (root, q, cb) -> cb.equal(
                root.join("productModel", JoinType.INNER).join("category", JoinType.INNER).get("slug"), slug);
    }

    public static Specification<Item> brandSlugs(List<String> slugs) {
        if (slugs == null || slugs.isEmpty()) {
            return null;
        }
        return (root, q, cb) -> root.join("productModel", JoinType.INNER)
                .join("brand", JoinType.LEFT).get("slug").in(slugs);
    }

    public static Specification<Item> grades(List<ConditionGrade> grades) {
        if (grades == null || grades.isEmpty()) {
            return null;
        }
        return (root, q, cb) -> root.get("conditionGrade").in(grades);
    }

    public static Specification<Item> priceMin(Long min) {
        return min == null ? null : (root, q, cb) -> cb.greaterThanOrEqualTo(root.get("priceVnd"), min);
    }

    public static Specification<Item> priceMax(Long max) {
        return max == null ? null : (root, q, cb) -> cb.lessThanOrEqualTo(root.get("priceVnd"), max);
    }

    public static Specification<Item> weightMax(Integer maxGrams) {
        return maxGrams == null ? null
                : (root, q, cb) -> cb.and(
                        cb.isNotNull(root.get("weightGrams")),
                        cb.lessThanOrEqualTo(root.get("weightGrams"), maxGrams));
    }

    /** Tim theo tieu de, SKU, serial va ten model. */
    public static Specification<Item> keyword(String q0) {
        if (q0 == null || q0.isBlank()) {
            return null;
        }
        String like = "%" + q0.trim().toLowerCase() + "%";
        return (root, q, cb) -> {
            var model = root.join("productModel", JoinType.INNER);
            return cb.or(
                    cb.like(cb.lower(root.get("title")), like),
                    cb.like(cb.lower(root.get("sku")), like),
                    cb.like(cb.lower(cb.coalesce(root.get("serialNo"), "")), like),
                    cb.like(cb.lower(model.get("name")), like));
        };
    }
}
