"use client";

import { Container, Nav, Navbar } from "react-bootstrap";
import Link from "next/link";
import styles from "../styles/Navbar.module.css";

function NavbarBox() {
    return (
        <Navbar expand="md" className={styles.NavComponents}>
            <Container>
                <Navbar.Brand as={Link} href="/" className="me-auto d-flex align-items-center" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h1 className="fs-5 mb-0 fw-bold " style={{ maxWidth: '200px' }}>
                        ระบบให้คำแนะนำวัคซีนที่ปลอดภัย
                    </h1>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className={`ms-auto mt-3 mt-md-0 ${styles.navitem}`}>
                        <Nav.Link as={Link} href="/#stepper">กรอกข้อมูล</Nav.Link>
                        <Nav.Link as={Link} href="/VaccinesPage">รายการวัคซีน</Nav.Link>
                        {/* <Nav.Link as={Link} href="/AdminPage">แอดมิน</Nav.Link> */}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarBox;