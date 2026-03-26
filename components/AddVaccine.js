import { useState, useRef, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { CloudArrowUp } from "react-bootstrap-icons";
import AgeLimitCondition from "./AgeConditionCard";
import DiseaseCondition from "./DiseaseConditionCard";

function AddVaccine({ onBack }) {
    // 1. State สำหรับข้อมูลหลัก
    const [formData, setFormData] = useState({
        name_th: "",
        name_en: "",
        trade_name: "",
        indication: "",
        vaccine_type: "",
        price: "",
        is_available: true,
        dosage_ml: "",
        admin_route: "",
        side_effects: "",
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null); // แก้ไข: ลบ data?.image_url ออก
    const fileInputRef = useRef(null);

    // 2. จัดการรูปภาพ Preview เมื่อไฟล์เปลี่ยน
    useEffect(() => {
        if (!selectedFile) {
            setPreviewImage(null);
            return;
        }

        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewImage(objectUrl);

        // Cleanup function เพื่อคืนหน่วยความจำ
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    // State สำหรับเงื่อนไขต่างๆ
    const [ageConditions, setAgeConditions] = useState([
        { minAge: "", maxAge: "", dose: "", frequency: "", detail: "" },
    ]);
    const [diseaseConditions, setDiseaseConditions] = useState([
        {
            selectedDisease: "",
            kidneyStage: "",
            dose: "",
            frequency: "",
            recommendation: "",
            detail: "",
        },
    ]);
    const [allergies, setAllergies] = useState({
        egg: false,
        milk: false,
        gelatin: false,
        yeast: false,
        neomycin: false,
        streptomycin: false,
        polymyxinB: false,
    });

    // --- Functions ---
    const handleChange = (e, field) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleSave = async () => {
        if (!formData.name_th) {
            alert("กรุณากรอกชื่อวัคซีน");
            return;
        }

        try {
            let finalImageUrl = null;

            // อัปโหลดรูปภาพก่อน (ถ้ามี)
            if (selectedFile) {
                const uploadData = new FormData();
                uploadData.append("file", selectedFile);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadData,
                });

                if (!uploadRes.ok) throw new Error("Upload failed");

                const uploadJson = await uploadRes.json();
                finalImageUrl = uploadJson.imageUrl;
            }

            // เตรียม Payload
            const payload = {
                id: Math.floor(Math.random() * 100000),
                ...formData,
                age_conditions: ageConditions,
                disease_conditions: diseaseConditions,
                allergies: allergies,
                image_url: finalImageUrl,
            };

            const res = await fetch("/api/vaccines", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert("✅ เพิ่มวัคซีนสำเร็จ!");
                onBack();
            } else {
                alert("❌ บันทึกข้อมูลไม่สำเร็จ");
            }
        } catch (err) {
            console.error(err);
            alert("เกิดข้อผิดพลาด: " + err.message);
        }
    };

    // Handlers สำหรับ Dynamic Fields
    const addCondition = () =>
        setAgeConditions([
            ...ageConditions,
            { minAge: "", maxAge: "", dose: "", frequency: "", detail: "" },
        ]);

    const removeCondition = (i) =>
        setAgeConditions(ageConditions.filter((_, idx) => idx !== i));

    const handleConditionChange = (i, f, v) => {
        const n = [...ageConditions];
        n[i][f] = v;
        setAgeConditions(n);
    };

    const addDiseaseCondition = () =>
        setDiseaseConditions([
            ...diseaseConditions,
            {
                selectedDisease: "",
                kidneyStage: "",
                dose: "",
                frequency: "",
                recommendation: "",
                detail: "",
            },
        ]);

    const removeDiseaseCondition = (i) =>
        setDiseaseConditions(diseaseConditions.filter((_, idx) => idx !== i));

    const handleDiseaseChange = (i, f, v) => {
        const n = [...diseaseConditions];
        n[i][f] = v;
        setDiseaseConditions(n);
    };

    const handleAllergyChange = (f) =>
        setAllergies({ ...allergies, [f]: !allergies[f] });

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleRemoveFile = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleClear = () => {
        // เพิ่มการแจ้งเตือนยืนยันก่อนเคลียร์ ป้องกันการเผลอกดโดน
        if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลทั้งหมดที่กรอกไว้?")) {
            setFormData({
                name_th: "",
                name_en: "",
                trade_name: "",
                indication: "",
                vaccine_type: "",
                price: "",
                is_available: true,
                dosage_ml: "",
                admin_route: "",
                side_effects: "",
            });
            setSelectedFile(null);
            setPreviewImage(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            setAgeConditions([{ minAge: "", maxAge: "", dose: "", frequency: "", detail: "" }]);
            setDiseaseConditions([{
                selectedDisease: "", kidneyStage: "", dose: "", frequency: "", recommendation: "", detail: ""
            }]);
            setAllergies({
                egg: false, milk: false, gelatin: false, yeast: false,
                neomycin: false, streptomycin: false, polymyxinB: false,
            });
        }
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
                            <Form.Label>ชื่อวัคซีน (ไทย)</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name_th}
                                onChange={(e) => handleChange(e, "name_th")}
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Label>ชื่อวัคซีน (อังกฤษ)</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name_en}
                                onChange={(e) => handleChange(e, "name_en")}
                            />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Label>ชื่อการค้า</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.trade_name}
                                onChange={(e) => handleChange(e, "trade_name")}
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Label>ข้อบ่งใช้</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.indication}
                                onChange={(e) => handleChange(e, "indication")}
                            />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Label>ชนิดวัคซีน</Form.Label>
                            <Form.Select
                                value={formData.vaccine_type}
                                onChange={(e) => handleChange(e, "vaccine_type")}
                            >
                                <option value="">เลือกชนิดวัคซีน</option>
                                <option value="Inactivated">Inactivated</option>
                                <option value="Live">Live Attenuated</option>
                            </Form.Select>
                        </Col>
                        <Col md={6}>
                            <Form.Label>ราคา (บาท/เข็ม)</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.price}
                                onChange={(e) => handleChange(e, "price")}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Label>สถานะการให้บริการ</Form.Label>
                            <Form.Check
                                className="mt-2"
                                type="switch"
                                id="is_available"
                                label={formData.is_available ? "มีจำหน่าย" : "ไม่มีจำหน่าย"}
                                checked={formData.is_available}
                                onChange={(e) =>
                                    setFormData({ ...formData, is_available: e.target.checked })
                                }
                            />
                        </Col>
                    </Row>
                    <hr className="my-4" />
                    <p className="fw-bold">การบริหารวัคซีน</p>
                    <Row>
                        <Col md={6}>
                            <Form.Label>ขนาด (ml)</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.dosage_ml}
                                onChange={(e) => handleChange(e, "dosage_ml")}
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Label>ตำแหน่งที่ฉีด</Form.Label>
                            <Form.Select
                                value={formData.admin_route}
                                onChange={(e) => handleChange(e, "admin_route")}
                            >
                                <option value="">เลือกตำแหน่งที่ฉีด</option>
                                <option value="Instramuscular">ฉีดเข้ากล้ามเนื้อ (IM)</option>
                                <option value="Subcutaneous">ฉีดเข้าชั้นใต้ผิวหนัง (SC)</option>
                            </Form.Select>
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
                        <div
                            key={`age-group-${index}`}
                            className="mb-4 p-3 border rounded bg-light"
                        >
                            <AgeLimitCondition
                                index={index}
                                data={item}
                                onChange={handleConditionChange}
                                onRemove={removeCondition}
                            />
                            <Form.Group className="mt-2">
                                <Form.Label className="small fw-bold">
                                    คำแนะนำเพิ่มเติมสำหรับช่วงอายุนี้
                                </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    placeholder="เช่น เฉพาะผู้ที่มีความเสี่ยงสูง..."
                                    value={item.detail}
                                    onChange={(e) =>
                                        handleConditionChange(index, "detail", e.target.value)
                                    }
                                />
                            </Form.Group>
                        </div>
                    ))}
                    <Button
                        variant="primary"
                        onClick={addCondition}
                        className="mt-3"
                        style={{ backgroundColor: "#4a7fc1", border: "none" }}
                    >
                        + เพิ่มเงื่อนไขอายุ
                    </Button>
                </Card.Body>
            </Card>

            {/* Section 3: โรคประจำตัว */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="py-3" style={headerStyle}>
                    การจำกัดโรคประจำตัว
                </Card.Header>
                <Card.Body className="p-4">
                    {diseaseConditions.map((item, index) => (
                        <div
                            key={`disease-group-${index}`}
                            className="mb-4 p-3 border rounded bg-light"
                        >
                            <DiseaseCondition
                                index={index}
                                data={item}
                                onChange={handleDiseaseChange}
                                onRemove={removeDiseaseCondition}
                            />
                            <Form.Group className="mt-2">
                                <Form.Label className="small fw-bold">
                                    คำแนะนำเพิ่มเติมสำหรับกลุ่มโรคนี้
                                </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    placeholder="ระบุคำแนะนำทางการแพทย์เพิ่มเติม..."
                                    value={item.detail}
                                    onChange={(e) =>
                                        handleDiseaseChange(index, "detail", e.target.value)
                                    }
                                />
                            </Form.Group>
                        </div>
                    ))}
                    <Button
                        variant="primary"
                        onClick={addDiseaseCondition}
                        className="mt-3"
                        style={{ backgroundColor: "#4a7fc1", border: "none" }}
                    >
                        + เพิ่มเงื่อนไขโรคประจำตัว
                    </Button>
                </Card.Body>
            </Card>

            {/* Section 4: แพ้อาหาร/ยา (แก้ไข Syntax Error ตรงนี้) */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="py-3" style={headerStyle}>
                    การแพ้อาหาร ยา และวัคซีน
                </Card.Header>
                <Card.Body className="p-4">
                    <p className="fw-bold">การแพ้อาหาร</p>
                    <Row className="mb-4">
                        {["egg", "milk", "gelatin", "yeast"].map((item) => (
                            <Col md={3} key={item} className="mb-2">
                                <div className="border rounded p-2">
                                    <Form.Check
                                        type="checkbox"
                                        label={
                                            item === "egg"
                                                ? "ไข่ไก่"
                                                : item === "milk"
                                                    ? "นมวัว"
                                                    : item === "gelatin"
                                                        ? "เจลาติน"
                                                        : "ยีสต์"
                                        }
                                        checked={allergies[item]}
                                        onChange={() => handleAllergyChange(item)}
                                    />
                                </div>
                            </Col>
                        ))}
                    </Row>
                    <p className="fw-bold">การแพ้ยาและวัคซีน</p>
                    <Row>
                        {[{ label: "Neomycin", key: "neomycin" },
                        { label: "Streptomycin", key: "streptomycin" },
                        { label: "Polymyxin B", key: "polymyxinB" }]
                        .map((drug) => (
                            <Col md={3} key={drug.key} className="mb-2">
                                <div className="border rounded p-2">
                                    <Form.Check
                                        type="checkbox"
                                        label={drug.label}
                                        checked={allergies[drug.key] || false}
                                        onChange={() => handleAllergyChange(drug.key)}
                                    />
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Card.Body>
            </Card>

            {/* Section 5: Side Effects */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="py-3" style={headerStyle}>
                    ผลข้างเคียง ข้อห้ามใช้ ข้อควรระวัง
                </Card.Header>
                <Card.Body className="p-4">
                    <Form.Control
                        as="textarea"
                        rows={5}
                        value={formData.side_effects}
                        onChange={(e) => handleChange(e, "side_effects")}
                        placeholder="ระบุรายละเอียดผลข้างเคียงหรือข้อควรระวัง..."
                    />
                </Card.Body>
            </Card>

            {/* Section 6: Image Upload */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="py-3" style={headerStyle}>
                    รูปภาพวัคซีน
                </Card.Header>
                <Card.Body className="p-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        accept="image/*"
                    />
                    <div
                        className="d-flex flex-column justify-content-center align-items-center rounded"
                        onClick={() => fileInputRef.current.click()}
                        style={{
                            border: "2px dashed #dee2e6",
                            height: "250px",
                            cursor: "pointer",
                            backgroundColor: previewImage ? "#f8f9fa" : "#fff",
                        }}
                    >
                        {previewImage ? (
                            <div className="text-center">
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    style={{
                                        maxHeight: "150px",
                                        marginBottom: "15px",
                                        borderRadius: "8px",
                                    }}
                                />
                                <h6 className="fw-bold">
                                    {selectedFile?.name || "รูปภาพที่เลือก"}
                                </h6>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={handleRemoveFile}
                                >
                                    ลบรูปภาพ
                                </Button>
                            </div>
                        ) : (
                            <>
                                <CloudArrowUp size={40} className="text-primary mb-2" />
                                <div className="text-muted fw-bold">
                                    คลิกเพื่อเลือกรูปภาพวัคซีน
                                </div>
                            </>
                        )}
                    </div>
                </Card.Body>
            </Card>

            <div className="d-flex justify-content-between">
                <Button variant="secondary" className="me-2 px-4" onClick={onBack}>
                    ยกเลิก
                </Button>
                <div className="d-flex gap-3">
                    {/* ปุ่มเคลียร์ข้อมูลที่แก้ไขแล้ว */}
                    <Button
                        onClick={handleClear}
                        className="px-4"
                        style={{
                            backgroundColor: "#ffffff", // พื้นหลังสีขาว
                            color: "#4a7fc1",           // ตัวอักษรสีฟ้า
                            borderColor: "#4a7fc1",     // กรอบสีฟ้า
                            borderWidth: "1px",
                            borderStyle: "solid"
                        }}
                    >
                        เคลียร์ข้อมูล
                    </Button>

                    <Button
                        variant="primary"
                        className="px-5"
                        onClick={handleSave}
                        style={{ backgroundColor: "#4a7fc1", border: "none" }}
                    >
                        บันทึกข้อมูล
                    </Button>
                </div>
            </div>
        </Container>
    );
}

export default AddVaccine;
