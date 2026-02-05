import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// 1. ลบข้อมูล (DELETE)
export async function DELETE(request, { params }) {
    try {
        const id = params.id;
        const db = await pool.getConnection();
        await db.query('DELETE FROM vaccines WHERE id = ?', [id]);
        db.release();
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 2. แก้ไขข้อมูล (PUT)
export async function PUT(request, { params }) {
    try {
        const id = params.id;
        const body = await request.json();
        const db = await pool.getConnection();

        const sql = `
            UPDATE vaccines 
            SET name_th=?, name_en=?, trade_name=?, price=?, image_url=?
            WHERE id=?
        `;
        await db.query(sql, [body.name_th, body.name_en, body.trade_name, body.price, body.image_url, id]);

        db.release();
        return NextResponse.json({ message: 'Update success' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}