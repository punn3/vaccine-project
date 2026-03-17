"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                // ล็อกอินสำเร็จ ให้พาไปหน้าแอดมิน
                router.push('/admin'); 
                router.refresh(); // รีเฟรชเพื่อให้ Middleware อัปเดตสถานะ
            } else {
                setError(data.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
            }
        } catch (err) {
            setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <Card className="shadow-sm p-4 rounded-4" style={{ width: '100%', maxWidth: '400px' }}>
                <Card.Body>
                    <h3 className="text-center mb-4 fw-bold">เข้าสู่ระบบแอดมิน</h3>
                    
                    {error && <Alert variant="danger" className="small py-2">{error}</Alert>}

                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">อีเมล</Form.Label>
                            <Form.Control 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold">รหัสผ่าน</Form.Label>
                            <Form.Control 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="w-100 rounded-pill fw-bold"
                            disabled={isLoading}
                        >
                            {isLoading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}