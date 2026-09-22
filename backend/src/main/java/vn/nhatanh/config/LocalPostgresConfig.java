package vn.nhatanh.config;

import io.zonky.test.db.postgres.embedded.EmbeddedPostgres;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import javax.sql.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * Postgres nhung — de chay local khong phai cai Docker hay Postgres.
 *
 * Lan dau chay se giai nen mot ban Postgres that (~30 MB) vao thu muc du lieu ben
 * duoi, cac lan sau khoi dong thang. Day la Postgres THAT nen JSONB, BIGSERIAL,
 * TIMESTAMPTZ va toan bo migration Flyway chay y het luc len that.
 *
 * Tat di khi da co database that:
 *   mvn spring-boot:run -Dspring-boot.run.profiles=server
 * (profile `server` doc DB_URL / DB_USER / DB_PASSWORD nhu binh thuong)
 */
@Configuration
@Profile("local")
@ConditionalOnProperty(name = "app.embedded-db.enabled", havingValue = "true", matchIfMissing = true)
public class LocalPostgresConfig {

    private static final Logger log = LoggerFactory.getLogger(LocalPostgresConfig.class);

    @Bean(destroyMethod = "close")
    public EmbeddedPostgres embeddedPostgres(
            @Value("${app.embedded-db.port:5433}") int port,
            @Value("${app.embedded-db.data-dir:}") String dataDir) throws IOException {

        // initdb.exe cua Postgres khong chay duoc khi duong dan co dau tieng Viet
        // hay dau ngoac. Thu muc du an cua shop lai dung ca hai ("D:\Web Nhat Anh
        // ( Dong Nai)"), nen mac dinh dat du lieu ben duoi thu muc nguoi dung.
        Path path = (dataDir == null || dataDir.isBlank())
                ? Path.of(System.getProperty("user.home"), ".nhatanh", "localdb")
                : Path.of(dataDir).toAbsolutePath();

        if (!path.toString().chars().allMatch(c -> c < 128)) {
            throw new IllegalStateException(
                    "Duong dan du lieu database co ky tu ngoai ASCII nen Postgres khong khoi dong duoc: "
                            + path + ". Dat lai bang app.embedded-db.data-dir.");
        }

        Files.createDirectories(path.getParent());

        log.info("Khoi dong Postgres nhung o cong {} — du lieu luu tai {}", port, path);

        try {
            return EmbeddedPostgres.builder()
                    .setPort(port)
                    .setDataDirectory(path)
                    .setCleanDataDirectory(false)   // giu du lieu giua cac lan chay
                    .start();
        } catch (IllegalStateException ex) {
            // Loi hay gap nhat: quen tat backend cu roi mo cai thu hai.
            // Stack trace goc khong noi ra dieu do nen doi thanh cau nguoi doc duoc.
            if (String.valueOf(ex.getMessage()).contains("could not lock")) {
                throw new IllegalStateException(
                        "Da co mot backend khac dang chay va giu database o " + path + ".\n"
                                + "Chi chay duoc mot backend mot luc. Tat cua so dang chay cu (Ctrl+C),\n"
                                + "hoac tat het bang PowerShell:\n"
                                + "  Get-Process java, postgres -ErrorAction SilentlyContinue | Stop-Process -Force\n"
                                + "roi chay lai.", ex);
            }
            throw ex;
        }
    }

    @Bean
    public DataSource dataSource(EmbeddedPostgres postgres) {
        return postgres.getPostgresDatabase();
    }
}
