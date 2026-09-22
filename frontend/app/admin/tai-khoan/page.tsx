'use client';

import { useState } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import { ApiRequestError, authApi } from '@/lib/api';
import { readToken, useSession } from '@/lib/session';

export default function AccountPage() {
  const session = useSession();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const token = readToken();
    if (!token) return;
    setStatus(null);

    if (next !== confirm) {
      setStatus({ ok: false, message: 'Hai ô mật khẩu mới không giống nhau.' });
      return;
    }
    if (next.length < 8) {
      setStatus({ ok: false, message: 'Mật khẩu mới phải từ 8 ký tự.' });
      return;
    }

    setBusy(true);
    try {
      await authApi.changePassword(token, current, next);
      setStatus({ ok: true, message: 'Đã đổi mật khẩu. Lần đăng nhập sau dùng mật khẩu mới.' });
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch (err) {
      setStatus({
        ok: false,
        message: err instanceof ApiRequestError ? err.message : 'Không đổi được mật khẩu.',
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell title="Tài khoản" subtitle={session.fullName ?? ''}>
      <form
        onSubmit={submit}
        className="card"
        style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 460 }}
      >
        <div>
          <h2 style={{ fontSize: 'var(--h3)', fontWeight: 600 }}>Đổi mật khẩu</h2>
          <p className="field-hint" style={{ paddingTop: 4 }}>
            Đổi ngay sau lần đăng nhập đầu tiên. Đừng dùng lại mật khẩu của Zalo hay email.
          </p>
        </div>

        {status && <div className={`notice${status.ok ? ' notice-ok' : ''}`}>{status.message}</div>}

        <label className="field">
          <span className="field-label">Mật khẩu hiện tại</span>
          <input
            className="input"
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            required
          />
        </label>
        <label className="field">
          <span className="field-label">Mật khẩu mới</span>
          <input
            className="input"
            type="password"
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            required
          />
          <span className="field-hint">Ít nhất 8 ký tự. Một câu ngắn dễ nhớ tốt hơn một chuỗi khó gõ.</span>
        </label>
        <label className="field">
          <span className="field-label">Nhập lại mật khẩu mới</span>
          <input
            className="input"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </label>

        <button className="btn" type="submit" disabled={busy}>
          {busy ? 'Đang đổi…' : 'Đổi mật khẩu'}
        </button>
      </form>
    </AdminShell>
  );
}
