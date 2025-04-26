import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminToken = request.cookies.get('admin_token')?.value;

  // Proteksi semua route dibawah /resepsionis
  if (pathname.startsWith('/resepsionis')) {
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    // Tambahkan pengecekan role jika diperlukan
    // const role = getRoleFromToken(adminToken);
    // if (role !== 'resepsionis') {
    //   return NextResponse.redirect(new URL('/unauthorized', request.url));
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/resepsionis/:path*'],
};