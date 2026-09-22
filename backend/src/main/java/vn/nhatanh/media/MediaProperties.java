package vn.nhatanh.media;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.media")
public class MediaProperties {

    private String r2AccountId = "";
    private String r2AccessKey = "";
    private String r2SecretKey = "";
    private String r2Bucket = "";
    private String publicBaseUrl = "";

    public boolean isConfigured() {
        return !r2AccountId.isBlank() && !r2AccessKey.isBlank()
                && !r2SecretKey.isBlank() && !r2Bucket.isBlank();
    }

    public String getR2AccountId() {
        return r2AccountId;
    }

    public void setR2AccountId(String r2AccountId) {
        this.r2AccountId = r2AccountId;
    }

    public String getR2AccessKey() {
        return r2AccessKey;
    }

    public void setR2AccessKey(String r2AccessKey) {
        this.r2AccessKey = r2AccessKey;
    }

    public String getR2SecretKey() {
        return r2SecretKey;
    }

    public void setR2SecretKey(String r2SecretKey) {
        this.r2SecretKey = r2SecretKey;
    }

    public String getR2Bucket() {
        return r2Bucket;
    }

    public void setR2Bucket(String r2Bucket) {
        this.r2Bucket = r2Bucket;
    }

    public String getPublicBaseUrl() {
        return publicBaseUrl;
    }

    public void setPublicBaseUrl(String publicBaseUrl) {
        this.publicBaseUrl = publicBaseUrl;
    }
}
