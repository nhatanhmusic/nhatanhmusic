import { NextResponse, type NextRequest } from 'next/server';

/**
 * Đầu chặn thứ nhất: chưa đăng nhập, hoặc đăng nhập bằng tài khoản khách, thì
 * không vào được /admin (mục 6).
 *
 * Đây KHÔNG phải lớp bảo mật thật — cookie do trình duyệt giữ nên sửa được.
 * Đầu chặn thật là @PreAuthorize ở Spring Boot, nơi chữ ký JWT được kiểm.
 * Ở đây chỉ để khách không rơi vào một trang trống toàn lỗi 403.
 */
const STAFF_ROLES = ['STAFF', 'ADMIN'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('na_token')?.value;
  const role = request.cookies.get('na_role')?.value;

  if (!token || !role || !STAFF_ROLES.includes(role)) {
    const login = new URL('/dang-nhap', request.url);
    login.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
