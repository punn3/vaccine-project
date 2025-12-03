"use client";
import { Card } from "react-bootstrap";
import styles from "../styles/CheckInfo.module.css";

function CheckInfomation(){
    return(
        <div className={styles.cardWrapper}>
            <Card>
                <Card.Header>
                    ข้อมูลพื้นฐาน
                </Card.Header>
                <Card.Body></Card.Body>
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