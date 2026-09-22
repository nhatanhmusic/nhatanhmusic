package vn.nhatanh.common;

import java.text.Normalizer;
import java.util.Locale;

/** URL sach (muc 10): bo dau tieng Viet, thuong hoa, noi bang dau gach ngang. */
public final class Slugs {

    private Slugs() {
    }

    public static String of(String input) {
        if (input == null || input.isBlank()) {
            return "";
        }
        String s = input.replace('Đ', 'D').replace('đ', 'd');
        s = Normalizer.normalize(s, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        s = s.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-+)|(-+$)", "");
        return s;
    }
}
