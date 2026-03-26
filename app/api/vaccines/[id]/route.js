import { NextResponse } from "next/server";
import pool from "@/lib/db";

// 1. GET: ดึงข้อมูลเพื่อไปโชว์ในหน้า Edit
export async function GET(request, { params }) {
    const { id } = await params;
    const db = await pool.getConnection();

    try {
        const [vaccines] = await db.query("SELECT * FROM vaccines WHERE id = ?", [
            id,
        ]);
        if (vaccines.length === 0) {
            return NextResponse.json(
                { message: "Vaccine not found" },
                { status: 404 },
            );
        }
        const vaccine = vaccines[0];

        const [ageRules] = await db.query(
            "SELECT * FROM vaccine_rules_age WHERE vaccine_id = ?",
            [id],
        );
        const [diseaseRules] = await db.query(
            "SELECT * FROM vaccine_rules_condition WHERE vaccine_id = ?",
            [id],
        );

        // ดึงข้อมูลวัคซีนที่ห้ามฉีดร่วม
        const [contraRules] = await db.query(
            "SELECT * FROM vaccine_rules_contraindication WHERE vaccine_id = ?",
            [id],
        );

        const groupedDiseases = [];
        diseaseRules.forEach((rule) => {
            const existingGroup = groupedDiseases.find(
                (g) =>
                    g.dose === rule.dose_count && g.frequency === rule.frequency_desc,
            );
            if (existingGroup) {
                existingGroup.selectedDiseases.push(rule.condition_name);
            } else {
                groupedDiseases.push({
                    selectedDiseases: [rule.condition_name],
                    dose: rule.dose_count,
                    frequency: rule.frequency_desc,
                    status: rule.status,
                    detail: rule.detail || "", // ✨ ดึง detail มาด้วย
                });
            }
        });

        const responseData = {
            ...vaccine,
            age_conditions: ageRules.map((r) => ({
                minAge: r.min_age,
                maxAge: r.max_age,
                dose: r.dose_count,
                frequency: r.frequency_desc,
                status: r.status,
                detail: r.detail || "", 
            })),
            disease_conditions: groupedDiseases,
            contraindicated_conditions: contraRules,
            allergies: vaccine.allergies ? JSON.parse(vaccine.allergies) : null,
        };

        return NextResponse.json(responseData);
    } catch (error) {
        console.error("Fetch Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        db.release();
    }
}

// 2. PUT: บันทึกการแก้ไข
export async function PUT(request, { params }) {
    const { id } = await params;
    let db;

    try {
        const body = await request.json();
        db = await pool.getConnection();
        await db.beginTransaction();

        // A. อัปเดตข้อมูลตารางแม่
        const sql = `
            UPDATE vaccines SET 
            trade_name=?, name_th=?, name_en=?, indication=?, vaccine_type=?, price=?, 
            is_available=?, administration=?, admin_route=?, image_url=?, 
            allergies=?, side_effects=?
            WHERE id = ?
        `;
        await db.query(sql, [
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
            JSON.stringify(body.allergies),
            body.side_effects,
            id,
        ]);

        // B. ล้างข้อมูลเก่าก่อนอัปเดต
        await db.query("DELETE FROM vaccine_rules_age WHERE vaccine_id = ?", [id]);
        await db.query("DELETE FROM vaccine_rules_condition WHERE vaccine_id = ?", [
            id,
        ]);
        await db.query(
            "DELETE FROM vaccine_rules_contraindication WHERE vaccine_id = ?",
            [id],
        );

        // C. ยัดข้อมูลอายุ (เพิ่ม detail เข้าไปด้วย)
        if (body.age_conditions && body.age_conditions.length > 0) {
            for (const age of body.age_conditions) {
                const min = age.minAge !== "" && age.minAge !== null ? age.minAge : 0;
                const max = age.maxAge !== "" && age.maxAge !== null ? age.maxAge : 999;

                await db.query(
                    `INSERT INTO vaccine_rules_age (vaccine_id, min_age, max_age, dose_count, frequency_desc, status, detail) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [
                        id,
                        min,
                        max,
                        age.dose || 1,
                        age.frequency || "",
                        age.status || "",
                        age.detail || "",
                    ],
                );
            }
        }

        // D. ยัดข้อมูลโรค (เพิ่ม detail เข้าไปด้วย)
        if (body.disease_conditions && body.disease_conditions.length > 0) {
            for (const dis of body.disease_conditions) {
                if (dis.selectedDiseases && dis.selectedDiseases.length > 0) {
                    for (const diseaseName of dis.selectedDiseases) {
                        await db.query(
                            `INSERT INTO vaccine_rules_condition (condition_name, vaccine_id, dose_count, frequency_desc, status, detail) 
                             VALUES (?, ?, ?, ?, ?, ?)`,
                            [
                                diseaseName,
                                id,
                                dis.dose || 1,
                                dis.frequency || "",
                                dis.status || "",
                                dis.detail || "",
                            ],
                        );
                    }
                }
            }
        }

        // E. ยัดข้อมูลวัคซีนห้ามฉีดร่วม
        if (
            body.contraindicated_conditions &&
            body.contraindicated_conditions.length > 0
        ) {
            for (const contra of body.contraindicated_conditions) {
                if (
                    contra.contraindicated_vaccine &&
                    contra.contraindicated_vaccine.trim() !== ""
                ) {
                    await db.query(
                        `INSERT INTO vaccine_rules_contraindication (vaccine_id, contraindicated_vaccine, interval_desc, detail) 
                         VALUES (?, ?, ?, ?)`,
                        [
                            id,
                            contra.contraindicated_vaccine,
                            contra.interval_desc || "",
                            contra.detail || "",
                        ],
                    );
                }
            }
        }

        await db.commit();
        return NextResponse.json({ message: "Updated successfully" });
    } catch (error) {
        if (db) await db.rollback();
        console.error("Update Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        if (db) db.release();
    }
}

// 3. DELETE: ลบข้อมูล
export async function DELETE(request, { params }) {
    const { id } = await params;
    const db = await pool.getConnection();
    try {
        const [result] = await db.query("DELETE FROM vaccines WHERE id = ?", [id]);
        if (result.affectedRows === 0)
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        return NextResponse.json({ message: "Deleted" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        db.release();
    }
}
