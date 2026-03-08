"use client";

import { Container } from "react-bootstrap";
import NavbarBox from "../../components/Navbar"; // ถอยกลับไป import Navbar มาด้วยถ้าอยากให้มีเมนู
import Admin from "@/components/Admin";


export default function AdminPage() {
    return (
        <>
            <NavbarBox></NavbarBox>
            <Container className="mt-5">
                <Admin/> Component Vaccines ของคุณ
            </Container>
        </>
    );
}