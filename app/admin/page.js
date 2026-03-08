"use client";
import { Container } from "react-bootstrap";
import NavbarBox from "../../components/Navbar"; 
import Admin from "@/components/Admin";


export default function AdminPage() {
    return (
        <>
            <NavbarBox></NavbarBox>
            <Container className="mt-5">
                <Admin/>
            </Container>
        </>
    );
}