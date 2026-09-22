import Link from 'next/link';
import { SiteFooter, SiteHeader, TrustStrip, UtilityBar } from '@/components/ui/SiteChrome';
import { RichBlock } from '@/lib/richtext';
import { getSettings, type PlaceholderPage } from '@/lib/settings';

/**
 * Trang giữ chỗ cho những mục chưa xây (Giai đoạn 2–5 của kế hoạch).
 * Thà nói thẳng "chưa có, gọi số này" còn hơn để khách rơi vào 404.
 * Nội dung lấy theo slug từ khối "Các trang tạm" trong /admin/noi-dung.
 */
export async function ComingSoon({ slug }: { slug: string }) {
  const { shop_contact: shop, placeholder_pages: pages } = await getSettings();
  const page = pages[slug] as PlaceholderPage | undefined;

  const eyebrow = page?.eyebrow ?? '';
  const title = page?.title ?? 'Trang đang được xây';
  const body = page?.body ?? '';

  return (
    <>
      <UtilityBar />
      <SiteHeader />
      <TrustStrip />
      <div className="container" style={{ padding: '72px var(--container-pad) 80px' }}>
        <div
          className="card"
          style={{ maxWidth: 680, margin: '0 auto', padding: 40, display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 style={{ fontSize: 'var(--h1-page)', fontWeight: 700 }}>{title}</h1>
          {body && (
            <RichBlock text={body} style={{ fontSize: 'var(--text-md)', color: 'var(--color-ink-2)' }} />
          )}
          <div
            className="card card-accent"
            style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 4 }}
          >
            <b>{pages.contactTitle ?? 'Liên hệ trực tiếp'}</b>
            <span>Hotline &amp; Zalo: {shop.phone}</span>
            <span style={{ color: 'var(--color-muted)', fontSize: 'var(--text-sm)' }}>
              {shop.hours} · {shop.address}
            </span>
          </div>
          <Link href="/dan" className="btn btn-alt" style={{ alignSelf: 'flex-start' }}>
            ← {pages.backLabel ?? 'Xem đàn đang có'}
          </Link>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}

/** Tiêu đề tab trình duyệt, lấy cùng nguồn. */
export async function placeholderTitle(slug: string): Promise<string> {
  const { placeholder_pages: pages } = await getSettings();
  return (pages[slug] as PlaceholderPage | undefined)?.title ?? 'Đang xây dựng';
}
