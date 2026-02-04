import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// รองรับ DELETE: /api/vaccines/[id]
export async function DELETE(request, { params }) {
    try {
        const id = params.id; // รับค่า id จาก URL (เช่น 12345)
        const db = await pool.getConnection();
        
        // คำสั่ง SQL ลบข้อมูล
        const sql = 'DELETE FROM vaccines WHERE id = ?';
        const [result] = await db.query(sql, [id]);

        db.release();

        // เช็คว่าลบได้จริงไหม (affectedRows > 0 แปลว่ามีแถวถูกลบ)
        if (result.affectedRows === 0) {
            return NextResponse.json({ message: 'Vaccine not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Deleted successfully' });

    } catch (error) {
        console.error("Database Delete Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}