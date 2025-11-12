// 'use client'; // <-- สำคัญมาก! ต้องใส่เมื่อใช้ Component ที่มี Interactive
import Example from '../components/BasicInfo.js';
import NavbarBox from '@/components/Navbar.js';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';

export default function Home() {
  return (
    <Container>
      <NavbarBox></NavbarBox>
      <Example></Example>  
      {/* <Row className="justify-content-md-center">
        <Col className='mt-5'>      
        </Col>
      </Row> */}
    </Container>
  );
}