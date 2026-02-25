"use client";
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Container } from "react-bootstrap";
import { ExclamationTriangleFill } from "react-bootstrap-icons";

const SyringeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2 text-primary">
        <path d="M10.5 14.5L14.5 10.5M16 8L17.5 6.5C18.3284 5.67157 18.3284 4.32843 17.5 3.5C16.6716 2.67157 15.3284 2.67157 14.5 3.5L13 5M8.5 15.5L4 20M5 5L19 19M6.5 17.5L13 11L11 9L4.5 15.5C3.67157 16.3284 3.67157 17.6716 4.5 18.5C5.32843 19.3284 6.67157 19.3284 7.5 18.5L6.5 17.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const VaccineDetails = () => {
    const [selectedVaccines, setSelectedVaccines] = useState([]);

    useEffect(() => {
        const savedData = localStorage.getItem("selectedVaccinesForDetails");

        if (savedData) {
            setSelectedVaccines(JSON.parse(savedData));
        }
    }, []);

    // ถ้ายังไม่ได้เลือกวัคซีนเลย ให้แสดงข้อความนี้
    if (selectedVaccines.length === 0) {
        return (
            <Container className="text-center mt-5 py-5">
                <div className="text-muted fw-bold fs-5">ยังไม่ได้เลือกวัคซีน</div>
                <p className="text-muted mt-2">
                    กรุณาย้อนกลับไปเลือกวัคซีนที่ต้องการในหน้าผลวิเคราะห์
                </p>
            </Container>
        );
    }

    return (
        <Container>

            {selectedVaccines.map((vaccine, index) => (
                <Card
                    key={index}
                    className="mb-4 border-0 shadow-sm"
                    style={{ borderRadius: "16px", backgroundColor: "#fafafa" }}
                >
                    <Card.Body className="p-4">
                        {/* ส่วนบน: รูปภาพ ชื่อ ราคา */}
                        <Row className="mb-4 align-items-center">
                            <Col xs="auto">
                                <div
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        backgroundColor: "#e0e0e0",
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                    }}
                                >
                                    {/* รองรับกรณีที่ API ส่ง image_url มา */}
                                    {vaccine.image_url ? (
                                        <img
                                            src={vaccine.image_url}
                                            alt="vaccine"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    ) : (
                                        <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted small">
                                            No Image
                                        </div>
                                    )}
                                </div>
                            </Col>
                            <Col>
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h5 className="fw-bold mb-2">
                                            {vaccine.name_th} ({vaccine.name_en})
                                        </h5>
                                        <div className="text-muted small mb-2">
                                            {vaccine.trade_name || "-"}
                                        </div>
                                        <div className="d-flex gap-4 small mt-3">
                                            <div>{vaccine.indication || "ไม่ระบุข้อบ่งใช้"}</div>
                                            <div>ชนิดวัคซีน : {vaccine.vaccine_type || "-"}</div>
                                        </div>
                                    </div>
                                    <div className="text-success fw-bold fs-5 text-end">
                                        ฿{" "}
                                        {vaccine.price
                                            ? Number(vaccine.price).toLocaleString()
                                            : "0"}{" "}
                                        <br />
                                        <span
                                            className="text-muted small fw-normal"
                                            style={{ fontSize: "0.8rem" }}
                                        >
                                            /เข็ม
                                        </span>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        {/* ส่วนกลาง: การบริหารวัคซีน */}
                        <div className="bg-white border rounded p-3 mb-3">
                            <div className="d-flex align-items-center mb-3">
                                <SyringeIcon />
                                <span className="fw-bold" style={{ fontSize: "0.95rem" }}>
                                    การบริหารวัคซีน
                                </span>
                            </div>
                            <Row className="small">
                                <Col md={4}>
                                    <div
                                        className="text-muted mb-1"
                                        style={{ fontSize: "0.8rem" }}
                                    >
                                        ขนาด
                                    </div>
                                    <div>{vaccine.dosage_ml || "-"}</div>
                                </Col>
                                <Col md={4}>
                                    <div
                                        className="text-muted mb-1"
                                        style={{ fontSize: "0.8rem" }}
                                    >
                                        จำนวนโดส
                                    </div>
                                    {/* รองรับข้อมูลจาก rule_dose และ rule_freq ที่ส่งมาจาก API วิเคราะห์ */}
                                    <div>
                                        {vaccine.rule_dose ? `${vaccine.rule_dose} โดส` : "1 โดส"}
                                        {vaccine.rule_freq ? ` (${vaccine.rule_freq})` : ""}
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div
                                        className="text-muted mb-1"
                                        style={{ fontSize: "0.8rem" }}
                                    >
                                        ตำแหน่งที่ฉีด
                                    </div>
                                    <div>{vaccine.admin_route || "-"}</div>
                                </Col>
                            </Row>
                        </div>

                        {/* ส่วนล่าง: คำเตือน */}
                        <div className="bg-white border rounded p-3 d-flex align-items-start gap-2">
                            <ExclamationTriangleFill
                                className="text-warning mt-1"
                                size={18}
                            />
                            <div>
                                <span className="text-danger small fw-bold">
                                    ผลข้างเคียง ข้อห้ามใช้ และข้อควรระวัง :{" "}
                                </span>
                                <span className="small text-muted">
                                    {vaccine.side_effects || vaccine.precautions || "ไม่มีข้อมูลผลข้างเคียง"}
                                </span>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
};

export default VaccineDetails;
