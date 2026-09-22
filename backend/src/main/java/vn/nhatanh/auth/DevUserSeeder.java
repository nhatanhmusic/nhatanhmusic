package vn.nhatanh.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import vn.nhatanh.common.Enums.UserRole;

/**
 * Tao san tai khoan de chay local. Mat khau bam BCrypt ngay tai day, de khong bao
 * gio phai commit mot chuoi hash vao file migration.
 *
 * Len that: doi ADMIN_EMAIL / ADMIN_PASSWORD bang bien moi truong, va tat tai khoan
 * khach demo bang APP_DEMO_CUSTOMER_ENABLED=false (muc 13).
 */
@Configuration
public class DevUserSeeder {

    private static final Logger log = LoggerFactory.getLogger(DevUserSeeder.class);

    @Bean
    ApplicationRunner seedUsers(
            UserRepository users,
            PasswordEncoder encoder,
            @Value("${app.admin.email:admin@nhatanh.vn}") String adminEmail,
            @Value("${app.admin.password:admin123}") String adminPassword,
            @Value("${app.admin.name:Quản trị Nhật Anh}") String adminName,
            @Value("${app.demo-customer.enabled:true}") boolean customerEnabled,
            @Value("${app.demo-customer.email:khach@nhatanh.vn}") String customerEmail,
            @Value("${app.demo-customer.password:khach123}") String customerPassword,
            @Value("${app.demo-customer.name:Khách hàng demo}") String customerName,
            @Value("${app.demo-customer.phone:0900 000 001}") String customerPhone) {

        return args -> {
            seed(users, encoder, adminEmail, adminPassword, adminName, UserRole.ADMIN, null);

            if (customerEnabled) {
                seed(users, encoder, customerEmail, customerPassword, customerName,
                        UserRole.CUSTOMER, customerPhone);
            }
        };
    }

    private void seed(UserRepository users, PasswordEncoder encoder, String email, String password,
                      String fullName, UserRole role, String phone) {
        if (users.findByEmailIgnoreCase(email).isPresent()) {
            return;
        }
        User user = new User();
        user.setEmail(email);
        user.setFullName(fullName);
        user.setRole(role);
        user.setPhone(phone);
        user.setPasswordHash(encoder.encode(password));
        users.save(user);

        log.warn("Da tao tai khoan {}: {} / {} — doi mat khau truoc khi len that.",
                role, email, password);
    }
}
