import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// 1. GET: ดึงข้อมูล
export async function GET() {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query('SELECT * FROM vaccines');
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        if (db) db.release(); // คืน Connection ให้ Pool เสมอ
    }
}

// 2. POST: บันทึกข้อมูล (จุดที่แก้)
export async function POST(request) {
    let db;
    try {
        const body = await request.json();
        db = await pool.getConnection();

        // SQL: ต้องใส่ id ลงไปด้วย และเปลี่ยน dosage_ml เป็น administration
        const sql = `
      INSERT INTO vaccines 
      (id, trade_name, name_th, name_en, vaccine_type, price, is_available, administration, admin_route, image_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const [result] = await db.query(sql, [
            body.id,             // ✅ ใส่ ID ที่ส่งมาจากหน้าเว็บ (เพราะ DB ไม่ได้ Auto)
            body.trade_name,
            body.name_th,
            body.name_en,
            body.vaccine_type,
            body.price,
            body.is_available ? 1 : 0,
            body.dosage_ml,      // ✅ เอาค่า dosage_ml ไปใส่ในช่อง administration
            body.admin_route,
            body.image_url
        ]);
        return NextResponse.json({ message: 'Success', id: body.id });

    } catch (error) {
        console.error("Database Error:", error); // ถ้าพังอีก ให้ดู Error ใน Terminal VS Code ครับ
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        if (db) db.release();
    }
}