/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import styles from "../styles/Stepper.module.css";
import { Container, Alert } from "react-bootstrap";
import BasicInfo from "./BasicInfo";
import CheckInfomation from "./CheckInfo";
import AnalysisResult from "./Analyze";

const MyStepperForm = () => {
    const [currentStep, setCurrentStep] = useState(0);

    // 1. ผูก Component เข้ากับ steps ตรงนี้
    const steps = [
        {
            icon: "📄",
            label: "กรอกข้อมูล",
            description: "",
            content: <BasicInfo />, 
        },
        {
            icon: "📋",
            label: "ตรวจสอบข้อมูล",
            description: "กรุณาตรวจสอบความถูกต้องของข้อมูลก่อนการดำเนินต่อ",
            content: <CheckInfomation></CheckInfomation>,
        },
        {
            icon: "💉",
            label: "ผลวิเคราะห์วัคซีน",
            description: "ผลการวิเคราะห์วัคซีน",
            content: <AnalysisResult></AnalysisResult>,
        },
        {
            icon: "ℹ️",
            label: "รายละเอียดวัคซีนที่เลือก",
            description: "รายละเอียดวัคซีนที่เลือก",
            content: <div>หน้าดีเทลวัคซีน (ใส่ Component ที่นี่)</div>,
        },
    ];

    // ✅ ฟังก์ชันตรวจความเรียบร้อยของข้อมูล (Validation) สำหรับ Step 0 (BasicInfo)
    const validateBasicInfo = () => {
        const savedData = localStorage.getItem("vaccineFormData");
        if (!savedData) return false;

        const formData = JSON.parse(savedData);
        const { basic, disease, vaccines, allergy } = formData;

        // เช็คข้อมูลพื้นฐาน
        if (!basic.age || !basic.gender || !basic.pregnant) return false;
        if (basic.pregnant === "ตั้งครรภ์" && !basic.gestational_weeks) return false;

        // เช็คโรคประจำตัว (ต้องเลือกอย่างน้อย 1 อย่าง หรือ ไม่มี)
        const hasDisease = Object.values(disease).some(val => val !== "");
        if (!hasDisease) return false;

        // เช็คการรับวัคซีน (ถ้าเลือก 'มี' ต้องระบุชื่อ)
        if (vaccines.want_type === "yes") {
            const hasEmptyVaccine = vaccines.selected.some(v => v === "");
            if (hasEmptyVaccine) return false;
        }

        // เช็คประวัติการแพ้
        const hasAllergyType = allergy.none || allergy.food || allergy.drugAndVaccine;
        if (!hasAllergyType) return false;
        if (allergy.food && allergy.foodList.length === 0) return false;
        if (allergy.drugAndVaccine && allergy.drugAndVaccineList.length === 0) return false;

        return true; // ผ่านทุกด่าน!
    };

    const handleNext = () => {
        // ⛔️ ถ้ากำลังอยู่หน้าแรก ให้ตรวจข้อมูลก่อนปล่อยผ่าน
        if (currentStep === 0) {
            const isValid = validateBasicInfo();
            if (!isValid) {
                alert("กรุณากรอกข้อมูลในฟอร์มที่มีเครื่องหมาย * ให้ครบถ้วนก่อนดำเนินการต่อ");
                return; // หยุดทำงาน ไม่ให้เปลี่ยนหน้า
            }
        }

        if (currentStep === steps.length - 1) {
            console.log("Submitting form...");
            // localStorage.removeItem("vaccineFormData");
        } else {
            setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
        }
    };

    // ⛔️ ป้องกันการกดกระโดดข้ามหน้าผ่านปุ่มวงกลมด้านบน (Stepper Navigation)
    const handleStepClick = (index) => {
        if (currentStep === 0 && index > 0) {
            const isValid = validateBasicInfo();
            if (!isValid) {
                alert("กรุณากรอกข้อมูลให้ครบถ้วนก่อนข้ามไปยังขั้นตอนถัดไป");
                return;
            }
        }
        // อนุญาตให้คลิกย้อนกลับไปหน้าเก่าได้เสมอ
        if (index <= currentStep || validateBasicInfo()) {
            setCurrentStep(index);
        }
    };

    return (
        <Container>
            <div className={styles.stepper_card}>
                <div className={styles.stepper_wrapper}>
                    {/* Progress Line */}
                    <div className={styles.progress_line}>
                        <div
                            className={styles.progress_fill}
                            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                        />
                    </div>
                    {/* Steps Navigation */}
                    {steps.map((step, index) => (
                        <div key={index} className={styles.step_item}>
                            <div
                                className={`${styles.step_circle} ${index <= currentStep ? styles.active : styles.inactive
                                    }`}
                                onClick={() => handleStepClick(index)} // เปลี่ยนมาใช้ฟังก์ชันที่ดักจับ Validation
                                style={{ cursor: "pointer" }}
                            >
                                {step.icon}
                            </div>
                            <div
                                className={`${styles.step_label} ${index <= currentStep ? styles.active : styles.inactive
                                    }`}
                            >
                                {step.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div>
                <div style={{ marginTop: '80px' }} className={styles.content_description}>
                    {steps[currentStep].description}
                </div>

                {/* 2. เรียกใช้ content จาก array ตาม step ปัจจุบัน */}
                <div style={{ marginTop: '50px' }}>{steps[currentStep].content}</div>
            </div>

            {/* Navigation Buttons */}
            <div className={styles.nav_buttons}>
                <button
                    className={`btn ${styles.btn_outline}`}
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                >
                    ย้อนกลับ
                </button>
                <div className={styles.step_counter}>
                    ขั้นตอนที่ {currentStep + 1} จาก {steps.length}
                </div>

                <button
                    className={`btn ${styles.btn_primary}`}
                    onClick={handleNext}>

                    {currentStep === steps.length - 1 ? "เสร็จสิ้น" : "ถัดไป "}
                </button>
            </div>
        </Container>
    );
};

export default MyStepperForm;