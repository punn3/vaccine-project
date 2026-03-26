import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
    try {
        const db = await pool.getConnection();
        const [rows] = await db.query("SELECT * FROM vaccines");
        db.release();
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Fetch Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    let db;
    try {
        const body = await request.json();
        db = await pool.getConnection();
        await db.beginTransaction();

        // 1. บันทึกข้อมูลหลัก  ตัด id ออก ไม่ต้องส่งให้ MySQL เพราะมันรันออโต้แล้ว
        const sql = `
            INSERT INTO vaccines 
            (trade_name, name_th, name_en, indication, vaccine_type, price, is_available, administration, admin_route, image_url, allergies, side_effects) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            body.trade_name, body.name_th, body.name_en, body.indication, body.vaccine_type, 
            body.price, body.is_available ? 1 : 0, body.dosage_ml, body.admin_route, 
            body.image_url, JSON.stringify(body.allergies), body.side_effects
        ]);
        const newVaccineId = result.insertId; 

        // 2. บันทึกเงื่อนไขอายุ 
        if (body.age_conditions && body.age_conditions.length > 0) {
            for (const age of body.age_conditions) {
                const min = age.minAge !== "" && age.minAge !== null ? age.minAge : 0;
                const max = age.maxAge !== "" && age.maxAge !== null ? age.maxAge : 999;
                await db.query(
                    `INSERT INTO vaccine_rules_age (vaccine_id, min_age, max_age, dose_count, frequency_desc, status, detail) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [newVaccineId, min, max, age.dose || 1, age.frequency || "", age.status || "Recommended", age.detail || ""]
                );
            }
        }

        // 3. บันทึกเงื่อนไขโรค 
        if (body.disease_conditions && body.disease_conditions.length > 0) {
            for (const dis of body.disease_conditions) {
                if (dis.selectedDiseases && dis.selectedDiseases.length > 0) {
                    for (const diseaseName of dis.selectedDiseases) {
                        await db.query(
                            `INSERT INTO vaccine_rules_condition (condition_name, vaccine_id, dose_count, frequency_desc, status, detail) VALUES (?, ?, ?, ?, ?, ?)`,
                            [diseaseName, newVaccineId, dis.dose || 1, dis.frequency || "", dis.status || "Recommended", dis.detail || ""]
                        );
                    }
                }
            }
        }

        // 4. บันทึกข้อห้ามฉีดวัคซีน 
        if (body.contraindicated_conditions && body.contraindicated_conditions.length > 0) {
            for (const contra of body.contraindicated_conditions) {
                if (contra.contraindicated_vaccine && contra.contraindicated_vaccine.trim() !== "") {
                    await db.query(
                        `INSERT INTO vaccine_rules_contraindication (vaccine_id, contraindicated_vaccine, interval_desc, detail) VALUES (?, ?, ?, ?)`,
                        [newVaccineId, contra.contraindicated_vaccine, contra.interval_desc || "", contra.detail || ""]
                    );
                }
            }
        }

        await db.commit(); 
        return NextResponse.json({ message: "Success", id: newVaccineId });
    } catch (error) {
        if (db) await db.rollback(); 
        console.error("Save Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        if (db) db.release();
    }
}