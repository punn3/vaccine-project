"use client";
import React, { useState } from "react";
import styles from './Stepper.module.css';
import { Container } from "react-bootstrap";
import BasicInfo from "./BasicInfo";

const MyStepperForm = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            icon: "📄",
            label: "กรอกข้อมูล",
            description: "กรอกข้อมูลพื้นฐาน",
        },
        {
            icon: "📋",
            label: "ตรวจสอบข้อมูล",
            description: "ตรวจสอบความถูกต้อง",
        },
        {
            icon: "💉",
            label: "ผลวิเคราะห์วัคซีน",
            description: "รับผลการตรวจ",
        },
        {
            icon: "ℹ️",
            label: "รายละเอียดวัคซีนที่เลือก",
            description: "ข้อมูลวัคซีน",
        },
    ];

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
                    {/* Steps */}
                    {steps.map((step, index) => (
                        <div key={index} className={styles.step_item}>
                            {/* Circle Icon */}
                            <div
                                className={`${styles.step_circle} ${index <= currentStep ? "active" : "inactive"
                                    }`}
                                onClick={() => setCurrentStep(index)}
                            >
                                {step.icon}
                            </div>

                            {/* Label */}
                            <div
                                className={`${styles.step_label} ${index <= currentStep ? "active" : "inactive"
                                    }`}
                            >
                                {step.label}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
                {/* Content Area */}
                {/* <div className={styles.content_card}>
                </div> */}
                <div>
                    <div className={styles.content_title}>{steps[currentStep].label}</div>
                    <div className={styles.content_description}>
                        {steps[currentStep].description}
                    </div>
                    <BasicInfo></BasicInfo>
                </div>
                {/* Navigation Buttons */}
                <div className={styles.nav_buttons}>
                    <button
                        className={`btn ${styles.btn_outline}`}
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                    >
                        ← ย้อนกลับ
                    </button>
                    <div className={styles.step_counter}>
                        ขั้นตอนที่ {currentStep + 1} จาก {steps.length}
                    </div>

                    <button
                        className={`btn ${styles.btn_primary}`}
                        onClick={() =>
                            setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
                        }
                        disabled={currentStep === steps.length - 1}
                    >
                        {currentStep === steps.length - 1 ? "เริ่มใหม่" : "ถัดไป →"}
                    </button>
                </div>
        </Container>
    );
};

export default MyStepperForm;
