package vn.nhatanh.catalog;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InspectionRepository extends JpaRepository<Inspection, Long> {
    Optional<Inspection> findFirstByItemIdOrderByCheckedAtDesc(Long itemId);
}
