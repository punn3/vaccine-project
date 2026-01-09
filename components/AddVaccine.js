import { useState, useRef } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { CloudArrowUp } from "react-bootstrap-icons";

function AddVaccine({ onBack }) {
    const [selectedFile, setSelectedFile] = useState(null); // เก็บไฟล์ที่เลือก
    const fileInputRef = useRef(null); // อ้างอิงถึง input file ที่ซ่อนอยู่

    // เมื่อมีการเลือกไฟล์
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    // ฟังก์ชันเพื่อให้กดที่กล่อง div แล้วไปเรียก input file ให้ทำงาน
    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    // ฟังก์ชันลบรูป (เผื่อเลือกผิด)
    const handleRemoveFile = (e) => {
        e.stopPropagation(); // กันไม่ให้ไปเรียก event click ของกล่องใหญ่
        setSelectedFile(null);
        fileInputRef.current.value = ""; // รีเซ็ต input
    };
    const headerStyle = {
        backgroundColor: "#CBDCEB",
        fontWeight: "bold",
        borderBottom: "none",
    };

    return (
        <Container className="mt-5 pb-5" style={{ maxWidth: "900px" }}>
            <h3 className="text-center mb-4 fw-bold">เพิ่มวัคซีนใหม่</h3>

            {/* Section 1: ข้อมูลวัคซีน */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="py-3" style={headerStyle}>
                    ข้อมูลวัคซีน
                </Card.Header>
                <Card.Body className="p-4">
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Label>ชื่อวัคซีน</Form.Label>
                            <Form.Control type="text" />
                        </Col>
                        <Col md={6}>
                            <Form.Label>ชื่อการค้า</Form.Label>
                            <Form.Control type="text" />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Label>ชนิดวัคซีน</Form.Label>
                            <Form.Control type="text" />
                        </Col>
                        <Col md={6}>
                            <Form.Label>วัคซีนป้องกัน</Form.Label>
                            <Form.Control type="text" />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Label>ราคา (บาท/เข็ม)</Form.Label>
                            <Form.Control type="text" />
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Section 2: การบริหารวัคซีน */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="py-3" style={headerStyle}>
                    การบริหารวัคซีน
                </Card.Header>
                <Card.Body className="p-4">
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Label>ขนาด (ml)</Form.Label>
                            <Form.Control type="text" />
                        </Col>
                        <Col md={6}>
                            <Form.Label>จำนวนโดส (โดส)</Form.Label>
                            <Form.Control type="text" />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Label>ตำแหน่งที่ฉีด</Form.Label>
                            <Form.Control type="text" />
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Section 3: ผลข้างเคียง */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="py-3" style={headerStyle}>
                    ผลข้างเคียง ข้อห้ามใช้ ข้อควรระวัง
                </Card.Header>
                <Card.Body className="p-4">
                    <Form.Control as="textarea" rows={5} />
                </Card.Body>
            </Card>

            {/* Section 4: เพิ่มรูปภาพ */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="py-3" style={headerStyle}>
                    เพิ่มรูปภาพ
                </Card.Header>
                <Card.Body className="p-4">
                    {/* Input type file ซ่อนเอาไว้ (display: none) */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        accept="image/jpeg, image/png" // รับเฉพาะรูปภาพ
                    />

                    <div
                        className="d-flex flex-column justify-content-center align-items-center rounded"
                        onClick={handleUploadClick} // กดที่กล่องเพื่อเลือกรูป
                        style={{
                            border: "2px dashed #dee2e6",
                            height: "200px",
                            cursor: "pointer",
                            backgroundColor: selectedFile ? "#f8f9fa" : "#fff", // เปลี่ยนสีพื้นหลังเมื่อมีไฟล์
                            position: "relative"
                        }}
                    >
                        {selectedFile ? (
                            // แสดงเมื่อเลือกไฟล์แล้ว
                            <div className="text-center">
                                <CloudArrowUp size={40} className="text-success mb-2" />
                                <h5 className="text-dark fw-bold">{selectedFile.name}</h5>
                                <div className="text-muted small">
                                    {(selectedFile.size / 1024).toFixed(2)} KB
                                </div>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    className="mt-3"
                                    onClick={handleRemoveFile}
                                >
                                    ลบรูปภาพ
                                </Button>
                            </div>
                        ) : (
                            // แสดงเมื่อยังไม่ได้เลือกไฟล์ (หน้าตาเดิม)
                            <>
                                <CloudArrowUp size={40} className="text-primary mb-2" />
                                <div className="text-muted fw-bold">
                                    Drag & drop files or <span className="text-primary">Browse</span>
                                </div>
                                <div className="text-muted small mt-1">
                                    Supported formates: JPEG, PNG
                                </div>
                            </>
                        )}
                    </div>
                </Card.Body>
            </Card>

            {/* ปุ่มเสร็จสิ้น */}
            <div className="d-flex justify-content-end">
                <Button
                    variant="primary"
                    className="px-5 py-2"
                    style={{ backgroundColor: "#4a7fc1", border: "none" }}
                    onClick={onBack} // ฟังก์ชันกลับไปหน้าหลัก
                >
                    เสร็จสิ้น
                </Button>
            </div>
        </Container>
    );
}

export default AddVaccine;
