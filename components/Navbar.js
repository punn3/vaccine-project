"use client";

import { Container, Nav, Navbar } from "react-bootstrap";
import styles from "./Navbar.module.css";

function NavbarBox() {
    return (
        <div className={styles.NavComponents}>
            <Navbar.Brand>
                <h1>Navvv</h1>
            </Navbar.Brand>
            <Nav className={styles.navitem}>
                <a href="#home">Home</a>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
            </Nav>
        </div>
    );
}

export default NavbarBox;
