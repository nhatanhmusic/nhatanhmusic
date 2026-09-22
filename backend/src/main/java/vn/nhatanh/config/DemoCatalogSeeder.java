package vn.nhatanh.config;

import javax.sql.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;

/**
 * Nap 14 cay dan mau de lap trinh vien co cai ma nhin — CHI o profile `local`.
 *
 * Truoc day du lieu nay nam trong migration V2/V3, nghia la se len production
 * cung voi schema. Web that ma hien Fender gia, serial gia thi chu shop phai xoa
 * tay tung cay. Tach ra day: production khoi dong voi kho trong, chu shop tu nhap.
 *
 * Chay sau Flyway (ApplicationRunner) va chi khi bang `items` con trong, nen
 * khoi dong lai nhieu lan khong nhan doi du lieu.
 */
@Configuration
@Profile("local")
public class DemoCatalogSeeder {

    private static final Logger log = LoggerFactory.getLogger(DemoCatalogSeeder.class);

    @Bean
    ApplicationRunner seedDemoCatalog(DataSource dataSource) {
        return args -> {
            JdbcTemplate jdbc = new JdbcTemplate(dataSource);
            Integer items = jdbc.queryForObject("select count(*) from items", Integer.class);
            if (items != null && items > 0) {
                return;
            }

            ResourceDatabasePopulator populator = new ResourceDatabasePopulator(
                    new ClassPathResource("db/demo/demo_catalog.sql"));
            populator.setSqlScriptEncoding("UTF-8");
            populator.setSeparator(";");
            populator.execute(dataSource);

            Integer after = jdbc.queryForObject("select count(*) from items", Integer.class);
            log.warn("Da nap {} cay dan MAU cho moi truong local (khong co tren production).", after);
        };
    }
}
