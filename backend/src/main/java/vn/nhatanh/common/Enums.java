package vn.nhatanh.common;

/**
 * Muc 3.4 — enum dinh nghia mot cho duy nhat.
 * Doi o day thi phai co migration di kem, vi database co CHECK constraint tuong ung.
 */
public final class Enums {

    private Enums() {
    }

    /** Tinh trang dan — dung 6 muc tren web, khong them bot tuy tien. */
    public enum ConditionGrade {
        NEW("Mới 100%"),
        MINT("Như mới"),
        EXCELLENT("Rất tốt"),
        VERY_GOOD("Tốt"),
        GOOD("Khá"),
        FAIR("Cần sửa");

        private final String label;

        ConditionGrade(String label) {
            this.label = label;
        }

        public String label() {
            return label;
        }
    }

    public enum ItemStatus {
        DRAFT("Nháp"),
        AVAILABLE("Đang bán"),
        RESERVED("Đã giữ"),
        SOLD("Đã bán"),
        RETURNED("Đã trả lại");

        private final String label;

        ItemStatus(String label) {
            this.label = label;
        }

        public String label() {
            return label;
        }
    }

    public enum ItemSource {
        NEW_STOCK("Hàng mới"),
        PURCHASED("Shop thu mua"),
        CONSIGNMENT("Ký gửi");

        private final String label;

        ItemSource(String label) {
            this.label = label;
        }

        public String label() {
            return label;
        }
    }

    public enum PhotoKind {
        MAIN("Toàn thân"),
        BACK("Lưng đàn"),
        HEADSTOCK("Đầu cần"),
        BRIDGE("Cầu đàn"),
        FRETBOARD("Mặt phím"),
        FLAW("Khuyết điểm"),
        OTHER("Khác");

        private final String label;

        PhotoKind(String label) {
            this.label = label;
        }

        public String label() {
            return label;
        }
    }

    public enum UserRole {
        CUSTOMER, STAFF, ADMIN
    }
}
