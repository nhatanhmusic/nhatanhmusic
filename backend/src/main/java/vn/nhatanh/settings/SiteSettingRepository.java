package vn.nhatanh.settings;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteSettingRepository extends JpaRepository<SiteSetting, String> {
    List<SiteSetting> findAllByOrderBySortOrderAscKeyAsc();
}
