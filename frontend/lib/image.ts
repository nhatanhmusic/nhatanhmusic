/**
 * Thu nhỏ ảnh ngay trong trình duyệt trước khi upload (mục 5 của kế hoạch).
 *
 * Ảnh điện thoại ngày nay 4–8 MB một tấm. Đẩy nguyên lên rồi mới xử lý ở máy chủ
 * thì tốn băng thông, tốn tiền máy chủ, và chậm với người upload. Trình duyệt tự
 * làm được việc này bằng canvas.
 *
 * Bản gốc vẫn upload riêng, không đụng — sau này đổi kích thước hiển thị thì còn
 * cái mà làm lại.
 */

export const DISPLAY_MAX = 1600;
export const THUMB_MAX = 600;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Không đọc được file ảnh này.'));
    };
    img.src = url;
  });
}

/** Trả về blob WebP, cạnh dài nhất = maxEdge (không phóng to ảnh nhỏ). */
export async function resizeToWebp(file: File, maxEdge: number, quality = 0.86): Promise<Blob> {
  const img = await loadImage(file);
  const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Trình duyệt không hỗ trợ xử lý ảnh.');
  ctx.drawImage(img, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Không chuyển được ảnh sang WebP.'))),
      'image/webp',
      quality,
    );
  });
}

export function extensionOf(file: File): string {
  const fromName = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (fromName && fromName.length <= 5) return fromName;
  return file.type.split('/')[1] ?? 'jpg';
}
