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

        // 2. บันทึกเงื่อนไขอายุ (แก้ status ให้ดึงตามที่ผู้ใช้เลือกแล้ว)
        if (body.age_conditions && body.age_conditions.length > 0) {
            for (const age of body.age_conditions) {
                // เซฟโซน: ป้องกันค่าว่าง
                const min = age.minAge && age.minAge !== "" ? age.minAge : 0;
                const max = age.maxAge && age.maxAge !== "" ? age.maxAge : 999;

                await db.query(
                    `
                    INSERT INTO vaccine_rules_age (vaccine_id, min_age, max_age, dose_count, frequency_desc, status)
                    VALUES (?, ?, ?, ?, ?, ?)
                `,
                    [
                        body.id,
                        min,
                        max,
                        age.dose || 1,
                        age.frequency || "",
                        age.status || "", 
                    ],
                );
            }
        }

        // 3. บันทึกเงื่อนไขโรค (อัปเกรดให้อ่าน Array ได้เหมือนตอนทำ Edit แล้ว)
        if (body.disease_conditions && body.disease_conditions.length > 0) {
            for (const dis of body.disease_conditions) {
                // เช็กว่ามี Array ของโรคส่งมาไหม
                if (dis.selectedDiseases && dis.selectedDiseases.length > 0) {
                    for (const diseaseName of dis.selectedDiseases) {
                        await db.query(
                            `
                            INSERT INTO vaccine_rules_condition (condition_name, vaccine_id, dose_count, frequency_desc, status)
                            VALUES (?, ?, ?, ?, ?)
                        `,
                            [
                                diseaseName, 
                                body.id,
                                dis.dose || 1,
                                dis.frequency || "",
                                dis.status || "Recommended",
                            ],
                        );
                    }
                }
            }
        }

        // 4.บันทึกข้อห้ามฉีดวัคซีน (เพิ่มตารางใหม่เข้าไปแล้ว)
        if (body.contraindicated_conditions && body.contraindicated_conditions.length > 0) {
            for (const contra of body.contraindicated_conditions) {
                if (contra.contraindicated_vaccine && contra.contraindicated_vaccine.trim() !== "") {
                    await db.query(
                        `
                        INSERT INTO vaccine_rules_contraindication (vaccine_id, contraindicated_vaccine, interval_desc, detail) 
                        VALUES (?, ?, ?, ?)
                        `,
                        [
                            body.id, 
                            contra.contraindicated_vaccine, 
                            contra.interval_desc || "", 
                            contra.detail || ""
                        ]
                    );
                }
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