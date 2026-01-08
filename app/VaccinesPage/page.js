"use client";

import { Container } from "react-bootstrap";
import NavbarBox from "../../components/Navbar"; // ถอยกลับไป import Navbar มาด้วยถ้าอยากให้มีเมนู
import Vaccines from "@/components/Vaccine";

export default function VaccinesPage() {
    return (
        <>
            <NavbarBox></NavbarBox>
            <Container className="mt-5">
                {/* <h1>หน้ารายการวัคซีน</h1> */}
                <Vaccines /> {/* Component Vaccines ของคุณ */}
            </Container>
        </>
    );
}