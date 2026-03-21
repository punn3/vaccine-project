import { NextResponse } from "next/server";
import pool from "@/lib/db";

// 1. GET: ดึงข้อมูลเพื่อไปโชว์ในหน้า Edit
export async function GET(request, { params }) {
    const { id } = await params; // (Next.js 15 ต้อง await params)
    const db = await pool.getConnection();

    try {
        // A. ดึงข้อมูลหลักจากตารางแม่
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

        // B. วิ่งไปดึงข้อมูล "เงื่อนไขอายุ" จากตารางลูก
        const [ageRules] = await db.query(
            "SELECT * FROM vaccine_rules_age WHERE vaccine_id = ?",
            [id],
        );

        // C. วิ่งไปดึงข้อมูล "เงื่อนไขโรค" จากตารางลูก
        const [diseaseRules] = await db.query(
            "SELECT * FROM vaccine_rules_condition WHERE vaccine_id = ?",
            [id],
        );

        // D. ประกอบร่างข้อมูลส่งกลับไปให้หน้าเว็บ
        // เขียนฟังก์ชันแอบจัดกลุ่ม (Group) โรคที่มี "เข็ม" และ "ความถี่" เท่ากัน ให้อยู่กล่องเดียวกัน
        const groupedDiseases = [];
        
        diseaseRules.forEach((rule) => {
            // เช็กว่ามีกลุ่มนี้อยู่หรือยัง (เข็มเท่ากัน ความถี่เท่ากัน)
            const existingGroup = groupedDiseases.find(
                (g) => g.dose === rule.dose_count && g.frequency === rule.frequency_desc
            );

            if (existingGroup) {
                // ถ้ามีแล้ว ยัดชื่อโรคเพิ่มเข้าไปใน Array เดิม
                existingGroup.selectedDiseases.push(rule.condition_name);
            } else {
                // ถ้ายังไม่มี สร้างกลุ่มใหม่ (Array ใหม่)
                groupedDiseases.push({
                    selectedDiseases: [rule.condition_name], // เติม s ให้ตรงกับหน้า UI แล้ว
                    dose: rule.dose_count,
                    frequency: rule.frequency_desc,
                    detail: "" 
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
                detail: "", 
            })),
            
            // ส่งก้อนที่จัดกลุ่มเสร็จแล้วไปให้หน้าเว็บ
            disease_conditions: groupedDiseases, 

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
        await db.beginTransaction(); // เริ่มระบบ Transaction (ต้องสำเร็จทุกขั้น ไม่งั้นยกเลิกหมด)

        // A. อัปเดตข้อมูลตารางแม่ (vaccines)
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
            JSON.stringify(body.allergies), // แปลง Checkbox เป็นข้อความก่อนเก็บ
            body.side_effects,
            id,
        ]);

        // B. ล้างข้อมูลเงื่อนไขเก่าทิ้งให้หมด (Reset)
        await db.query("DELETE FROM vaccine_rules_age WHERE vaccine_id = ?", [id]);
        await db.query("DELETE FROM vaccine_rules_condition WHERE vaccine_id = ?", [
            id,
        ]);

        // C. ยัดข้อมูลเงื่อนไขอายุชุดใหม่ลงไป
        if (body.age_conditions && body.age_conditions.length > 0) {
            for (const age of body.age_conditions) {
                // เช็คค่าว่างก่อนบันทึก
                const min = age.minAge && age.minAge !== "" ? age.minAge : 0;
                const max = age.maxAge && age.maxAge !== "" ? age.maxAge : 999;

                await db.query(
                    `
                    INSERT INTO vaccine_rules_age (vaccine_id, min_age, max_age, dose_count, frequency_desc, status) 
                    VALUES (?, ?, ?, ?, ?, ?)`,
                    [id, min, max, age.dose || 1, age.frequency || "", "Recommended"],
                );
            }
        }

        // D. ยัดข้อมูลเงื่อนไขโรคชุดใหม่ลงไป
        if (body.disease_conditions && body.disease_conditions.length > 0) {
            for (const dis of body.disease_conditions) {
                // เช็กว่ามี array selectedDiseases ส่งมาและไม่ว่าง
                if (dis.selectedDiseases && dis.selectedDiseases.length > 0) {
                    
                    // แตก Array ออกมาบันทึกทีละโรค
                    for (const diseaseName of dis.selectedDiseases) {
                        await db.query(
                            `
                            INSERT INTO vaccine_rules_condition (condition_name, vaccine_id, dose_count, frequency_desc, status) 
                            VALUES (?, ?, ?, ?, ?)`,
                            [
                                diseaseName,       // บันทึกทีละ 1 ชื่อโรค
                                id,
                                dis.dose || 1,
                                dis.frequency || "",
                                "Recommended",
                            ]
                        );
                    }
                }
            }
        }

        await db.commit(); // ยืนยันการบันทึก
        return NextResponse.json({ message: "Updated successfully" });
    } catch (error) {
        if (db) await db.rollback(); // ถ้าพังตรงไหน ให้ย้อนกลับหมด
        console.error("Update Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        if (db) db.release();
    }
}

// 3. DELETE: ลบข้อมูล (เหมือนเดิม)
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