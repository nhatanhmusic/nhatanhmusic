package vn.nhatanh.settings;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import vn.nhatanh.common.ApiException;

/**
 * Noi dung tinh cua web.
 *
 * Cong khai: mot lan goi tra ve tat ca, de frontend render trang chu chi voi mot
 * vong API thay vi chin.
 * Quan tri: sua tung khoi mot.
 */
@RestController
public class SettingsController {

    private final SiteSettingRepository repo;

    public SettingsController(SiteSettingRepository repo) {
        this.repo = repo;
    }

    public record SettingView(String key, JsonNode value, String label, String description,
                              int sortOrder, Instant updatedAt) {
    }

    public record SettingUpdate(@NotNull JsonNode value) {
    }

    /** GET /api/v1/settings -> { "home_hero": {...}, "trust_points": [...] } */
    @GetMapping("/api/v1/settings")
    @Transactional(readOnly = true)
    public Map<String, JsonNode> publicSettings() {
        Map<String, JsonNode> out = new LinkedHashMap<>();
        for (SiteSetting s : repo.findAllByOrderBySortOrderAscKeyAsc()) {
            out.put(s.getKey(), s.getValue());
        }
        return out;
    }

    @GetMapping("/api/v1/admin/settings")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    @Transactional(readOnly = true)
    public List<SettingView> adminSettings() {
        return repo.findAllByOrderBySortOrderAscKeyAsc().stream()
                .map(s -> new SettingView(s.getKey(), s.getValue(), s.getLabel(),
                        s.getDescription(), s.getSortOrder(), s.getUpdatedAt()))
                .toList();
    }

    @PutMapping("/api/v1/admin/settings/{key}")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    @Transactional
    public SettingView update(@PathVariable String key, @RequestBody SettingUpdate body) {
        SiteSetting setting = repo.findById(key)
                .orElseThrow(() -> ApiException.notFound("khối nội dung \"" + key + "\""));

        if (body.value() == null || body.value().isNull()) {
            throw ApiException.badRequest("EMPTY_VALUE", "Nội dung không được để trống.");
        }
        // Doi hinh dang (danh sach <-> doi tuong) la dau hieu goi nham khoi.
        if (body.value().isArray() != setting.getValue().isArray()) {
            throw ApiException.badRequest("SHAPE_MISMATCH",
                    "Kiểu dữ liệu không khớp với khối \"" + setting.getLabel() + "\".");
        }

        setting.setValue(body.value());
        setting.setUpdatedAt(Instant.now());
        SiteSetting saved = repo.save(setting);

        return new SettingView(saved.getKey(), saved.getValue(), saved.getLabel(),
                saved.getDescription(), saved.getSortOrder(), saved.getUpdatedAt());
    }
}
