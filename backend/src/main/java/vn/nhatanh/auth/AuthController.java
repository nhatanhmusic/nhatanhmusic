package vn.nhatanh.auth;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import vn.nhatanh.common.ApiException;
import vn.nhatanh.common.Enums.UserRole;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthController(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    public record LoginRequest(
            @NotBlank(message = "Nhập email.") @Email(message = "Email chưa đúng định dạng.") String email,
            @NotBlank(message = "Nhập mật khẩu.") String password) {
    }

    public record LoginResponse(String accessToken, long expiresIn, String fullName, UserRole role) {
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest body) {
        User user = users.findByEmailIgnoreCase(body.email())
                .filter(u -> encoder.matches(body.password(), u.getPasswordHash()))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "BAD_CREDENTIALS",
                        "Email hoặc mật khẩu không đúng."));

        return new LoginResponse(jwt.issue(user), jwt.accessTtlSeconds(), user.getFullName(), user.getRole());
    }

    public record ChangePasswordRequest(
            @NotBlank(message = "Nhập mật khẩu hiện tại.") String currentPassword,
            @NotBlank(message = "Nhập mật khẩu mới.")
            @jakarta.validation.constraints.Size(min = 8, message = "Mật khẩu mới phải từ 8 ký tự.")
            String newPassword) {
    }

    /**
     * Chu shop khong sua duoc bien moi truong tren may chu, nen phai doi duoc
     * mat khau ngay trong trang quan tri.
     */
    @PostMapping("/change-password")
    @org.springframework.transaction.annotation.Transactional
    public MeResponse changePassword(Authentication auth, @Valid @RequestBody ChangePasswordRequest body) {
        if (auth == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHENTICATED", "Chưa đăng nhập.");
        }
        User user = users.findByEmailIgnoreCase(auth.getName())
                .orElseThrow(() -> ApiException.notFound("tài khoản"));

        if (!encoder.matches(body.currentPassword(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "WRONG_PASSWORD", "Mật khẩu hiện tại không đúng.");
        }
        if (encoder.matches(body.newPassword(), user.getPasswordHash())) {
            throw ApiException.badRequest("SAME_PASSWORD", "Mật khẩu mới trùng mật khẩu cũ.");
        }

        user.setPasswordHash(encoder.encode(body.newPassword()));
        users.save(user);
        return new MeResponse(user.getEmail(), user.getFullName(), user.getRole());
    }

    public record MeResponse(String email, String fullName, UserRole role) {
    }

    @GetMapping("/me")
    public MeResponse me(Authentication auth) {
        if (auth == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHENTICATED", "Chưa đăng nhập.");
        }
        User user = users.findByEmailIgnoreCase(auth.getName())
                .orElseThrow(() -> ApiException.notFound("tài khoản"));
        return new MeResponse(user.getEmail(), user.getFullName(), user.getRole());
    }
}
