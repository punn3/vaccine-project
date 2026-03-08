import { NextResponse } from 'next/server'

export function middleware(request) {
    // ดึงค่า Cookie ที่เราสร้างไว้ตอน Login
    const session = request.cookies.get('admin_session')?.value;
    const { pathname } = request.nextUrl;

    // 1. ถ้าพยายามเข้าโฟลเดอร์ /admin/... แต่ยังไม่ได้ล็อกอิน -> เด้งไปหน้า /login
    if (pathname.startsWith('/admin') && session !== 'authenticated') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. ถ้าล็อกอินแล้ว แต่เผลอกดมาหน้า /login อีก -> เด้งกลับไปหน้า /admin
    if (pathname === '/login' && session === 'authenticated') {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
}

// ระบุว่าให้ Middleware ทำงานแค่กับ URL ไหนบ้าง (ลดภาระเซิร์ฟเวอร์)
export const config = {
    matcher: ['/admin/:path*', '/login'],
}