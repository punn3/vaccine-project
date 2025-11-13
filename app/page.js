// 'use client'; // <-- สำคัญมาก! ต้องใส่เมื่อใช้ Component ที่มี Interactive
import BasicInfo from '../components/BasicInfo.js';
import NavbarBox from '@/components/Navbar.js';
// import MyStepperForm from '@/components/Stepper.js';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';

export default function Home() {
  return (
    <>
    <NavbarBox></NavbarBox>
    <Container>
      <BasicInfo></BasicInfo>
    </Container>
    </>
  );
}