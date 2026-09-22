package vn.nhatanh.catalog;

import static vn.nhatanh.common.Enums.ItemStatus.*;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;
import vn.nhatanh.common.ApiException;
import vn.nhatanh.common.Enums.ItemStatus;

/**
 * Muc 3.5 — luong trang thai viet thanh code, dung de trong dau.
 * MOI cho doi trang thai deu phai goi qua day.
 *
 * DRAFT -> AVAILABLE -> RESERVED -> SOLD
 *              ^           |
 *              +-----------+   (don bi huy -> tra ve AVAILABLE)
 */
public final class ItemStateMachine {

    private static final Map<ItemStatus, Set<ItemStatus>> ALLOWED = new EnumMap<>(ItemStatus.class);

    static {
        ALLOWED.put(DRAFT, EnumSet.of(AVAILABLE));
        ALLOWED.put(AVAILABLE, EnumSet.of(DRAFT, RESERVED, SOLD));
        ALLOWED.put(RESERVED, EnumSet.of(AVAILABLE, SOLD));
        ALLOWED.put(SOLD, EnumSet.of(RETURNED));
        ALLOWED.put(RETURNED, EnumSet.of(AVAILABLE));
    }

    private ItemStateMachine() {
    }

    public static void assertCanMove(ItemStatus from, ItemStatus to) {
        if (from == to) {
            return;
        }
        if (!ALLOWED.getOrDefault(from, Set.of()).contains(to)) {
            throw ApiException.conflict("ILLEGAL_STATE_TRANSITION",
                    "Không chuyển được từ \"%s\" sang \"%s\".".formatted(from.label(), to.label()));
        }
    }

    public static Set<ItemStatus> nextFrom(ItemStatus from) {
        return ALLOWED.getOrDefault(from, Set.of());
    }
}
