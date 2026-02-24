import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request) {
    let db;
    try {
        // รับข้อมูลจากหน้าเว็บ
        const user = await request.json();

        db = await pool.getConnection();

        // 1. ดึงข้อมูลจากฐานข้อมูล
        const [vaccines] = await db.query(
            "SELECT * FROM vaccines WHERE is_available = 1",
        );
        const [ageRules] = await db.query("SELECT * FROM vaccine_rules_age");
        const [diseaseRules] = await db.query(
            "SELECT * FROM vaccine_rules_condition",
        );

        // 🔥 🆕 ส่วนที่เพิ่มเข้ามา: กรองวัคซีนตามที่ผู้ใช้ต้องการ
        let vaccinesToAnalyze = vaccines; // ค่าเริ่มต้น: วิเคราะห์วัคซีนทั้งหมดที่มี

        // เช็คว่าผู้ใช้มีการส่งรายชื่อวัคซีนที่ต้องการมาด้วยไหม และต้องไม่เป็น Array ว่าง
        if (user.wanted_vaccines && user.wanted_vaccines.length > 0) {
            // กรองเอาเฉพาะวัคซีนที่มีชื่อภาษาอังกฤษ (name_en) ตรงกับที่ผู้ใช้เลือกมา
            vaccinesToAnalyze = vaccines.filter(vac => 
                user.wanted_vaccines.includes(vac.name_en)
            );
        }

        let allowedVaccines = [];
        let notAllowedVaccines = [];

        // 2. เตรียมเงื่อนไขคนไข้
        let userConditions = user.diseases ? [...user.diseases] : [];
        if (user.is_pregnant) {
            userConditions.push("ตั้งครรภ์");
            userConditions.push("ตั้ั้งครรภ์"); // กันเหนียวพิมพ์ผิดใน DB
        }
        if (user.is_med_personnel) {
            userConditions.push("บุคลากรทางการแพทย์");
        }

        // 3. เริ่มวิเคราะห์ทีละวัคซีน
        // 🔥 🆕 สำคัญ: เปลี่ยนจาก for (const vac of vaccines) เป็นตัวแปร vaccinesToAnalyze ที่กรองแล้ว
        for (const vac of vaccinesToAnalyze) {
            let isAllowed = false;
            let isBlocked = false;
            let reasons = [];
            let matchStatus = "";
            let requiredDoses = 1;

            // 🧠 ดึงกฎพื้นฐานของ "อายุ" มาเตรียมไว้ก่อนเลย (เพื่อเอาจำนวนโดสพื้นฐาน)
            const ageRule = ageRules.find(
                (r) =>
                    r.vaccine_id === vac.id &&
                    user.age >= r.min_age &&
                    (r.max_age === null || user.age <= r.max_age),
            );
            if (ageRule) {
                vac.rule_dose = ageRule.dose_count;
                vac.rule_freq = ageRule.frequency_desc;
            }

            // --- A. เช็คประวัติการแพ้ (ห้ามฉีดเด็ดขาด) ---
            let vacAllergies = {};
            try {
                vacAllergies = vac.allergies ? JSON.parse(vac.allergies) : {};
            } catch (e) { }
            if (user.allergies) {
                for (const [allergyKey, isAllergic] of Object.entries(user.allergies)) {
                    if (isAllergic && vacAllergies[allergyKey]) {
                        isBlocked = true;
                        reasons.push("❌ ผู้ป่วยมีประวัติแพ้ส่วนประกอบของวัคซีนตัวนี้");
                    }
                }
            }

            // --- B. เช็คโรคประจำตัว / การตั้งครรภ์ ---
            const vacDiseaseRules = diseaseRules.filter(
                (r) => r.vaccine_id === vac.id,
            );
            if (userConditions.length > 0) {
                for (const condition of userConditions) {
                    const matchedRule = vacDiseaseRules.find(
                        (r) => r.condition_name === condition,
                    );
                    if (matchedRule) {
                        if (matchedRule.status === "Cautious") {
                            isBlocked = true;
                            reasons.push(`⚠️ ข้อห้ามใช้/ควรระวัง สำหรับภาวะ: ${condition}`);
                        } else {
                            isAllowed = true;
                            matchStatus = matchedRule.status;

                            // ดึงโดสจากเงื่อนไขโรคมาใส่ด้วย (ถ้าโรคมีโดสเฉพาะ ให้ทับโดสอายุ)
                            if (matchedRule.dose_count)
                                vac.rule_dose = matchedRule.dose_count;
                            if (matchedRule.frequency_desc)
                                vac.rule_freq = matchedRule.frequency_desc;
                            requiredDoses = vac.rule_dose || requiredDoses;

                            // 🧠 เช็คเงื่อนไขคนท้องแบบ Dynamic (อ่านค่าจาก Database ไม่ฟิกซ์ ID)
                            if (condition === "ตั้งครรภ์" && user.gestational_weeks) {
                                // ใช้ Regex ดึงตัวเลข "เริ่มต้น" และ "สิ้นสุด" ออกมาจากช่อง frequency_desc
                                const weekMatch = matchedRule.frequency_desc
                                    ? matchedRule.frequency_desc.match(/(\d+)\s*-\s*(\d+)/)
                                    : null;

                                if (weekMatch) {
                                    const minWeek = parseInt(weekMatch[1]);
                                    const maxWeek = parseInt(weekMatch[2]);

                                    if (
                                        user.gestational_weeks < minWeek ||
                                        user.gestational_weeks > maxWeek
                                    ) {
                                        isBlocked = true;
                                        reasons.push(
                                            `⏳ อายุครรภ์ ${user.gestational_weeks} สัปดาห์ ยังไม่อยู่ในช่วงที่แนะนำ (ช่วงเวลาที่เหมาะสมคือ ${minWeek}-${maxWeek} สัปดาห์)`,
                                        );
                                    } else {
                                        reasons.push(` อายุครรภ์เหมาะสมสำหรับการรับวัคซีนนี้`);
                                    }
                                } else {
                                    // ถ้าวัคซีนไม่ได้ระบุช่วงสัปดาห์ (แปลว่าคนท้องฉีดตอนไหนก็ได้)
                                    reasons.push(
                                        ` อายุครรภ์เหมาะสม (สามารถรับวัคซีนได้ในทุกช่วงของการตั้งครรภ์)`,
                                    );
                                }
                            } else {
                                // สำหรับโรคประจำตัวอื่นๆ
                                reasons.push(` เข้าเกณฑ์แนะนำสำหรับภาวะ: ${condition}`);
                            }
                        }
                    }
                }
            }

            // --- C. เช็คช่วงอายุ ---
            if (!isBlocked && !isAllowed && ageRule) {
                isAllowed = true;
                if (!matchStatus) matchStatus = ageRule.status;
                requiredDoses = ageRule.dose_count || requiredDoses;
                reasons.push(`อยู่ในช่วงอายุที่แนะนำให้ฉีด`);
            }

            // ถ้าเช็คอายุและโรคแล้วไม่เข้าเกณฑ์เลย
            if (!isAllowed && !isBlocked) {
                isBlocked = true;
                reasons.push("ไม่อยู่ในช่วงอายุที่แนะนำ และไม่เข้าเกณฑ์กลุ่มเสี่ยง");
            }

            // --- D. 🧠 เช็คประวัติการฉีดแบบ Dynamic (ไม่ฟิกซ์ ID วัคซีนรายปี) ---
            if (isAllowed && !isBlocked && user.history && user.history.length > 0) {
                const pastDoses = user.history.filter(
                    (h) => h.vaccine_name_en === vac.name_en,
                );

                if (pastDoses.length > 0) {
                    pastDoses.sort(
                        (a, b) => new Date(b.date_received) - new Date(a.date_received),
                    );
                    const lastDoseDate = new Date(pastDoses[0].date_received);
                    const today = new Date();
                    const monthsSinceLastDose =
                        (today - lastDoseDate) / (1000 * 60 * 60 * 24 * 30.44);

                    // 🎯 ถอดรหัสเวลาการฉีดกระตุ้นจากข้อความในฐานข้อมูล (เช่น "ปีละ 1 เข็ม", "ทุก 10 ปี")
                    let boosterMonthsRequired = 0;
                    if (vac.rule_freq) {
                        if (
                            vac.rule_freq.includes("ปีละ") ||
                            vac.rule_freq.includes("ประจำปี")
                        ) {
                            boosterMonthsRequired = 12; // กระตุ้นทุก 1 ปี (12 เดือน)
                        } else {
                            // หาข้อความแบบ "ทุก X ปี" เช่น "กระตุ้นทุก 10 ปี"
                            const yearMatch = vac.rule_freq.match(/ทุก\s*(\d+)\s*ปี/);
                            if (yearMatch) {
                                boosterMonthsRequired = parseInt(yearMatch[1]) * 12; // เอาตัวเลขคูณ 12 เดือน
                            }
                        }
                    }

                    if (pastDoses.length >= requiredDoses) {
                        // เช็คว่าเป็นวัคซีนที่ต้องฉีดกระตุ้นไหม (boosterMonthsRequired > 0)
                        if (boosterMonthsRequired > 0) {
                            // ลดหย่อนให้ 2 เดือน เผื่อคนไข้มาฉีดก่อนกำหนดนิดหน่อย
                            if (monthsSinceLastDose < boosterMonthsRequired - 2) {
                                isBlocked = true;
                                reasons.push(
                                    `⏳ เพิ่งรับวัคซีนนี้ไปเมื่อ ${Math.round(monthsSinceLastDose)} เดือนที่แล้ว (รอบกระตุ้นถัดไปคือทุก ${boosterMonthsRequired / 12} ปี)`,
                                );
                            } else {
                                reasons.push(`🔄 ถึงรอบฉีดกระตุ้นตามกำหนดเวลาแล้ว`);
                            }
                        } else {
                            // ถ้าไม่ใช่วัคซีนฉีดกระตุ้น (ฉีดครบแล้วจบกัน)
                            isBlocked = true;
                            reasons.push(
                                `✔️ ท่านได้รับวัคซีนนี้ครบ ${requiredDoses} โดสตามเกณฑ์แล้ว ไม่จำเป็นต้องรับซ้ำ`,
                            );
                        }
                    } else {
                        // กรณียังฉีดไม่ครบโดส
                        if (monthsSinceLastDose < 1) {
                            isBlocked = true;
                            reasons.push(
                                `⏳ เพิ่งรับเข็มล่าสุดไปเมื่อ ${Math.round(monthsSinceLastDose * 30)} วันที่แล้ว (ควรรออย่างน้อย 1 เดือน)`,
                            );
                        } else {
                            reasons.push(
                                `💉 ท่านฉีดไปแล้ว ${pastDoses.length}/${requiredDoses} โดส ถึงกำหนดรับเข็มถัดไปแล้ว`,
                            );
                        }
                    }
                }
            }

            // --- จัดกลุ่มผลลัพธ์ ---
            if (isBlocked) {
                notAllowedVaccines.push({ ...vac, reason: reasons.join(" | ") });
            } else if (isAllowed) {
                allowedVaccines.push({
                    ...vac,
                    matchStatus,
                    reason: reasons.join(" | "),
                });
            }
        }

        return NextResponse.json({
            allowed: allowedVaccines,
            notAllowed: notAllowedVaccines,
        });
    } catch (error) {
        console.error("Analyze Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        if (db) db.release();
    }
}