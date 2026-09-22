package vn.nhatanh.catalog;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ItemRepository extends JpaRepository<Item, Long>, JpaSpecificationExecutor<Item> {

    @EntityGraph(attributePaths = {"photos", "flaws", "productModel", "productModel.brand", "productModel.category"})
    Optional<Item> findBySlugAndDeletedAtIsNull(String slug);

    @EntityGraph(attributePaths = {"photos", "flaws", "productModel", "productModel.brand", "productModel.category"})
    Optional<Item> findByIdAndDeletedAtIsNull(Long id);

    boolean existsBySkuIgnoreCase(String sku);

    boolean existsBySlug(String slug);

    /** Dan cung loai, con ban, tru chinh no — dung cho khoi "Cay tuong tu". */
    @Query("""
            select i from Item i
              join fetch i.productModel pm
              left join fetch pm.brand
              left join fetch pm.category
            where i.deletedAt is null
              and i.status = :status
              and i.id <> :itemId
              and pm.category.id = :categoryId
            order by abs(i.priceVnd - :priceVnd) asc
            """)
    List<Item> findRelated(@Param("itemId") Long itemId,
                           @Param("categoryId") Long categoryId,
                           @Param("priceVnd") Long priceVnd,
                           @Param("status") vn.nhatanh.common.Enums.ItemStatus status,
                           Pageable pageable);

    // --- Bo loc: dem so cay dang ban theo tung nhom ---

    @Query("""
            select pm.category.slug, pm.category.name, count(i)
            from Item i join i.productModel pm
            where i.deletedAt is null and i.status = :status
            group by pm.category.slug, pm.category.name
            order by pm.category.name
            """)
    List<Object[]> countByCategory(@Param("status") vn.nhatanh.common.Enums.ItemStatus status);

    @Query("""
            select pm.brand.slug, pm.brand.name, count(i)
            from Item i join i.productModel pm
            where i.deletedAt is null and i.status = :status and pm.brand is not null
            group by pm.brand.slug, pm.brand.name
            order by pm.brand.name
            """)
    List<Object[]> countByBrand(@Param("status") vn.nhatanh.common.Enums.ItemStatus status);

    @Query("""
            select i.conditionGrade, count(i)
            from Item i
            where i.deletedAt is null and i.status = :status
            group by i.conditionGrade
            """)
    List<Object[]> countByGrade(@Param("status") vn.nhatanh.common.Enums.ItemStatus status);

    @Query("select count(i) from Item i where i.productModel.id = :modelId and i.deletedAt is null")
    long countByModelId(@Param("modelId") long modelId);

    @Query("""
            select i.productModel.id, count(i) from Item i
            where i.deletedAt is null
            group by i.productModel.id
            """)
    List<Object[]> countByModel();

    @Query("""
            select coalesce(min(i.priceVnd), 0), coalesce(max(i.priceVnd), 0)
            from Item i
            where i.deletedAt is null and i.status = :status
            """)
    List<Object[]> priceRange(@Param("status") vn.nhatanh.common.Enums.ItemStatus status);
}
