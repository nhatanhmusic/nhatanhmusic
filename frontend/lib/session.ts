'use client';

import { useEffect, useState } from 'react';
import type { UserRole } from './types';

/**
 * Phiên đăng nhập — dùng chung cho cả khách và nhân viên (một trang /dang-nhap).
 *
 * Token nằm trong cookie để middleware Next.js chặn được /admin ở đầu frontend.
 * Đó mới là một nửa: nửa còn lại là @PreAuthorize ở Spring — chặn mỗi frontend
 * là không chặn gì cả (mục 6). Vai trò lưu cạnh token cũng chỉ để vẽ giao diện,
 * không phải để phân quyền: quyền thật nằm trong chữ ký JWT mà Spring kiểm.
 *
 * Giai đoạn 5 sẽ đổi sang refresh token trong cookie HttpOnly như kế hoạch.
 */

const TOKEN_COOKIE = 'na_token';
const ROLE_COOKIE = 'na_role';
const NAME_KEY = 'na_name';

/** Vai trò được vào trang quản trị. */
export const STAFF_ROLES: UserRole[] = ['STAFF', 'ADMIN'];

export function saveSession(
  token: string,
  expiresInSeconds: number,
  fullName: string,
  role: UserRole,
) {
  const opts = `path=/; max-age=${expiresInSeconds}; samesite=lax`;
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; ${opts}`;
  document.cookie = `${ROLE_COOKIE}=${role}; ${opts}`;
  try {
    localStorage.setItem(NAME_KEY, fullName);
  } catch {
    /* trình duyệt chặn storage — bỏ qua, chỉ mất tên hiển thị */
  }
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function readToken(): string | null {
  return readCookie(TOKEN_COOKIE);
}

export function readRole(): UserRole | null {
  return (readCookie(ROLE_COOKIE) as UserRole | null) ?? null;
}

export function clearSession() {
  const opts = 'path=/; max-age=0; samesite=lax';
  document.cookie = `${TOKEN_COOKIE}=; ${opts}`;
  document.cookie = `${ROLE_COOKIE}=; ${opts}`;
  try {
    localStorage.removeItem(NAME_KEY);
  } catch {
    /* bỏ qua */
  }
}

/** Đăng nhập xong thì đi đâu: nhân viên vào quản trị, khách về trang chủ. */
export function landingFor(role: UserRole): string {
  return STAFF_ROLES.includes(role) ? '/admin' : '/';
}

export function useSession() {
  const [session, setSession] = useState<{
    token: string | null;
    role: UserRole | null;
    fullName: string | null;
  }>({ token: null, role: null, fullName: null });

  useEffect(() => {
    let name: string | null = null;
    try {
      name = localStorage.getItem(NAME_KEY);
    } catch {
      /* bỏ qua */
    }
    setSession({ token: readToken(), role: readRole(), fullName: name });
  }, []);

  return session;
}
