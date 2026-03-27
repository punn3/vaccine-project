import { useState, useRef, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { CloudArrowUp } from "react-bootstrap-icons";
import AgeLimitCondition from "./AgeConditionCard";
import DiseaseCondition from "./DiseaseConditionCard";
import ContraindicatedCondition from "./ContraindicatedConditionCard"; // ✨ อย่าลืมสร้างไฟล์ Component นี้นะครับ

function EditVaccine({ onBack, data }) {
    const [formData, setFormData] = useState({
        name_th: "",
        name_en: "",
        trade_name: "",
        indication: "",
        vaccine_type: "",
        price: "",
        dosage_ml: "",
        admin_route: "",
        side_effects: "",
        is_available: true,
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);
    const [ageConditions, setAgeConditions] = useState([]);
    const [diseaseConditions, setDiseaseConditions] = useState([]);
    const [allergies, setAllergies] = useState({
        egg: false,
        milk: false,
        gelatin: false,
        yeast: false,
        neomycin: false,
        streptomycin: false,
        polymyxinB: false,
    });
    const [contraindicatedConditions, setContraindicatedConditions] = useState([]);
    const [allVaccinesList, setAllVaccinesList] = useState([]);

    useEffect(() => {
        // ดึงรายชื่อวัคซีนทั้งหมด เพื่อเอาไปทำ Dropdown
        const fetchAllVaccines = async () => {
            try {
                const res = await fetch("/api/vaccines"); // ต้องมี API route นี้นะครับ
                const vList = await res.json();
                setAllVaccinesList(vList);
            } catch (error) {
                console.error("ดึงรายชื่อวัคซีนทั้งหมดไม่สำเร็จ:", error);
            }
        };

        const fetchFullVaccineData = async () => {
            if (data && data.id) {
                try {
                    const res = await fetch(`/api/vaccines/${data.id}`);
                    const fullData = await res.json();

                    setFormData({
                        name_th: fullData.name_th || "",
                        name_en: fullData.name_en || "",
                        trade_name: fullData.trade_name || "",
                        indication: fullData.indication || "",
                        vaccine_type: fullData.vaccine_type || "",
                        price: fullData.price || "",
                        dosage_ml: fullData.dosage_ml || fullData.administration || "",
                        admin_route: fullData.admin_route || "",
                        side_effects: fullData.side_effects || fullData.precautions || "",
                        is_available:
                            fullData.is_available !== undefined
                                ? Boolean(fullData.is_available)
                                : true,
                    });

                    if (fullData.image_url) setPreviewImage(fullData.image_url);
                    if (fullData.age_conditions)
                        setAgeConditions(fullData.age_conditions);
                    if (fullData.disease_conditions)
                        setDiseaseConditions(fullData.disease_conditions);

                    // ยัดข้อมูลวัคซีนห้ามฉีดร่วมที่ดึงมาเข้า State
                    if (fullData.contraindicated_conditions) {
                        setContraindicatedConditions(fullData.contraindicated_conditions);
                    }

                    if (fullData.allergies) {
                        setAllergies((prev) => ({ ...prev, ...fullData.allergies }));
                    }
                } catch (error) {
                    console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
                }
            }
        };

        fetchAllVaccines();
        fetchFullVaccineData();
    }, [data]);

    // Handlers
    const handleChange = (e, field) =>
        setFormData({ ...formData, [field]: e.target.value });

    // Handlers Age
    const addCondition = () =>
        setAgeConditions([
            ...ageConditions,
            {
                minAge: "",
                maxAge: "",
                dose: "",
                frequency: "",
                status: "",
                detail: "",
            },
        ]);
    const removeCondition = (i) =>
        setAgeConditions(ageConditions.filter((_, idx) => idx !== i));
    const handleConditionChange = (i, f, v) => {
        const n = [...ageConditions];
        n[i][f] = v;
        setAgeConditions(n);
    };

    // Handlers Disease
    const addDiseaseCondition = () =>
        setDiseaseConditions([
            ...diseaseConditions,
            { selectedDiseases: [], dose: "", frequency: "", status: "", detail: "" },
        ]);
    const removeDiseaseCondition = (i) =>
        setDiseaseConditions(diseaseConditions.filter((_, idx) => idx !== i));
    const handleDiseaseChange = (i, f, v) => {
        const n = [...diseaseConditions];
        n[i][f] = v;
        setDiseaseConditions(n);
    };

    // Handlers ข้อห้ามฉีดวัคซีน
    const addContraindicated = () =>
        setContraindicatedConditions([
            ...contraindicatedConditions,
            { contraindicated_vaccine: "", interval_desc: "", detail: "" },
        ]);
    const removeContraindicated = (i) =>
        setContraindicatedConditions(
            contraindicatedConditions.filter((_, idx) => idx !== i),
        );
    const handleContraindicatedChange = (i, f, v) => {
        const n = [...contraindicatedConditions];
        n[i][f] = v;
        setContraindicatedConditions(n);
    };

    const handleAllergyChange = (f) =>
        setAllergies({ ...allergies, [f]: !allergies[f] });
    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setPreviewImage(URL.createObjectURL(e.target.files[0]));
        }
    };
    const handleUploadClick = () => fileInputRef.current.click();
    const handleRemoveFile = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
        setPreviewImage(data?.image_url || null);
        fileInputRef.current.value = "";
    };

    const handleSave = async () => {
        if (!formData.name_th) return alert("กรุณากรอกชื่อวัคซีน");
        try {
            let finalImageUrl = data?.image_url;
            const payload = {
                id: data.id,
                ...formData,
                age_conditions: ageConditions,
                disease_conditions: diseaseConditions,
                contraindicated_conditions: contraindicatedConditions, // ✨ แนบส่ง API
                allergies: allergies,
                image_url: finalImageUrl,
            };

            const res = await fetch(`/api/vaccines/${data.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert("✅ แก้ไขข้อมูลวัคซีนสำเร็จ!");
                onBack();
            } else {
                const errorData = await res.json();
                alert(
                    "❌ บันทึกข้อมูลไม่สำเร็จ: " + (errorData.message || "Unknown error"),
                );
            }
        } catch (err) {
            console.error(err);
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        }
    };

    const headerStyle = {
        backgroundColor: "#CBDCEB",
        fontWeight: "bold",
        borderBottom: "none",
    };

    return (
        <Container className="mt-5 pb-5" style={{ maxWidth: "900px" }}>
            <h3 className="text-center mb-4 fw-bold">แก้ไขข้อมูลวัคซีน</h3>

            {/* ส่วน UI คงเดิมตามโค้ดของคุณ */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="py-3" style={headerStyle}>
                    ข้อมูลวัคซีน
                </Card.Header>
                <Card.Body className="p-4">
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Label>ชื่อวัคซีน</Form.Label>
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
                                <option value="Live">Live attenuated</option>
                                <option value="mRNA">mRNA</option>
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
                                value={formData.admin_route || ""}
                                onChange={(e) => handleChange(e, "admin_route")}
                            >
                                <option value="">เลือกตำแหน่งที่ฉีด</option>
                                <option value="ฉีดเข้ากล้ามเนื้อ (Instramuscular)">
                                    ฉีดเข้ากล้ามเนื้อ (IM)
                                </option>
                                <option value="ฉีดเข้าชั้นใต้ผิวหนัง (Subcutaneous)">
                                    ฉีดเข้าชั้นใต้ผิวหนัง (SC)
                                </option>
                                <option value="ชนิดรับประทาน (Oral)">
                                    ชนิดรับประทาน (Oral)
                                </option>
                                <option value="ฉีดเข้ากล้ามเนื้อ (Instramuscular) หรือ ฉีดเข้าในผิวหนังที่ต้นแขน">
                                    ฉีดเข้ากล้ามเนื้อ (IM) หรือ ชั้นผิวหนัง (ID)
                                </option>
                                <option value="ฉีดเข้าชั้นใต้ผิวหนัง (Subcutaneous) หรือ ฉีดเข้ากล้ามเนื้อ (Insramuscular) ก็ได้">
                                    ฉีดเข้าชั้นใต้ผิวหนัง (SC) หรือ กล้ามเนื้อ (IM)
                                </option>
                            </Form.Select>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* ส่วน Age, Disease, Allergy, Image, Button ใช้โค้ดเดิมของคุณได้เลยครับ ... */}
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
                                    คำแนะนำเพิ่มเติม
                                </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={item.detail || ""}
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
                                    คำแนะนำเพิ่มเติม
                                </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={item.detail || ""}
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
            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="py-3" style={headerStyle}>
                    เงื่อนไขวัคซีนที่ไม่สามารถฉีดร่วมได้
                </Card.Header>
                <Card.Body className="p-4">
                    {contraindicatedConditions.map((item, index) => (
                        <ContraindicatedCondition
                            key={`contra-${index}`}
                            index={index}
                            data={item}
                            onChange={handleContraindicatedChange}
                            onRemove={removeContraindicated}
                            vaccineList={allVaccinesList} // โยนตัวเลือกไปทำ Dropdown
                        />

                    ))}
                    <Button
                        variant="primary"
                        onClick={addContraindicated}
                        className="mt-3"
                        style={{ backgroundColor: "#4a7fc1", border: "none" }}
                    >
                        + เพิ่มเงื่อนไขวัคซีน
                    </Button>
                </Card.Body>
            </Card>

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
                        {[
                            { key: "neomycin", label: "Neomycin" },
                            { key: "streptomycin", label: "Streptomycin" },
                            { key: "polymyxinB", label: "Polymyxin B" },
                        ].map((item) => (
                            <Col md={3} key={item.key}>
                                <div className="border rounded p-2">
                                    <Form.Check
                                        type="checkbox"
                                        id={`check-${item.key}`}
                                        label={item.label}
                                        checked={allergies[item.key] || false}
                                        onChange={() => handleAllergyChange(item.key)}
                                    />
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Card.Body>
            </Card>

            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="py-3" style={headerStyle}>
                    ผลข้างเคียง ข้อห้ามใช้ และข้อควรระวัง
                </Card.Header>
                <Card.Body className="p-4">
                    <Form.Control
                        as="textarea"
                        rows={5}
                        value={formData.side_effects}
                        onChange={(e) => handleChange(e, "side_effects")}
                    />
                </Card.Body>
            </Card>

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
                        onClick={handleUploadClick}
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
                                    onError={(e) => (e.target.style.display = "none")}
                                />
                                <h6 className="fw-bold">
                                    {selectedFile ? selectedFile.name : "รูปภาพปัจจุบัน"}
                                </h6>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    className="mt-2"
                                    onClick={handleRemoveFile}
                                >
                                    ลบรูปภาพ
                                </Button>
                            </div>
                        ) : (
                            <>
                                <CloudArrowUp size={40} className="text-primary mb-2" />
                                <div className="text-muted fw-bold">
                                    คลิกเพื่อเปลี่ยนรูปภาพวัคซีน
                                </div>
                            </>
                        )}
                    </div>
                </Card.Body>
            </Card>

            <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2 px-4" onClick={onBack}>
                    ยกเลิก
                </Button>
                <Button
                    variant="primary"
                    className="px-5"
                    style={{ backgroundColor: "#4a7fc1", border: "none" }}
                    onClick={handleSave}
                >
                    บันทึกข้อมูล
                </Button>
            </div>
        </Container>
    );
}

export default EditVaccine;
