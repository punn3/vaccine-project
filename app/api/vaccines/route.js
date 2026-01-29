import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// 1. GET: ดึงข้อมูล
export async function GET() {
    try {
        const db = await pool.getConnection();
        const [rows] = await db.query('SELECT * FROM vaccines');
        db.release();
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 2. POST: บันทึกข้อมูล (จุดที่แก้)
export async function POST(request) {
    try {
        const body = await request.json();
        const db = await pool.getConnection();

        // SQL: ต้องใส่ id ลงไปด้วย และเปลี่ยน dosage_ml เป็น administration
        const sql = `
      INSERT INTO vaccines 
      (id, trade_name, name_th, name_en, vaccine_type, price, administration, admin_route, image_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const [result] = await db.query(sql, [
            body.id,             // ✅ ใส่ ID ที่ส่งมาจากหน้าเว็บ (เพราะ DB ไม่ได้ Auto)
            body.trade_name,
            body.name_th,
            body.name_en,
            body.vaccine_type,
            body.price,
            body.dosage_ml,      // ✅ เอาค่า dosage_ml ไปใส่ในช่อง administration
            body.admin_route,
            body.image_url
        ]);

        db.release();
        return NextResponse.json({ message: 'Success', id: body.id });

    } catch (error) {
        console.error("Database Error:", error); // ถ้าพังอีก ให้ดู Error ใน Terminal VS Code ครับ
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}