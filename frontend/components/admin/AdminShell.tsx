'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearSession, useSession } from '@/lib/session';

const NAV = [
  { href: '/admin', label: 'Tổng quan', exact: true },
  { href: '/admin/dan', label: 'Kho đàn & gear' },
  { href: '/admin/model', label: 'Model sản phẩm' },
  { href: '/admin/danh-muc', label: 'Hãng & danh mục' },
  { href: '/admin/noi-dung', label: 'Nội dung web' },
  { href: '/admin/tai-khoan', label: 'Tài khoản & mật khẩu' },
  { href: '/admin/don-hang', label: 'Đơn hàng', soon: true },
  { href: '/admin/lich-sua-chua', label: 'Lịch hẹn sửa chữa', soon: true },
  { href: '/admin/khoa-hoc', label: 'Khóa học', soon: true },
  { href: '/admin/khach-hang', label: 'Khách hàng', soon: true },
  { href: '/admin/bao-cao', label: 'Báo cáo', soon: true },
];

export function AdminShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();

  const isActive = (item: (typeof NAV)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            paddingBottom: 20,
            borderBottom: '1px solid #2B4536',
            width: '100%',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo-sm.png" alt="" style={{ width: 46, height: 46 }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <b style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--color-cream)' }}>
              Nhật Anh
            </b>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-green-light)', letterSpacing: '.06em' }}>
              TRANG QUẢN TRỊ
            </span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, flexGrow: 1 }}>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.soon ? '#' : item.href}
              className={`admin-navlink${isActive(item) ? ' admin-navlink-active' : ''}`}
              aria-disabled={item.soon}
              onClick={(e) => item.soon && e.preventDefault()}
              style={item.soon ? { opacity: 0.45, cursor: 'not-allowed' } : undefined}
            >
              {item.label}
              {item.soon && (
                <span style={{ marginLeft: 'auto', fontSize: 10.5, letterSpacing: '.08em' }}>
                  GĐ SAU
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div style={{ paddingTop: 18, borderTop: '1px solid #2B4536', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 8px' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: '#2A4835',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 14,
                color: 'var(--color-cream)',
                flexShrink: 0,
              }}
            >
              NA
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <b style={{ fontSize: 13.5, color: 'var(--color-cream)' }}>
                {session.fullName ?? 'Quản trị viên'}
              </b>
              <button
                type="button"
                onClick={() => {
                  clearSession();
                  router.replace('/dang-nhap');
                }}
                style={{
                  background: 'none',
                  border: 0,
                  padding: 0,
                  textAlign: 'left',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-green-light)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <h1 style={{ fontSize: 22, fontWeight: 600 }}>{title}</h1>
            {subtitle && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted-2)' }}>{subtitle}</span>}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>{actions}</div>
        </div>
        {children}
      </main>
    </div>
  );
}
