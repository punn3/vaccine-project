/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import styles from "../styles/Stepper.module.css";
import { Container } from "react-bootstrap";
import BasicInfo from "./BasicInfo";
import CheckInfomation from "./CheckInfo";
import AnalysisResult from "./Analyze";
import VaccineDetails from "./VaccineDetails";

const MyStepperForm = () => {
    const [currentStep, setCurrentStep] = useState(0);

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
            content: <CheckInfomation />,
        },
        {
            icon: "💉",
            label: "ผลวิเคราะห์วัคซีน",
            description: "ผลการวิเคราะห์วัคซีน",
            content: <AnalysisResult />,
        },
        {
            icon: "ℹ️",
            label: "รายละเอียดวัคซีน", 
            description: "รายละเอียดวัคซีนที่เลือก",
            content: <VaccineDetails />,
        },
    ];

    const validateBasicInfo = () => {
        const savedData = localStorage.getItem("vaccineFormData");
        if (!savedData) return false;

        const formData = JSON.parse(savedData);
        const { basic, disease, vaccines, allergy } = formData;

        if (!basic.age || !basic.gender || !basic.pregnant) return false;
        if (basic.pregnant === "ตั้งครรภ์" && !basic.gestational_weeks) return false;

        const hasDisease = Object.values(disease).some(val => val !== "");
        if (!hasDisease) return false;

        if (vaccines.want_type === "yes") {
            const hasEmptyVaccine = vaccines.selected.some(v => v === "");
            if (hasEmptyVaccine) return false;
        }

        const hasAllergyType = allergy.none || allergy.food || allergy.drugAndVaccine;
        if (!hasAllergyType) return false;
        if (allergy.food && allergy.foodList.length === 0) return false;
        if (allergy.drugAndVaccine && allergy.drugAndVaccineList.length === 0) return false;

        return true; 
    };

    const handleNext = () => {
        if (currentStep === 0) {
            const isValid = validateBasicInfo();
            if (!isValid) {
                alert("กรุณากรอกข้อมูลในฟอร์มที่มีเครื่องหมาย * ให้ครบถ้วนก่อนดำเนินการต่อ");
                return; 
            }
        }

        if (currentStep === steps.length - 1) {
            console.log("Submitting form...");
            setCurrentStep(0);
        } else {
            setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
        }
    };

    const handleStepClick = (index) => {
        if (currentStep === 0 && index > 0) {
            const isValid = validateBasicInfo();
            if (!isValid) {
                alert("กรุณากรอกข้อมูลให้ครบถ้วนก่อนข้ามไปยังขั้นตอนถัดไป");
                return;
            }
        }
        if (index <= currentStep || validateBasicInfo()) {
            setCurrentStep(index);
        }
    };

    return (
        <Container>
            {/* นำคลาส d-none d-md-block ออก เพื่อให้แสดงในทุกขนาดหน้าจอ */}
            <div className={styles.stepper_card}>
                <div className={styles.stepper_wrapper}>
                    <div className={styles.progress_line}>
                        <div
                            className={styles.progress_fill}
                            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                        />
                    </div>
                    {steps.map((step, index) => (
                        <div key={index} className={styles.step_item}>
                            <div
                                className={`${styles.step_circle} ${index <= currentStep ? styles.active : styles.inactive}`}
                                onClick={() => handleStepClick(index)}
                            >
                                {step.icon}
                            </div>
                            <div
                                className={`${styles.step_label} ${index <= currentStep ? styles.active : styles.inactive}`}
                            >
                                {step.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* เนื้อหา (Content Area) */}
            <div>
                <div className={styles.content_description} style={{ marginTop: '20px' }}>
                    {/* เอาส่วนของ Label สำหรับมือถือออก เพราะเรามี Stepper ปกติแล้ว */}
                    {steps[currentStep].description}
                </div>

                <div style={{ marginTop: '30px' }}>{steps[currentStep].content}</div>
            </div>

            {/* ปุ่ม Navigation */}
            <div className={styles.nav_buttons}>
                <button
                    className={`btn ${styles.btn_outline}`}
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    style={{ visibility: currentStep === 0 ? "hidden" : "visible" }}
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
                    {currentStep === steps.length - 1 ? "เสร็จสิ้น" : "ถัดไป"}
                </button>
            </div>
        </Container>
    );
};

export default MyStepperForm;