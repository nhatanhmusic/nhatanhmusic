package vn.nhatanh.media;

import java.net.URI;
import java.time.Duration;
import java.util.Locale;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
import vn.nhatanh.common.ApiException;

/**
 * Muc 5 — anh KHONG di qua Spring Boot. Backend chi ky URL, trinh duyet PUT thang len R2.
 */
@Service
public class MediaService {

    private final MediaProperties props;

    public MediaService(MediaProperties props) {
        this.props = props;
    }

    public boolean isConfigured() {
        return props.isConfigured();
    }

    public String publicBaseUrl() {
        return props.getPublicBaseUrl();
    }

    /** Doi r2_key trong database thanh URL trinh duyet tai duoc. */
    public String urlFor(String key) {
        if (key == null || key.isBlank()) {
            return null;
        }
        String base = props.getPublicBaseUrl();
        if (base == null || base.isBlank()) {
            return key;
        }
        return base.endsWith("/") ? base + key : base + "/" + key;
    }

    /** Quy uoc dat ten o muc 5 — dat sai thi sau nay khong don duoc. */
    public String buildDisplayKey(long itemId, String kind, int index) {
        return "items/%d/%s-%d.webp".formatted(itemId, kind.toLowerCase(Locale.ROOT), index);
    }

    public String buildThumbKey(long itemId, String kind, int index) {
        return "items/%d/thumb/%s-%d.webp".formatted(itemId, kind.toLowerCase(Locale.ROOT), index);
    }

    /** Ban goc giu nguyen, khong bao gio xoa (muc 5). */
    public String buildOriginalKey(long itemId, String extension) {
        String ext = extension == null ? "jpg" : extension.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]", "");
        return "items/%d/original/%s.%s".formatted(itemId, UUID.randomUUID(), ext.isBlank() ? "jpg" : ext);
    }

    public record PresignResult(String uploadUrl, String key, String publicUrl, long expiresInSeconds) {
    }

    public PresignResult presignUpload(String key, String contentType) {
        if (!props.isConfigured()) {
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "R2_NOT_CONFIGURED",
                    "Chưa cấu hình Cloudflare R2. Điền R2_ACCOUNT_ID / R2_ACCESS_KEY / R2_SECRET_KEY / R2_BUCKET "
                            + "rồi khởi động lại. Khi chạy local có thể dán thẳng đường dẫn ảnh trong trang quản trị.");
        }
        try (S3Presigner presigner = S3Presigner.builder()
                .region(Region.of("auto"))
                .endpointOverride(URI.create("https://%s.r2.cloudflarestorage.com".formatted(props.getR2AccountId())))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(props.getR2AccessKey(), props.getR2SecretKey())))
                .build()) {

            PutObjectRequest put = PutObjectRequest.builder()
                    .bucket(props.getR2Bucket())
                    .key(key)
                    .contentType(contentType)
                    // Ten file co index co dinh, doi anh thi doi ten -> cache duoc rat dai (muc 5).
                    .cacheControl("public, max-age=31536000, immutable")
                    .build();

            var presigned = presigner.presignPutObject(PutObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(10))
                    .putObjectRequest(put)
                    .build());

            return new PresignResult(presigned.url().toString(), key, urlFor(key), 600);
        }
    }
}
