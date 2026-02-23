import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
    try {
        const db = await pool.getConnection();
        const [rows] = await db.query("SELECT * FROM vaccines");
        db.release();
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    let db;
    try {
        const body = await request.json();
        db = await pool.getConnection();
        await db.beginTransaction(); // เริ่มกระบวนการบันทึกหลายตาราง

        // 1. บันทึกข้อมูลหลักลงตาราง vaccines
        const sql = `
            INSERT INTO vaccines 
            (id, trade_name, name_th, name_en, indication, vaccine_type, price, is_available, administration, admin_route, image_url, allergies, side_effects) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await db.query(sql, [
            body.id,
            body.trade_name,
            body.name_th,
            body.name_en,
            body.indication,
            body.vaccine_type,
            body.price,
            body.is_available ? 1 : 0,
            body.dosage_ml,
            body.admin_route,
            body.image_url,
            JSON.stringify(body.allergies), // แปลง object การแพ้เป็นข้อความ JSON
            body.side_effects,
        ]);

        // 2. บันทึกเงื่อนไขอายุ (Loop ลงตารางลูก)
        if (body.age_conditions && body.age_conditions.length > 0) {
            for (const age of body.age_conditions) {
                await db.query(
                    `
                    INSERT INTO vaccine_rules_age (vaccine_id, min_age, max_age, dose_count, frequency_desc, status)
                    VALUES (?, ?, ?, ?, ?, ?)
                `,
                    [
                        body.id,
                        age.minAge || 0,
                        age.maxAge || 999,
                        age.dose || 1,
                        age.frequency || "",
                        "Recommended",
                    ],
                );
            }
        }

        // 3. บันทึกเงื่อนไขโรค (Loop ลงตารางลูก)
        if (body.disease_conditions && body.disease_conditions.length > 0) {
            for (const dis of body.disease_conditions) {
                // ต้องมี condition_id (สมมติให้ใส่ 0 ไปก่อนถ้าไม่มีใน Master)
                await db.query(
                    `
                    INSERT INTO vaccine_rules_condition (condition_name, vaccine_id, dose_count, frequency_desc, status)
                    VALUES (?, ?, ?, ?, ?)
                `,
                    [
                        dis.selectedDisease,
                        body.id,
                        dis.dose || 1,
                        dis.frequency || "",
                        "Recommended",
                    ],
                );
            }
        }

        await db.commit(); // ยืนยันการบันทึกทั้งหมด
        return NextResponse.json({ message: "Success", id: body.id });
    } catch (error) {
        if (db) await db.rollback(); // ถ้าพัง ให้ยกเลิกทั้งหมด
        console.error("Save Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        if (db) db.release();
    }
}
