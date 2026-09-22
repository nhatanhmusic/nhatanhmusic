import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SiteFooter, SiteHeader, UtilityBar } from '@/components/ui/SiteChrome';

export const metadata: Metadata = {
  title: 'Đăng nhập',
  description: 'Đăng nhập để theo dõi đàn và xem lại lịch sử đơn. Mua hàng thì không cần tài khoản.',
};

export default function LoginPage() {
  return (
    <>
      <UtilityBar />
      <SiteHeader />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: 'var(--sp-16) var(--container-pad)',
        }}
      >
        <Suspense fallback={<div className="card skeleton" style={{ width: 420, height: 480 }} />}>
          <LoginForm />
        </Suspense>
      </div>
      <SiteFooter />
    </>
  );
}
