package vn.nhatanh.catalog;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProductModelRepository extends JpaRepository<ProductModel, Long> {

    Optional<ProductModel> findBySlugAndDeletedAtIsNull(String slug);

    @Query("select count(m) from ProductModel m where m.brand.id = :brandId and m.deletedAt is null")
    long countByBrandId(long brandId);

    @Query("select count(m) from ProductModel m where m.category.id = :categoryId and m.deletedAt is null")
    long countByCategoryId(long categoryId);

    @Query("""
            select m.brand.id, count(m) from ProductModel m
            where m.deletedAt is null and m.brand is not null
            group by m.brand.id
            """)
    List<Object[]> countByBrand();

    @Query("""
            select m.category.id, count(m) from ProductModel m
            where m.deletedAt is null
            group by m.category.id
            """)
    List<Object[]> countByCategory();
}
