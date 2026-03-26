import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // เช็คว่าอีเมลและรหัสผ่านตรงกับในไฟล์ .env หรือไม่
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const response = NextResponse.json({ success: true, message: "เข้าสู่ระบบสำเร็จ" });
            
            // สร้าง Cookie ชื่อ 'admin_session' อายุ 1 วัน
            response.cookies.set({
                name: 'admin_session',
                value: 'authenticated',
                httpOnly: true, // ป้องกันการถูกขโมยผ่าน JavaScript
                // secure: process.env.NODE_ENV === 'production',
                secure: false,
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 // 24 ชั่วโมง (เป็นวินาที)
            });

            return response;
        }

        // ถ้าไม่ตรง ให้ส่ง Error กลับไป
        return NextResponse.json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 });

    } catch (error) {
        return NextResponse.json({ error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์' }, { status: 500 });
    }
}