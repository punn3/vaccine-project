import { useState, useRef } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { CloudArrowUp } from "react-bootstrap-icons";
import AgeLimitCondition from "./AgeConditionCard";
import DiseaseCondition from "./DiseaseConditionCard";

function AddVaccine({ onBack }) {
    // 1. State สำหรับเก็บค่าที่พิมพ์ (จำเป็นต้องมี)
    const [formData, setFormData] = useState({
        name_th: "", trade_name: "", vaccine_type: "", name_en: "", price: "", dosage_ml: "", admin_route: ""
    });

    // 2. ฟังก์ชันอัปเดตค่าเมื่อพิมพ์
    const handleChange = (e, field) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    // 3. ฟังก์ชันบันทึก
    const handleSave = async () => {
        if (!formData.name_th) { alert("กรุณากรอกชื่อวัคซีน"); return; }
        
        const payload = {
            id: Math.floor(Math.random() * 100000),
            ...formData,
            image_url: selectedFile ? `/img/${selectedFile.name}` : null
        };

        try {
            const res = await fetch('/api/vaccines', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                alert("✅ เพิ่มวัคซีนสำเร็จ!");
                onBack();
            }
        } catch (err) { alert("Error connecting to server"); }
    };

    // (ส่วน State เดิมของคุณ)
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const [ageConditions, setAgeConditions] = useState([{ minAge: "", maxAge: "", dose: "", frequency: "" }]);
    const [diseaseConditions, setDiseaseConditions] = useState([{ selectedDisease: "", kidneyStage: "", dose: "", frequency: "", recommendation: "" }]);
    const [allergies, setAllergies] = useState({ egg: false, milk: false, gelatin: false, yeast: false, drugOption1: false, drugOption2: false, drugOption3: false, drugOption4: false });

    // (ฟังก์ชันเดิมของคุณ - ย่อไว้เพื่อความกระชับ)
    const addCondition = () => setAgeConditions([...ageConditions, { minAge: "", maxAge: "", dose: "", frequency: "" }]);
    const removeCondition = (i) => setAgeConditions(ageConditions.filter((_, idx) => idx !== i));
    const handleConditionChange = (i, f, v) => { const n = [...ageConditions]; n[i][f] = v; setAgeConditions(n); };
    const addDiseaseCondition = () => setDiseaseConditions([...diseaseConditions, { selectedDisease: "", kidneyStage: "", dose: "", frequency: "", recommendation: "" }]);
    const removeDiseaseCondition = (i) => setDiseaseConditions(diseaseConditions.filter((_, idx) => idx !== i));
    const handleDiseaseChange = (i, f, v) => { const n = [...diseaseConditions]; n[i][f] = v; setDiseaseConditions(n); };
    const handleAllergyChange = (f) => setAllergies({ ...allergies, [f]: !allergies[f] });
    const handleFileChange = (e) => { if(e.target.files[0]) setSelectedFile(e.target.files[0]); };
    const handleUploadClick = () => fileInputRef.current.click();
    const handleRemoveFile = (e) => { e.stopPropagation(); setSelectedFile(null); fileInputRef.current.value = ""; };
    const headerStyle = { backgroundColor: "#CBDCEB", fontWeight: "bold", borderBottom: "none" };

    return (
        <Container className="mt-5 pb-5" style={{ maxWidth: "900px" }}>
            <h3 className="text-center mb-4 fw-bold">เพิ่มวัคซีนใหม่</h3>

            {/* Section 1: ข้อมูลวัคซีน (ผมเติม value/onChange ให้แล้ว) */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="py-3" style={headerStyle}>ข้อมูลวัคซีน</Card.Header>
                <Card.Body className="p-4">
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Label>ชื่อวัคซีน</Form.Label>
                            {/* เติม value และ onChange */}
                            <Form.Control type="text" value={formData.name_th} onChange={(e) => handleChange(e, 'name_th')} />
                        </Col>
                        <Col md={6}>
                            <Form.Label>ชื่อการค้า</Form.Label>
                            <Form.Control type="text" value={formData.trade_name} onChange={(e) => handleChange(e, 'trade_name')} />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form>
                                <label className="mb-2">ชนิดวัคซีน</label>
                                <Form.Select value={formData.vaccine_type} onChange={(e) => handleChange(e, 'vaccine_type')}>
                                    <option>เลือกชนิดวัคซีน</option>
                                    <option value="Inactivated">Inactivated</option>
                                    <option value="Live">Live attenuated</option>
                                </Form.Select>
                            </Form>
                        </Col>
                        <Col md={6}>
                            <Form.Label>วัคซีนป้องกัน</Form.Label>
                            <Form.Control type="text" value={formData.name_en} onChange={(e) => handleChange(e, 'name_en')} />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Label>ราคา (บาท/เข็ม)</Form.Label>
                            <Form.Control type="number" value={formData.price} onChange={(e) => handleChange(e, 'price')} />
                        </Col>
                    </Row>
                    <Row className="mb-3"><Col md={12}><p className="">การบริหารวัคซีน</p></Col></Row>
                    <Row>
                        <Col md={6}>
                            <Form.Label>ขนาด (ml)</Form.Label>
                            <Form.Control type="text" value={formData.dosage_ml} onChange={(e) => handleChange(e, 'dosage_ml')} />
                        </Col>
                        <Col md={6}>
                            <Form>
                                <label className="mb-2">ตำแหน่งที่ฉีด</label>
                                <Form.Select value={formData.admin_route} onChange={(e) => handleChange(e, 'admin_route')}>
                                    <option>เลือกตำแหน่งที่ฉีด</option>
                                    <option value="Instramuscular">ฉีดเข้ากล้ามเนื้อ (Instramuscular)</option>
                                    <option value="Subcutaneous">ฉีดเข้าชั้นใต้ผิวหนัง (Subcutaneous)</option>
                                </Form.Select>
                            </Form>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* ส่วนอื่นคงเดิม 100% */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="py-3" style={headerStyle}>การจำกัดอายุ</Card.Header>
                <Card.Body className="p-4">
                    {ageConditions.map((item, index) => (
                        <AgeLimitCondition key={index} index={index} data={item} onChange={handleConditionChange} onRemove={removeCondition} />
                    ))}
                    <Button variant="primary" onClick={addCondition} style={{ backgroundColor: "#4a7fc1", border: "none" }}>+ เพิ่มเงื่อนไขอายุ</Button>
                </Card.Body>
            </Card>

            {/* (ข้ามส่วนโรคและแพ้ไปแสดงว่าเหมือนเดิม เพื่อประหยัดพื้นที่ แต่คุณใช้โค้ดเดิมได้เลย) */}
            <Card className="mb-4 shadow-sm border-0"><Card.Header className="py-3" style={headerStyle}>การจำกัดโรคประจำตัว</Card.Header><Card.Body className="p-4">{diseaseConditions.map((item, index) => (<DiseaseCondition key={`disease-${index}`} index={index} data={item} onChange={handleDiseaseChange} onRemove={removeDiseaseCondition} />))}<Button variant="primary" onClick={addDiseaseCondition} className="mt-2" style={{ backgroundColor: "#4a7fc1", border: "none" }}>+ เพิ่มเงื่อนไขโรคประจำตัว</Button></Card.Body></Card>
            <Card className="mb-4 shadow-sm border-0"><Card.Header className="py-3" style={headerStyle}>การแพ้อาหาร ยา และวัคซีน</Card.Header><Card.Body className="p-4"><p className="fw-bold">การแพ้อาหาร</p><Row className="mb-4"><Col md={3} className="mb-2"><div className="border rounded p-2 d-flex align-items-center"><Form.Check type="checkbox" label="ไข่ไก่" checked={allergies.egg} onChange={() => handleAllergyChange('egg')} /></div></Col><Col md={3} className="mb-2"><div className="border rounded p-2 d-flex align-items-center"><Form.Check type="checkbox" label="นมวัว" checked={allergies.milk} onChange={() => handleAllergyChange('milk')} /></div></Col><Col md={3} className="mb-2"><div className="border rounded p-2 d-flex align-items-center"><Form.Check type="checkbox" label="เจลาติน" checked={allergies.gelatin} onChange={() => handleAllergyChange('gelatin')} /></div></Col><Col md={3} className="mb-2"><div className="border rounded p-2 d-flex align-items-center"><Form.Check type="checkbox" label="ยีสต์" checked={allergies.yeast} onChange={() => handleAllergyChange('yeast')} /></div></Col></Row></Card.Body></Card>
            <Card className="mb-4 shadow-sm border-0"><Card.Header className="py-3" style={headerStyle}>ผลข้างเคียง ข้อห้ามใช้ ข้อควรระวัง</Card.Header><Card.Body className="p-4"><Form.Control as="textarea" rows={5} /></Card.Body></Card>

            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="py-3" style={headerStyle}>เพิ่มรูปภาพ</Card.Header>
                <Card.Body className="p-4">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} accept="image/jpeg, image/png" />
                    <div className="d-flex flex-column justify-content-center align-items-center rounded" onClick={handleUploadClick} style={{ border: "2px dashed #dee2e6", height: "200px", cursor: "pointer", backgroundColor: selectedFile ? "#f8f9fa" : "#fff" }}>
                        {selectedFile ? <div className="text-center"><CloudArrowUp size={40} className="text-success mb-2" /><h5 className="text-dark fw-bold">{selectedFile.name}</h5><Button variant="outline-danger" size="sm" className="mt-3" onClick={handleRemoveFile}>ลบรูปภาพ</Button></div> : <><CloudArrowUp size={40} className="text-primary mb-2" /><div className="text-muted fw-bold">Drag & drop files or <span className="text-primary">Browse</span></div></>}
                    </div>
                </Card.Body>
            </Card>

            <div className="d-flex justify-content-end">
                {/* เปลี่ยน onClick ให้เรียก handleSave */}
                <Button variant="primary" className="px-5 py-2" style={{ backgroundColor: "#4a7fc1", border: "none" }} onClick={handleSave}>
                    เสร็จสิ้น
                </Button>
            </div>
        </Container>
    );
}

export default AddVaccine;