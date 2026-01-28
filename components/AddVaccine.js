import { useState, useRef } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { CloudArrowUp } from "react-bootstrap-icons";
import AgeLimitCondition from "./AgeConditionCard";
import DiseaseCondition from "./DiseaseConditionCard";

function AddVaccine({ onBack }) {
    const [selectedFile, setSelectedFile] = useState(null); // เก็บไฟล์ที่เลือก
    const fileInputRef = useRef(null); // อ้างอิงถึง input file ที่ซ่อนอยู่
    const [ageConditions, setAgeConditions] = useState([
        { minAge: "", maxAge: "", dose: "", frequency: "" }
    ]);
    const [diseaseConditions, setDiseaseConditions] = useState([
        { selectedDisease: "", kidneyStage: "", dose: "", frequency: "", recommendation: "" }
    ]);
    const [allergies, setAllergies] = useState({
        egg: false,
        milk: false,
        gelatin: false,
        yeast: false,
        drugOption1: false,
        drugOption2: false,
        drugOption3: false,
        drugOption4: false,
    });

    // *****อายุ****
    // ฟังก์ชันเพิ่มเงื่อนไขใหม่
    const addCondition = () => {
        setAgeConditions([...ageConditions, { minAge: "", maxAge: "", dose: "", frequency: "" }]);
    };

    // ฟังก์ชันลบเงื่อนไข
    const removeCondition = (index) => {
        const newConditions = ageConditions.filter((_, i) => i !== index);
        setAgeConditions(newConditions);
    };

    // ฟังก์ชันอัปเดตข้อมูลในแต่ละช่อง
    const handleConditionChange = (index, field, value) => {
        const newConditions = [...ageConditions];
        newConditions[index][field] = value;
        setAgeConditions(newConditions);
    };

    // *****โรคประจำตัว****
    // 2. ฟังก์ชันเพิ่มเงื่อนไขโรคใหม่
    const addDiseaseCondition = () => {
        setDiseaseConditions([
            ...diseaseConditions,
            { selectedDisease: "", kidneyStage: "", dose: "", frequency: "", recommendation: "" }
        ]);
    };

    // 3. ฟังก์ชันลบเงื่อนไขโรค (ใช้ filter เหมือนเดิม)
    const removeDiseaseCondition = (index) => {
        const newConditions = diseaseConditions.filter((_, i) => i !== index);
        setDiseaseConditions(newConditions);
    };

    // 4. ฟังก์ชันอัปเดตข้อมูลในแต่ละช่องของการ์ดโรค
    const handleDiseaseChange = (index, field, value) => {
        const newConditions = [...diseaseConditions];
        newConditions[index][field] = value;

        // Logic เพิ่มเติม: ถ้าเปลี่ยนโรคจาก 'โรคไต' เป็นอย่างอื่น ให้ล้างค่าระยะโรคไตทิ้ง
        if (field === 'selectedDisease' && value !== 'Chronic kidney disease') {
            newConditions[index]['kidneyStage'] = "";
        }

        setDiseaseConditions(newConditions);
    };

    // การแพ้ ฟังก์ชันจัดการการคลิก
    const handleAllergyChange = (field) => {
        setAllergies({
            ...allergies,
            [field]: !allergies[field] // สลับค่า true/false
        });
    };

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
                            <Form>
                                <label className="mb-2">ชนิดวัคซีน</label>
                                <Form.Select>
                                    <option>เลือกตำแหน่งที่ฉีด</option>
                                    <option value="Inactivated">Inactivated</option>
                                    <option value="Live">Live attenuated</option>
                                </Form.Select>
                            </Form>
                        </Col>
                        <Col md={6}>
                            <Form.Label>วัคซีนป้องกัน</Form.Label>
                            <Form.Control type="text" />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Label>ราคา (บาท/เข็ม)</Form.Label>
                            <Form.Control type="text" />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={12}>
                            <p className="">การบริหารวัคซีน</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Label>ขนาด (ml)</Form.Label>
                            <Form.Control type="text" />
                        </Col>
                        <Col md={6}>
                            <Form>
                                <label className="mb-2">ตำแหน่งที่ฉีด</label>
                                <Form.Select>
                                    <option>เลือกตำแหน่งที่ฉีด</option>
                                    <option value="Instramuscular">ฉีดเข้ากล้ามเนื้อ (Instramuscular)</option>
                                    <option value="Subcutaneous">ฉีดเข้าชั้นใต้ผิวหนัง (Subcutaneous)</option>
                                </Form.Select>
                            </Form>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Section 2: การจำกัดอายุ */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="py-3" style={headerStyle}>
                    การจำกัดอายุ
                </Card.Header>
                <Card.Body className="p-4">
                    {ageConditions.map((item, index) => (
                        <AgeLimitCondition
                            key={index}
                            index={index}
                            data={item}
                            onChange={handleConditionChange}
                            onRemove={removeCondition}
                        />
                    ))}
                    <Button
                        variant="primary"
                        onClick={addCondition}
                        style={{ backgroundColor: "#4a7fc1", border: "none" }}
                    >
                        + เพิ่มเงื่อนไขอายุ
                    </Button>
                </Card.Body>
            </Card>

            {/* Section 3: การจำกัดโรคประจำตัว */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="py-3" style={headerStyle}>
                    การจำกัดโรคประจำตัว
                </Card.Header>
                <Card.Body className="p-4">
                    {diseaseConditions.map((item, index) => (
                        <DiseaseCondition
                            key={`disease-${index}`} // ใช้ key ที่ไม่ซ้ำกับเงื่อนไขอายุ
                            index={index}
                            data={item}
                            onChange={handleDiseaseChange}
                            onRemove={removeDiseaseCondition}
                        />
                    ))}

                    {/* ปุ่มสำหรับกดเพิ่มเงื่อนไขใหม่ */}
                    <Button
                        variant="primary"
                        onClick={addDiseaseCondition}
                        className="mt-2"
                        style={{ backgroundColor: "#4a7fc1", border: "none" }}
                    >
                        + เพิ่มเงื่อนไขโรคประจำตัว
                    </Button>
                </Card.Body>
            </Card>

            {/* Section 4: การแพ้อาหาร ยา และวัคซีน */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="py-3" style={headerStyle}>การแพ้อาหาร ยา และวัคซีน</Card.Header>
                <Card.Body className="p-4">
                    <p className="fw-bold">การแพ้อาหาร</p>
                    <Row className="mb-4">
                        {/* ตัวอย่างการวางช่องติ๊กแบบ 4 คอลัมน์ */}
                        <Col md={3} className="mb-2">
                            <div className="border rounded p-2 d-flex align-items-center">
                                <Form.Check
                                    type="checkbox"
                                    label="ไข่ไก่"
                                    checked={allergies.egg}
                                    onChange={() => handleAllergyChange('egg')}
                                />
                            </div>
                        </Col>
                        <Col md={3} className="mb-2">
                            <div className="border rounded p-2 d-flex align-items-center">
                                <Form.Check
                                    type="checkbox"
                                    label="นมวัว"
                                    checked={allergies.milk}
                                    onChange={() => handleAllergyChange('milk')}
                                />
                            </div>
                        </Col>
                        <Col md={3} className="mb-2">
                            <div className="border rounded p-2 d-flex align-items-center">
                                <Form.Check
                                    type="checkbox"
                                    label="เจลาติน"
                                    checked={allergies.gelatin}
                                    onChange={() => handleAllergyChange('gelatin')}
                                />
                            </div>
                        </Col>
                        <Col md={3} className="mb-2">
                            <div className="border rounded p-2 d-flex align-items-center">
                                <Form.Check
                                    type="checkbox"
                                    label="ยีสต์"
                                    checked={allergies.yeast}
                                    onChange={() => handleAllergyChange('yeast')}
                                />
                            </div>
                        </Col>
                    </Row>

                    <p className="fw-bold">การแพ้ยาและวัคซีน</p>
                    <Row>
                        <Col md={3} className="mb-2">
                            <div className="border rounded p-2 d-flex align-items-center">
                                <Form.Check
                                    type="checkbox"
                                    label="ตัวเลือก 1"
                                    checked={allergies.drugOption1}
                                    onChange={() => handleAllergyChange('drugOption1')}
                                />
                            </div>
                        </Col>
                        <Col md={3} className="mb-2">
                            <div className="border rounded p-2 d-flex align-items-center">
                                <Form.Check
                                    type="checkbox"
                                    label="ตัวเลือก 2"
                                    checked={allergies.drugOption2}
                                    onChange={() => handleAllergyChange('drugOption2')}
                                />
                            </div>
                        </Col>
                        <Col md={3} className="mb-2">
                            <div className="border rounded p-2 d-flex align-items-center">
                                <Form.Check
                                    type="checkbox"
                                    label="ตัวเลือก 3"
                                    checked={allergies.drugOption3}
                                    onChange={() => handleAllergyChange('drugOption3')}
                                />
                            </div>
                        </Col>
                        <Col md={3} className="mb-2">
                            <div className="border rounded p-2 d-flex align-items-center">
                                <Form.Check
                                    type="checkbox"
                                    label="ตัวเลือก 4"
                                    checked={allergies.drugOption4}
                                    onChange={() => handleAllergyChange('drugOption4')}
                                />
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Section 5: ผลข้างเคียง ข้อห้ามใช้ ข้อควรระวัง */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="py-3" style={headerStyle}>
                    ผลข้างเคียง ข้อห้ามใช้ ข้อควรระวัง
                </Card.Header>
                <Card.Body className="p-4">
                    <Form.Control as="textarea" rows={5} />
                </Card.Body>
            </Card>

            {/* Section 6: เพิ่มรูปภาพ */}
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
