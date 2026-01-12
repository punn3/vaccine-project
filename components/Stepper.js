"use client";
import React, { useState } from "react";
import styles from "../styles/Stepper.module.css";
import { Container } from "react-bootstrap";
import BasicInfo from "./BasicInfo";
import CheckInfomation from "./CheckInfo";

const MyStepperForm = () => {
    const [currentStep, setCurrentStep] = useState(0);
    // const [formData, setFormData] = useState({});  //ถ้าต้องการส่งข้อมูล (เช่น state ของฟอร์ม) ข้ามไปมาระหว่าง BasicInfo กับหน้าอื่นๆ

    // 1. ผูก Component เข้ากับ steps ตรงนี้
    const steps = [
        {
            icon: "📄",
            label: "กรอกข้อมูล",
            description: "",
            content: <BasicInfo />, // <--- ใส่ Component ตรงนี้
            // content: <BasicInfo data={formData} setData={setFormData} />  //ต้องการส่งข้อมูล (เช่น state ของฟอร์ม) ข้ามไปมาระหว่าง BasicInfo กับหน้าอื่นๆ
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
            content: <div>หน้าผลลัพธ์ (ใส่ Component ที่นี่)</div>,
        },
        {
            icon: "ℹ️",
            label: "รายละเอียดวัคซีนที่เลือก",
            description: "รายละเอียดวัคซีนที่เลือก",
            content: <div>หน้าดีเทลวัคซีน (ใส่ Component ที่นี่)</div>,
        },
    ];

    const handleNext = () => {
        if (currentStep === steps.length - 1) {
            // ขั้นตอนสุดท้าย (เสร็จสิ้น)
            console.log("Submitting form...");
            // localStorage.removeItem("vaccineFormData"); // เลือกเอาว่าจะลบเลยไหม
            // logic การ redirect หรือส่ง api
        } else {
            // ไปหน้าถัดไป
            setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
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
                                onClick={() => setCurrentStep(index)}
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
                {/* <div className={styles.content_title}>{steps[currentStep].label}</div> */}
                <div style={{marginTop: '80px'}} className={styles.content_description}>
                    {steps[currentStep].description}
                </div>

                {/* 2. เรียกใช้ content จาก array ตาม step ปัจจุบัน */}
                <div style={{marginTop: '50px'}}>{steps[currentStep].content}</div>
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
