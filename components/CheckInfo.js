"use client";
import { useState, useEffect } from "react";
import { Card,Row,Col } from "react-bootstrap";
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

    return (
        <div className={styles.cardWrapper}>
            <Card>
                <Card.Header>
                    ข้อมูลพื้นฐาน
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        <Col xs={6}><strong>อายุ:</strong> {data.basic.age} ปี</Col>
                        <Col xs={6}><strong>เพศ:</strong> {data.basic.gender}</Col>
                        <Col xs={6}><strong>สถานะการตั้งครรภ์:</strong> {data.basic.pregnant}</Col>
                        <Col xs={6}><strong>บุคลากรทางการแพทย์:</strong> {data.basic.medical}</Col>
                    </Row>
                </Card.Body>
            </Card>
            <Card>
                <Card.Header>
                    การเดินทาง
                </Card.Header>
                <Card.Body></Card.Body>
            </Card>
            <Card>
                <Card.Header>
                    ข้อมูลพื้นฐาน
                </Card.Header>
                <Card.Body></Card.Body>
            </Card>
            <Card>
                <Card.Header>
                    โรคประจำตัว
                </Card.Header>
                <Card.Body></Card.Body>
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