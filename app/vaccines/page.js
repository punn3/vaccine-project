"use client";

import { Container } from "react-bootstrap";
import NavbarBox from "../../components/Navbar"; // ถอยกลับไป import Navbar มาด้วยถ้าอยากให้มีเมนู
import Test from "@/components/Test";

export default function VaccinesPage() {
    return (
        <>
            <NavbarBox></NavbarBox>
            <Container className="mt-5">
                <h1>หน้ารายการวัคซีน</h1>
                <Test /> {/* Component Vaccines ของคุณ */}
            </Container>
        </>
    );
}