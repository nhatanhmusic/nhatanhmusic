package vn.nhatanh.catalog;

import java.util.List;

/**
 * Danh muc 32 diem kiem tra — mot nguon duy nhat cho form quan tri.
 *
 * Doi o day thi CHI anh huong toi phieu kiem tra tao MOI. Phieu da luu giu nguyen
 * noi dung luc ky, vi cau chu tren trang san pham la loi cam ket voi khach tai
 * thoi diem do, khong duoc viet lai ve sau.
 */
public final class InspectionTemplate {

    public record Point(String code, String label, String groupName) {
    }

    public static final List<Point> POINTS = List.of(
            new Point("NECK_RELIEF", "Độ cong cần, đo bằng thước thẳng", "Cần & mặt phím"),
            new Point("TRUSS_ROD", "Ty chỉnh cần xoay được cả hai chiều", "Cần & mặt phím"),
            new Point("NECK_JOINT", "Mối nối cần vào thân chắc, không hở", "Cần & mặt phím"),
            new Point("NECK_TWIST", "Cần không xoắn", "Cần & mặt phím"),
            new Point("ACTION_1", "Độ cao dây ở phím 1", "Cần & mặt phím"),
            new Point("ACTION_12", "Độ cao dây ở phím 12", "Cần & mặt phím"),
            new Point("NUT_SLOT", "Rãnh lược đúng độ sâu, không kẹt dây", "Cần & mặt phím"),
            new Point("FRET_LEVEL", "Phím đều, không có phím cao", "Cần & mặt phím"),
            new Point("FRET_ENDS", "Đầu phím không cấn tay", "Cần & mặt phím"),
            new Point("FRET_WEAR", "Mức mòn phím", "Cần & mặt phím"),
            new Point("FRETBOARD", "Mặt phím không nứt, không khô", "Cần & mặt phím"),

            new Point("PICKUP_HEIGHT", "Chiều cao pickup cân hai bên", "Điện & tiếng"),
            new Point("PICKUP_OUTPUT", "Các pickup đều ra tiếng, cân nhau", "Điện & tiếng"),
            new Point("SWITCH", "Cần gạt ăn đủ vị trí, không rẹt", "Điện & tiếng"),
            new Point("POT_VOLUME", "Núm volume xoay êm, không rẹt", "Điện & tiếng"),
            new Point("POT_TONE", "Núm tone ăn đủ dải", "Điện & tiếng"),
            new Point("JACK", "Giắc cắm chắc, không đứt tiếng khi lắc", "Điện & tiếng"),
            new Point("SOLDER", "Mối hàn trong khoang sạch và chắc", "Điện & tiếng"),
            new Point("SHIELDING", "Khoang điện có chống nhiễu", "Điện & tiếng"),
            new Point("GROUND_HUM", "Không ù quá mức khi rời tay khỏi dây", "Điện & tiếng"),

            new Point("TUNER_HOLD", "Khóa dây giữ được cao độ", "Phần cứng"),
            new Point("TUNER_SMOOTH", "Khóa dây xoay đều, không rơ", "Phần cứng"),
            new Point("STRING_TREE", "Chốt dẫn dây bắt chắc", "Phần cứng"),
            new Point("BRIDGE_SEAT", "Cầu đàn đặt chắc, đủ ốc", "Phần cứng"),
            new Point("SADDLE", "Ngựa đàn không mòn lệch", "Phần cứng"),
            new Point("TREMOLO", "Cần rung về đúng cao độ sau khi nhún", "Phần cứng"),
            new Point("SPRING_CLAW", "Lò xo và móc lò xo cân", "Phần cứng"),
            new Point("HARDWARE", "Toàn bộ ốc vít đủ và siết đúng lực", "Phần cứng"),

            new Point("BODY_CRACK", "Thân đàn không nứt, không hở keo", "Thân đàn & bàn giao"),
            new Point("FINISH", "Lớp sơn — ghi rõ mọi khuyết điểm", "Thân đàn & bàn giao"),
            new Point("BINDING", "Nẹp viền không bong", "Thân đàn & bàn giao"),
            new Point("INTONATION", "Intonation chuẩn trên cả 6 dây", "Thân đàn & bàn giao"));

    private InspectionTemplate() {
    }

    public static Point byCode(String code) {
        return POINTS.stream().filter(p -> p.code().equals(code)).findFirst().orElse(null);
    }
}
