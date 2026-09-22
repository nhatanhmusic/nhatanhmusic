import { PHOTO_KIND_LABEL, type PhotoKind } from '@/lib/types';

/**
 * Ô CHỜ ẢNH khi chạy local.
 *
 * Backend lưu `r2_key` (ví dụ items/1/main-1.webp) và ghép với
 * MEDIA_PUBLIC_BASE_URL để ra URL. Khi chưa có Cloudflare R2, base trỏ về đây và
 * route này vẽ đúng hoa văn `.photo-placeholder` của bản thiết kế.
 *
 * Khi đã có R2 thật: đổi MEDIA_PUBLIC_BASE_URL sang domain R2 và XÓA file này —
 * lúc đó ảnh đi thẳng từ CDN, không qua Next.js (mục 5 của kế hoạch build).
 */

function labelFor(path: string[]): string {
  const file = path[path.length - 1] ?? '';
  const kind = file.split('-')[0]?.toUpperCase();
  if (kind && kind in PHOTO_KIND_LABEL) {
    return PHOTO_KIND_LABEL[kind as PhotoKind];
  }
  return 'Ảnh thật';
}

export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const label = labelFor(path);
  const key = path.join('/');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000">
  <defs>
    <pattern id="hatch" width="28" height="28" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
      <rect width="28" height="28" fill="#EFEADB"/>
      <rect width="14" height="28" fill="#E8E2D1"/>
    </pattern>
  </defs>
  <rect width="1000" height="1000" fill="url(#hatch)"/>
  <text x="500" y="486" text-anchor="middle" font-family="'Be Vietnam Pro',system-ui,sans-serif"
        font-size="46" font-weight="700" letter-spacing="7" fill="#A69C86">${label.toUpperCase()}</text>
  <text x="500" y="546" text-anchor="middle" font-family="'Be Vietnam Pro',system-ui,sans-serif"
        font-size="26" fill="#B5AB94">chưa có ảnh thật · ${key}</text>
</svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
