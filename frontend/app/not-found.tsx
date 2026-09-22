import Link from 'next/link';
import { SiteFooter, SiteHeader, UtilityBar } from '@/components/ui/SiteChrome';

export default function NotFound() {
  return (
    <>
      <UtilityBar />
      <SiteHeader />
      <div className="container" style={{ padding: '80px var(--container-pad)' }}>
        <div className="empty" style={{ maxWidth: 620, margin: '0 auto' }}>
          <span className="eyebrow">404</span>
          <h1 style={{ fontSize: 'var(--h1-page)', fontWeight: 700 }}>Không có trang này</h1>
          <p style={{ color: 'var(--color-muted)' }}>
            Có thể cây đàn đã bán và trang bị gỡ, hoặc đường dẫn gõ sai.
          </p>
          <Link href="/dan" className="btn">
            Xem đàn đang có
          </Link>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
