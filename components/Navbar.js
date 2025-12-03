"use client";

import { Container, Nav, Navbar } from "react-bootstrap";
import Link from "next/link";
import styles from "../styles/Navbar.module.css";

function NavbarBox() {
    return (
        <div className={styles.NavComponents}>
            <Navbar.Brand>
                <h1>Navvv</h1>
            </Navbar.Brand>
            <Nav className={styles.navitem}>
                <Nav.Link as={Link} href="/#stepper">กรอกข้อมูล</Nav.Link>
                <Nav.Link as={Link} href="/vaccines">รายการวัคซีน</Nav.Link>
                <Nav.Link as={Link} href="/admin">แอดมิน</Nav.Link>
            </Nav>
        </div>
    );
}

export default NavbarBox;
