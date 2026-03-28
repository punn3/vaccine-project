import { NextResponse } from "next/server";
import pool from "@/lib/db";

// Helper: ฟังก์ชันช่วยแปลง JSON 
const parseJSON = (str) => {
    try { return str ? JSON.parse(str) : {}; }
    catch (e) { return {}; }
};

export async function POST(request) {
    let db;
    try {
        const user = await request.json();
        console.log(user)
        db = await pool.getConnection();

        // 1. ดึงข้อมูลจากฐานข้อมูล
        const [vaccines] = await db.query("SELECT * FROM vaccines WHERE is_available = 1");
        const [ageRules] = await db.query("SELECT * FROM vaccine_rules_age");
        const [diseaseRules] = await db.query("SELECT * FROM vaccine_rules_condition");

        // กรองเฉพาะวัคซีนที่สนใจ (ถ้ามี)
        const vaccinesToAnalyze = user.wanted_vaccines?.length > 0
            ? vaccines.filter(vac => user.wanted_vaccines.includes(vac.name_en))
            : vaccines;

        // 2. เตรียมเงื่อนไขคนไข้ (ใช้ Set เพื่อกันค่าซ้ำ)
        const userConditions = new Set(user.diseases || []);
        if (user.is_pregnant) {
            userConditions.add("ตั้งครรภ์");
        }
        if (user.is_med_personnel) userConditions.add("บุคลากรทางการแพทย์");

        const allowedVaccines = [];
        const notAllowedVaccines = [];

        // 3. เริ่มวิเคราะห์ทีละวัคซีน
        for (const vac of vaccinesToAnalyze) {
            let isAllowed = false;
            let isBlocked = false;
            let reasons = [];
            let matchStatus = "";
            let requiredDoses = 1;

            // --- A. ดึงกฎอายุพื้นฐานมาเตรียมไว้ ---
            const ageRule = ageRules.find(r => 
                r.vaccine_id === vac.id && 
                user.age >= r.min_age && 
                (r.max_age === null || user.age <= r.max_age)
            );

            if (ageRule) {
                vac.rule_dose = ageRule.dose_count;
                vac.rule_freq = ageRule.frequency_desc;
            }

            // --- B. เช็คข้อห้ามเด็ดขาด (ประวัติแพ้ & คนท้องฉีดเชื้อเป็น) ---
            const vacAllergies = parseJSON(vac.allergies);
            // ตรวจว่ามีการแพ้ตรงกับส่วนประกอบวัคซีนหรือไม่ (เจอ 1 ตัวคือบล็อกเลย)
            const hasAllergy = Object.entries(user.allergies || {})
                .some(([key, isAllergic]) => isAllergic && vacAllergies[key]);

            if (hasAllergy) {
                isBlocked = true;
                reasons.push("ผู้ป่วยมีประวัติแพ้ส่วนประกอบของวัคซีนตัวนี้");
            }

            const isLiveVaccine = vac.vaccine_type?.toLowerCase().includes("live attenuated");
            if (user.is_pregnant && isLiveVaccine) {
                isBlocked = true;
                reasons.push("ห้ามฉีดวัคซีนชนิดเชื้อเป็น (Live Attenuated) ในหญิงตั้งครรภ์");
            }

            // --- C. เช็คโรคประจำตัว / การตั้งครรภ์ ---
            const vacDiseaseRules = diseaseRules.filter(r => r.vaccine_id === vac.id);
            
            // เตรียมตัวแปรเพื่อหาจำนวนโดสที่ "มากที่สุด" กรณีมีหลายโรค
            let maxDose = vac.rule_dose || 0;
            let bestFreq = vac.rule_freq || "";
            
            for (const condition of userConditions) {
                const matchedRule = vacDiseaseRules.find(r => r.condition_name === condition);
                
                if (matchedRule) {
                    if (matchedRule.status === "Cautious" || matchedRule.status === "Contraindication") {
                        isBlocked = true;
                        reasons.push(`ห้ามฉีดเนื่องจาก: ${condition}`);
                        break; // หยุดเช็คโรคอื่นทันที
                    } 
                    
                    isAllowed = true;
                    matchStatus = matchedRule.status;

                    // ป้องกัน Override: เลือกโดสที่มากที่สุด
                    const diseaseDose = parseInt(matchedRule.dose_count || 0, 10);
                    if (diseaseDose > maxDose) {
                        maxDose = diseaseDose;
                        bestFreq = matchedRule.frequency_desc || bestFreq;
                    }

                    // จัดการคนท้อง
                    if (condition === "ตั้งครรภ์" && user.gestational_weeks) {
                        const weekMatch = matchedRule.frequency_desc?.match(/(\d+)\s*-\s*(\d+)/);
                        if (weekMatch) {
                            const [_, minWeek, maxWeek] = weekMatch.map(Number);
                            if (user.gestational_weeks < minWeek || user.gestational_weeks > maxWeek) {
                                isBlocked = true;
                                reasons.push(`อายุครรภ์ ${user.gestational_weeks} สัปดาห์ ไม่อยู่ในช่วงที่แนะนำ (${minWeek}-${maxWeek} สัปดาห์)`);
                                break; 
                            } else {
                                reasons.push("อายุครรภ์เหมาะสม");
                            }
                        } else {
                            reasons.push("อายุครรภ์เหมาะสม");
                        }
                    } else {
                        if (!reasons.includes(`มีโรคประจำตัว: ${condition}`)) {
                            reasons.push(`มีโรคประจำตัว: ${condition}`);
                        }
                    }
                }
            }

            // จบลูปโรคแล้ว ค่อยเอาโดสสูงสุดกลับไปใส่ให้วัคซีน
            if (isAllowed && !isBlocked) {
                vac.rule_dose = maxDose;
                vac.rule_freq = bestFreq;
                requiredDoses = maxDose || requiredDoses;
            }

            // --- D. เช็คช่วงอายุ (ถ้ายังไม่ถูกตัดสินด้วยโรค) ---
            if (!isBlocked && !isAllowed && ageRule) {
                isAllowed = true;
                matchStatus = matchStatus || ageRule.status;
                requiredDoses = ageRule.dose_count || requiredDoses;
                reasons.push("อยู่ในช่วงอายุที่แนะนำให้ฉีด");
            }

            // สรุปเบื้องต้น: ไม่เข้าเกณฑ์กลุ่มใดๆ เลย
            if (!isAllowed && !isBlocked) {
                isBlocked = true;
                reasons.push("ไม่อยู่ในช่วงอายุที่แนะนำ และไม่เข้าเกณฑ์กลุ่มเสี่ยง");
            }

            // บังคับ "No specific" ให้ไปตกฝั่งสีแดง
            if (matchStatus?.toLowerCase() === "no specific") {
                isBlocked = true;
                isAllowed = false;
                reasons = ["ไม่อยู่ในเกณฑ์ที่จำเป็นต้องได้รับ (No specific)"];
            }

            // --- E. เช็คประวัติการฉีดวัคซีนเดิม ---
            if (isAllowed && !isBlocked && user.history?.length > 0) {
                // กรองเฉพาะประวัติวัคซีนนี้ และเรียงจากล่าสุดไปเก่า
                const pastDoses = user.history
                    .filter(h => h.vaccine_name_en === vac.name_en)
                    .sort((a, b) => new Date(b.date_received) - new Date(a.date_received));

                if (pastDoses.length > 0) {
                    const monthsSinceLastDose = (new Date() - new Date(pastDoses[0].date_received)) / (1000 * 60 * 60 * 24 * 30.44);

                    // คำนวณรอบกระตุ้น
                    let boosterMonthsRequired = 0;
                    if (vac.rule_freq) {
                        if (/ปีละ|ประจำปี/.test(vac.rule_freq)) {
                            boosterMonthsRequired = 12; 
                        } else {
                            const yearMatch = vac.rule_freq.match(/ทุก\s*(\d+)\s*ปี/);
                            if (yearMatch) boosterMonthsRequired = parseInt(yearMatch[1]) * 12;
                        }
                    }

                    // เช็คเงื่อนไขโดส
                    if (pastDoses.length >= requiredDoses) {
                        if (boosterMonthsRequired > 0) {
                            if (monthsSinceLastDose < boosterMonthsRequired - 2) {
                                isBlocked = true;
                                reasons.push(`เพิ่งรับวัคซีนนี้ไปเมื่อ ${Math.round(monthsSinceLastDose)} เดือนที่แล้ว (รอบกระตุ้นถัดไปคือทุก ${boosterMonthsRequired / 12} ปี)`);
                            } else {
                                reasons.push("ถึงรอบฉีดกระตุ้นตามกำหนดเวลาแล้ว");
                            }
                        } else {
                            isBlocked = true;
                            reasons.push(`ท่านได้รับวัคซีนนี้ครบ ${requiredDoses} โดสตามเกณฑ์แล้ว ไม่จำเป็นต้องรับซ้ำ`);
                        }
                    } else {
                        // กรณีฉีดไม่ครบ
                        if (monthsSinceLastDose < 1) {
                            isBlocked = true;
                            reasons.push(`เพิ่งรับเข็มล่าสุดไปเมื่อ ${Math.round(monthsSinceLastDose * 30)} วันที่แล้ว (ควรรออย่างน้อย 1 เดือน)`);
                        } else {
                            reasons.push(`ท่านฉีดไปแล้ว ${pastDoses.length}/${requiredDoses} โดส ถึงกำหนดรับเข็มถัดไปแล้ว`);
                        }
                    }
                }
            }

            // --- F. จัดกลุ่มผลลัพธ์ลง Array ---
            const finalResult = { 
                ...vac, 
                matchStatus, 
                reason: reasons.join(" | ") 
            };

            if (isBlocked) {
                notAllowedVaccines.push(finalResult);
            } else if (isAllowed) {
                allowedVaccines.push(finalResult);
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