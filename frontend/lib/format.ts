// Quy ước định dạng trong design/FRONTEND.md — giữ nguyên, đừng dùng toLocaleString mặc định
// vì máy khách có thể đang ở locale khác.

const vnd = new Intl.NumberFormat('vi-VN');

/** 18900000 -> "18.900.000₫" */
export function formatVnd(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return vnd.format(value) + '₫';
}

/** 3520 -> "3,52 kg" (dấu phẩy thập phân kiểu Việt) */
export function formatWeight(grams: number | null | undefined): string | null {
  if (!grams) return null;
  return (grams / 1000).toFixed(2).replace('.', ',') + ' kg';
}

/** Trả góp 12 tháng, làm tròn nghìn — chỉ để hiển thị tham khảo. */
export function monthlyInstallment(priceVnd: number, months = 12): string {
  return formatVnd(Math.round(priceVnd / months / 1000) * 1000);
}

export function discountPercent(price: number, compareAt?: number | null): number | null {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(d);
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(new Date(iso));
}
