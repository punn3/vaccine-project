"use client";

import { Container, Nav, Navbar } from "react-bootstrap";
import Link from "next/link";
import styles from "../styles/Navbar.module.css";

function NavbarBox() {
    return (
        <div className={styles.NavComponents}>
            <Navbar.Brand>
                <h1>ระบบให้คำแนะนำวัคซีนที่ปลอดภัย</h1>
            </Navbar.Brand>
            <Nav className={styles.navitem}>
                <Nav.Link as={Link} href="/#stepper">กรอกข้อมูล</Nav.Link>
                <Nav.Link as={Link} href="/VaccinesPage">รายการวัคซีน</Nav.Link>
                <Nav.Link as={Link} href="/AdminPage">แอดมิน</Nav.Link>
            </Nav>
        </div>
    );
}

export default NavbarBox;
