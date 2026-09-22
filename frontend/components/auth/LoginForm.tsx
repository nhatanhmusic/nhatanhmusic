'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ApiRequestError, authApi } from '@/lib/api';
import { STAFF_ROLES, landingFor, saveSession } from '@/lib/session';
import type { UserRole } from '@/lib/types';

/**
 * Mot trang dang nhap cho tat ca — khach va nhan vien dung chung.
 * Vao dung cho nao la do vai tro quyet dinh, khong phai do URL.
 */
export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(
    params.get('expired') ? 'Phiên đăng nhập đã hết hạn. Đăng nhập lại để tiếp tục.' : null,
  );
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await authApi.login(email, password);
      const role = res.role as UserRole;
      saveSession(res.accessToken, res.expiresIn, res.fullName, role);

      // `next` chỉ dùng lại được nếu vai trò thật sự vào được chỗ đó.
      const wantsAdmin = next?.startsWith('/admin');
      if (wantsAdmin && !STAFF_ROLES.includes(role)) {
        setError('Tài khoản này là tài khoản khách, không vào được trang quản trị.');
        setBusy(false);
        return;
      }

      router.replace(next ?? landingFor(role));
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : 'Không gọi được máy chủ. Backend đã chạy ở cổng 8080 chưa?',
      );
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="card"
      style={{
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        width: 420,
        maxWidth: '100%',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span className="eyebrow">Tài khoản</span>
        <h1 style={{ fontSize: 26, fontWeight: 700 }}>Đăng nhập</h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-muted)' }}>
          Bạn <b>không cần tài khoản</b> để mua đàn, đặt lịch sửa hay gửi đàn ký gửi. Tài khoản chỉ
          dùng để theo dõi đàn và xem lại lịch sử đơn.
        </p>
      </div>

      {error && <div className="notice">{error}</div>}

      <label className="field">
        <span className="field-label">Email</span>
        <input
          className="input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          placeholder="ban@email.com"
          required
        />
      </label>

      <label className="field">
        <span className="field-label">Mật khẩu</span>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </label>

      <button className="btn" type="submit" disabled={busy}>
        {busy ? 'Đang đăng nhập…' : 'Đăng nhập'}
      </button>

      <div
        style={{
          borderTop: '1px solid var(--color-line-soft)',
          paddingTop: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <span className="field-hint">
          <b>Tài khoản có sẵn khi chạy local</b>
        </span>
        <span className="field-hint">Nhân viên: admin@nhatanh.vn / admin123</span>
        <span className="field-hint">Khách: khach@nhatanh.vn / khach123</span>
        <span className="field-hint" style={{ paddingTop: 6 }}>
          Đổi bằng biến môi trường ADMIN_PASSWORD trước khi lên thật.
        </span>
      </div>

      <Link href="/dan" style={{ fontSize: 'var(--text-base)', fontWeight: 600 }}>
        ← Về xem đàn đang có
      </Link>
    </form>
  );
}
