import Link from 'next/link';
import { catalogApi, safe } from '@/lib/api';
import { buildNav } from '@/lib/nav';
import { RichText } from '@/lib/richtext';
import { getSettings } from '@/lib/settings';
import { SHOP } from '@/lib/shop';
import {
  IconArrowRight,
  IconCart,
  IconCheck,
  IconChevronDown,
  IconHeart,
  IconSearch,
  IconStar,
  IconUser,
} from './Icons';

/** Thanh tiện ích trên cùng — design/screens/trang-chu.html */
export async function UtilityBar() {
  const { shop_contact: shop } = await getSettings();

  return (
    <div className="utility-bar">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconStar size={14} color="#D4B784" />
          <b>{shop.rating}/5</b>
          <span>· {shop.reviewCount} đánh giá Google</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <span>Hotline &amp; Zalo: {shop.phone}</span>
          <span style={{ opacity: 0.35 }}>/</span>
          <span>{shop.hours}</span>
        </div>
      </div>
    </div>
  );
}

export async function SiteHeader({ activeNav }: { activeNav?: string }) {
  // Menu dựng từ danh mục và hãng có thật trong database (xem lib/nav.ts).
  const [{ data: categories }, { data: filters }] = await Promise.all([
    safe(catalogApi.categories()),
    safe(catalogApi.filters()),
  ]);
  const nav = buildNav(categories, filters);

  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" aria-label={SHOP.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo-round.png" alt={SHOP.name} className="site-logo" />
        </Link>

        <nav className="site-nav" aria-label="Điều hướng chính">
          {nav.map((item) =>
            item.columns ? (
              /* Mở bằng cả rê chuột lẫn phím Tab — :hover và :focus-within trong
                 globals.css, không cần JavaScript nên menu chạy ngay khi tải trang. */
              <div className="navitem" key={item.label}>
                <Link
                  href={item.href}
                  className={`navlink navlink-trigger${activeNav === item.label ? ' navlink-active' : ''}`}
                  aria-haspopup="true"
                >
                  {item.label}
                  <IconChevronDown />
                </Link>

                <div className="dropdown" role="group" aria-label={item.label}>
                  <div className="dropdown-inner">
                    <div
                      className="dropdown-cols"
                      style={{
                        gridTemplateColumns: `repeat(${item.columns.length}, minmax(150px, 1fr))`,
                      }}
                    >
                      {item.columns.map((col) => (
                        <div className="dropdown-col" key={col.title}>
                          <span className="dropdown-title">{col.title}</span>
                          {col.links.map((link) => (
                            <Link
                              key={link.href + link.label}
                              href={link.href}
                              className="dropdown-link"
                            >
                              {link.label}
                              {link.count !== undefined && (
                                <span className="dropdown-count">{link.count}</span>
                              )}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>

                    {item.footerLink && (
                      <Link href={item.footerLink.href} className="dropdown-footer">
                        {item.footerLink.label}
                        <IconArrowRight size={14} color="var(--color-brass)" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={`navlink${activeNav === item.label ? ' navlink-active' : ''}`}
              >
                {item.label}
              </Link>
            ),
          )}
          <Link href="/ban-dan" className="navlink navlink-outline">
            Bán đàn cho shop
          </Link>
        </nav>

        <div style={{ flexGrow: 1 }} />

        <form className="header-search" action="/dan" role="search">
          <IconSearch />
          <input type="search" name="q" placeholder="Tìm đàn, pedal…" aria-label="Tìm sản phẩm" />
        </form>

        <div className="header-actions">
          <Link href="/theo-doi" className="header-action" title="Đang theo dõi">
            <IconHeart />
          </Link>
          <Link href="/dang-nhap" className="header-action">
            <IconUser />
            Tài khoản
          </Link>
          <Link href="/gio-hang" className="header-action">
            <IconCart />
            Giỏ hàng
          </Link>
        </div>
      </div>
    </header>
  );
}

export async function TrustStrip() {
  const { trust_points: points } = await getSettings();
  if (points.length === 0) return null;

  return (
    <div className="trust-strip">
      <div className="container">
        {points.map((point) => (
          <span className="trust" key={point}>
            <IconCheck />
            {point}
          </span>
        ))}
      </div>
    </div>
  );
}

export async function SiteFooter() {
  const { shop_contact: shop, footer } = await getSettings();
  const columns = footer.columns ?? [];

  return (
    <footer className="site-footer">
      <div
        className="container footer-grid"
        style={{ gridTemplateColumns: `1.5fr ${columns.map(() => '1fr').join(' ')}` }}
      >
        <div className="footer-col">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo-round.png" alt={SHOP.name} style={{ width: 88, height: 88 }} />
          <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.7 }}>
            <RichText text={footer.tagline} />
            <br />
            {shop.address}
            <br />
            {shop.hours} · Hotline {shop.phone}
          </p>
        </div>

        {columns.map((col, i) => (
          <div className="footer-col" key={i}>
            <span className="footer-head">{col.title}</span>
            {col.links.map((link, j) => (
              <Link key={j} href={link.href}>
                {link.label}
              </Link>
            ))}
            {/* Ghi chú bảo mật đặt ở cột cuối, theo bản thiết kế */}
            {i === columns.length - 1 && footer.privacyNote && (
              <p style={{ fontSize: 'var(--text-sm)', paddingTop: 'var(--sp-2)' }}>
                <RichText text={footer.privacyNote} />
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="container">
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {SHOP.name}
          </span>
          <span>{shop.businessInfo}</span>
        </div>
      </div>
    </footer>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel,
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 'var(--sp-6)',
        paddingBottom: 22,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 style={{ fontSize: 'var(--h2)', fontWeight: 700 }}>{title}</h2>
      </div>
      {href && linkLabel && (
        <Link href={href} style={{ fontSize: 'var(--text-base)', fontWeight: 600, paddingBottom: 6 }}>
          {linkLabel} <IconArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}
