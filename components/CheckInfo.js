"use client";
import { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import styles from "../styles/CheckInfo.module.css";

function CheckInfomation() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem("vaccineFormData");
        if (savedData) {
            setData(JSON.parse(savedData));
        }
    }, []);

    if (!data)
        return (
            <div className="text-center p-5">ไม่พบข้อมูล กรุณากลับไปกรอกข้อมูล</div>
        );

    // ประกอบร่างชื่อโรคให้ตรงกับ Database และรวมระยะโรคไตให้เป็น String เดียวกัน
    const selectedDiseases = [];
    const d = data.disease;

    if (d.heart_disease) selectedDiseases.push(d.heart_disease);
    if (d.chronic_liver) selectedDiseases.push(d.chronic_liver);
    if (d.asplenia) selectedDiseases.push(d.asplenia);
    if (d.cd4) selectedDiseases.push(d.cd4);
    if (d.immunocon) selectedDiseases.push(d.immunocon);
    if (d.post_tramised) selectedDiseases.push(d.post_tramised);
    
    // จัดการโรคไตและระยะ
    if (d.chronic_kidney) {
        selectedDiseases.push(`Chronic kidney disease ระยะที่ ${d.kidney_stage}`);
    }

    if (d.disease_selected_none) selectedDiseases.push(d.disease_selected_none);
    if (d.disease_selected) selectedDiseases.push(d.disease_selected);

    return (
        <div className={styles.cardWrapper}>
            <Card className={styles.cardStyle}>
                <Card.Header className={styles.headerStyle}>ข้อมูลพื้นฐาน</Card.Header>
                <Card.Body className={styles.bodyStyle}>
                    <Row className="gy-3">
                        <Col md={6}>
                            <span className="text-muted d-block mb-1">อายุ</span>
                            <span className="fw-semibold text-dark">{data.basic.age} ปี</span>
                        </Col>
                        <Col md={6}>
                            <span className="text-muted d-block mb-1">เพศสภาพ</span>
                            <span className="fw-semibold text-dark">{data.basic.gender}</span>
                        </Col>
                        <Col md={6}>
                            <span className="text-muted d-block mb-1">สถานะการตั้งครรภ์</span>
                            <span className="fw-semibold text-dark">{data.basic.pregnant}</span>
                        </Col>
                        <Col md={6}>
                            <span className="text-muted d-block mb-1">บุคลากรทางการแพทย์</span>
                            <span className="fw-semibold text-dark">{data.basic.medical ? "เป็น" : "ไม่เป็น"}</span>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className={styles.cardStyle}>
                <Card.Header className={styles.headerStyle}>โรคประจำตัว</Card.Header>
                <Card.Body className={styles.bodyStyle}>
                    {selectedDiseases.length > 0 ? (
                        <ul className="mb-0 row">
                            {selectedDiseases.map((disease, index) => (
                                <li key={index} className="col-md-6 fw-semibold text-dark">
                                    {disease}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <span className="fw-semibold text-dark">ไม่มีโรคประจำตัว</span>
                    )}
                </Card.Body>
            </Card>

            <Card className={styles.cardStyle}>
                <Card.Header className={styles.headerStyle}>การรับวัคซีน</Card.Header>
                <Card.Body className={styles.bodyStyle}>
                    <Row>
                        <Col md={6}>
                            <h6 className="text-muted d-block mb-1">วัคซีนที่ต้องการฉีด:</h6>
                            {data.vaccines.want_type === "no" ? (
                                <p className="fw-semibold text-dark">ต้องการคำแนะนำจากแพทย์</p>
                            ) : (
                                <ul className="fw-semibold text-dark">
                                    {data.vaccines.selected.map((v, i) => v && <li key={i}>{v}</li>)}
                                </ul>
                            )}
                        </Col>
                        <Col md={6}>
                            <h6 className="text-muted d-block mb-1">วัคซีนที่เคยได้รับ:</h6>
                            {data.vaccines.received.some(v => v.vaccine) ? (
                                <ul>
                                    {data.vaccines.received.map((item, i) => (
                                        item.vaccine && <li key={i} className="fw-semibold text-dark">{item.vaccine} (เมื่อวันที่: {item.date || 'ไม่ได้ระบุ'})</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="fw-semibold text-dark">ไม่มีประวัติ</p>
                            )}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className={styles.cardStyle}>
                <Card.Header className={styles.headerStyle}>ประวัติการแพ้อาหาร ยา และวัคซีน</Card.Header>
                <Card.Body className={styles.bodyStyle}>
                    {data.allergy.none ? (
                        <p className="fw-semibold text-muted mb-0">ไม่มีประวัติการแพ้</p>
                    ) : (
                        <Row className="gy-3">
                            <Col md={6}>
                                {data.allergy.food && (
                                    <div>
                                        <span className="text-muted d-block mb-2">แพ้อาหาร:</span>
                                        {data.allergy.foodList.length > 0 ? (
                                            <ul>
                                                {data.allergy.foodList.map((item, index) => (
                                                    <li key={index} className="fw-semibold text-dark">{item}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="fw-semibold text-danger">ระบุว่าแพ้แต่ไม่ได้เลือกรายการ</span>
                                        )}
                                    </div>
                                )}
                            </Col>
                            <Col md={6}>
                                {data.allergy.drugAndVaccine && (
                                    <div>
                                        <span className="text-muted d-block mb-2">แพ้ยา/วัคซีน:</span>
                                        {data.allergy.drugAndVaccineList.length > 0 ? (
                                            <ul>
                                                {data.allergy.drugAndVaccineList.map((item, index) => (
                                                    <li key={index} className="fw-semibold text-dark">{item}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="fw-semibold text-danger">ระบุว่าแพ้แต่ไม่ได้เลือกรายการ</span>
                                        )}
                                    </div>
                                )}
                            </Col>
                            {!data.allergy.food && !data.allergy.drugAndVaccine && (
                                <Col>
                                    <p className="fw-semibold text-muted mb-0">ไม่ได้ระบุข้อมูลการแพ้</p>
                                </Col>
                            )}
                        </Row>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}

export default CheckInfomation;