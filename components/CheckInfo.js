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

    if (!data) return <div className="text-center p-5">ไม่พบข้อมูล กรุณากลับไปกรอกข้อมูล</div>;

    // ฟังก์ชันช่วยดึงรายการโรค (Helper function)
    // ดึงเฉพาะ Value ที่ไม่เป็นค่าว่าง ("") ออกมาเป็น Array
    const selectedDiseases = Object.values(data.disease).filter((val) => val !== "");

    return (
        <div className={styles.cardWrapper}>
            <Card>
                <Card.Header>
                    ข้อมูลพื้นฐาน
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={6}>อายุ : {data.basic.age} ปี</Col>
                        <Col md={6}>เพศ : {data.basic.gender}</Col>
                        <Col md={6}>สถานะการตั้งครรภ์ : {data.basic.pregnant}</Col>
                        <Col md={6}>บุคลากรทางการแพทย์ : {data.basic.medical ? "เป็น" : "ไม่เป็น"}</Col>
                    </Row>
                </Card.Body>
            </Card>
            <Card>
                <Card.Header>
                    การเดินทาง
                </Card.Header>
                <Card.Body>
                    <Col md={6}>ความประสงค์จะเดินทาง</Col>
                    <Col md={6}>วัคซีนที่ต้องการฉีด : {data.travel.travel_status === "travel" ? (
                        <span>{data.travel.travel_selected}</span>
                    ) : (
                        <span style={{margin:"0 10px"}}> - </span>
                    )}
                    </Col>
                </Card.Body>
            </Card>
            <Card>
                <Card.Header>
                    โรคประจำตัว
                </Card.Header>
                <Card.Body>
                    <Col md={6}>{selectedDiseases.length > 0 ? (
                        <ul className="mb-0">
                            {selectedDiseases.map((disease, index) => (
                                <li key={index}>{disease}</li>
                            ))}
                        </ul>
                    ) : (
                        <span>ไม่มีโรคประจำตัว</span>
                    )}</Col>
                </Card.Body>
            </Card>
            <Card>
                <Card.Header>
                    การรับวัคซีน
                </Card.Header>
                <Card.Body></Card.Body>
            </Card>
            <Card>
                <Card.Header>
                    ประวัติการแพ้อาหาร ยา และวัคซีน
                </Card.Header>
                <Card.Body></Card.Body>
            </Card>
        </div>
    )
}

export default CheckInfomation;