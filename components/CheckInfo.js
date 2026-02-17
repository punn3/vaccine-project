"use client";
import { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import styles from "../styles/CheckInfo.module.css";

function CheckInfomation() {
    const [data, setData] = useState(null);

    useEffect(() => {
        // ดึงข้อมูลจาก LocalStorage
        const savedData = localStorage.getItem("vaccineFormData");
        if (savedData) {
            setData(JSON.parse(savedData));
        }
    }, []);

    if (!data)
        return (
            <div className="text-center p-5">ไม่พบข้อมูล กรุณากลับไปกรอกข้อมูล</div>
        );

    // ฟังก์ชันช่วยดึงรายการโรค (Helper function)
    // ดึงเฉพาะ Value ที่ไม่เป็นค่าว่าง ("") ออกมาเป็น Array
    const selectedDiseases = Object.values(data.disease).filter(
        (val) => val !== ""
    );

    return (
        <div className={styles.cardWrapper}>
            <Card>
                <Card.Header>ข้อมูลพื้นฐาน</Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={6}>อายุ : {data.basic.age} ปี</Col>
                        <Col md={6}>เพศ : {data.basic.gender}</Col>
                        <Col md={6}>สถานะการตั้งครรภ์ : {data.basic.pregnant}</Col>
                        <Col md={6}>
                            บุคลากรทางการแพทย์ : {data.basic.medical ? "เป็น" : "ไม่เป็น"}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <Card>
                <Card.Header>โรคประจำตัว</Card.Header>
                <Card.Body>
                    {selectedDiseases.length > 0 ? (
                        <ul className="mb-0 row">
                            {selectedDiseases
                                .filter((d) => d !== data?.disease?.disease_selected)
                                .map((disease, index, array) => (
                                    <li key={index} className="col-md-6">
                                        {disease}
                                        {index === array.length - 1
                                            ? ` ${data?.disease?.disease_selected || ""}`
                                            : ""}
                                    </li>
                                ))}
                        </ul>
                    ) : (
                        <span>ไม่มีโรคประจำตัว</span>
                    )}
                </Card.Body>
            </Card>
            <Card>
                <Card.Header>การรับวัคซีน</Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <h6>วัคซีนที่ต้องการฉีด:</h6>
                            {data.vaccines.want_type === "no" ? (
                                <p className="text-muted italic">ต้องการคำแนะนำจากแพทย์</p>
                            ) : (
                                <ul>
                                    {data.vaccines.selected.map((v, i) => v && <li key={i}>{v}</li>)}
                                </ul>
                            )}
                        </Col>
                        <Col md={6}>
                            <h6>วัคซีนที่เคยได้รับ:</h6>
                            {data.vaccines.received.some(v => v.vaccine) ? (
                                <ul>
                                    {data.vaccines.received.map((item, i) => (
                                        item.vaccine && <li key={i}>{item.vaccine} (เมื่อวันที่: {item.date || 'ไม่ได้ระบุ'})</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted">ไม่มีประวัติ</p>
                            )}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <Card>
                <Card.Header>ประวัติการแพ้อาหาร ยา และวัคซีน</Card.Header>
                <Card.Body>
                    {data.allergy.none ? (
                        <p>ไม่มีประวัติการแพ้</p>
                    ) : (<Row>
                        <Col md={6}>
                            {data.allergy.food && (
                                <div className="mb-2">
                                    <p>แพ้อาหาร:</p> {data.allergy.foodList.length > 0 ? data.allergy.foodList.join(", ") : "ระบุว่าแพ้แต่ไม่ได้เลือกรายการ"}
                                </div>
                            )}</Col>
                            <Col md={6}>
                            {data.allergy.drugAndVaccine && (
                                <div>
                                    <p>แพ้ยา/วัคซีน:</p> {data.allergy.drugAndVaccineList.length > 0 ? data.allergy.drugAndVaccineList.join(", ") : "ระบุว่าแพ้แต่ไม่ได้เลือกรายการ"}
                                </div>
                            )}
                            {!data.allergy.food && !data.allergy.drugAndVaccine && <p>ไม่ได้ระบุข้อมูลการแพ้</p>}</Col>
                        </Row>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}

export default CheckInfomation;
