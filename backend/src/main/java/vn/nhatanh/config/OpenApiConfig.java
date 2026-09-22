package vn.nhatanh.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Muc 8 — openapi.json de frontend sinh type, khong de kieu du lieu lech nhau. */
@Configuration
public class OpenApiConfig {

    @Bean
    OpenAPI nhatAnhOpenApi() {
        return new OpenAPI().info(new Info()
                .title("Nhật Anh Music Gear & Service API")
                .version("v1")
                .description("API cho web bán đàn, dịch vụ sửa chữa, ký gửi và khóa học.")
                .contact(new Contact().name("Nhật Anh")));
    }
}
