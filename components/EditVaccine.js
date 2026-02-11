import { useState, useRef, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { CloudArrowUp } from "react-bootstrap-icons";
import AgeLimitCondition from "./AgeConditionCard";
import DiseaseCondition from "./DiseaseConditionCard";

function EditVaccine({ onBack, data }) {
    // 1. State หลัก
    const [formData, setFormData] = useState({
        name_th: "",
        trade_name: "",
        vaccine_type: "",
        name_en: "",
        price: "",
        dosage_ml: "",
        admin_route: "",
        side_effects: "",
        is_available: true,
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);

    // State สำหรับเงื่อนไขและภูมิแพ้
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
        drugOption1: false,
        drugOption2: false,
        drugOption3: false,
        drugOption4: false,
    });

    // ✅ เพิ่ม useEffect เพื่อดึงข้อมูลจาก props 'data' มาใส่ใน Form เมื่อโหลดหน้าเสร็จ
    useEffect(() => {
        if (data) {
            console.log("EditVaccine received data:", data); // เช็คใน Console ว่าข้อมูลมาไหม

            // 1. Map ข้อมูลพื้นฐาน
            setFormData({
                name_th: data.name_th || "",
                trade_name: data.trade_name || "",
                vaccine_type: data.vaccine_type || "",
                name_en: data.name_en || "",
                price: data.price || "",
                // เช็ค 2 ค่า เผื่อ API ส่งมาเป็น administration หรือ dosage_ml
                dosage_ml: data.dosage_ml || data.administration || "",
                admin_route: data.admin_route || "",
                side_effects: data.side_effects || data.precautions || "", // เผื่อใช้ชื่อ precautions
                is_available:
                    data.is_available !== undefined ? Boolean(data.is_available) : true,
            });

            // 2. Map รูปภาพ
            if (data.image_url) {
                setPreviewImage(data.image_url);
            }

            // 3. Map เงื่อนไขอายุ (ถ้ามี)
            // ตรวจสอบว่าเป็น String (JSON) หรือ Array แล้ว
            let parsedAge = [];
            if (Array.isArray(data.age_conditions)) {
                parsedAge = data.age_conditions;
            } else if (
                typeof data.age_conditions === "string" &&
                data.age_conditions.trim() !== ""
            ) {
                try {
                    parsedAge = JSON.parse(data.age_conditions);
                } catch (e) { }
            }
            if (parsedAge.length > 0) setAgeConditions(parsedAge);

            // 4. Map เงื่อนไขโรค (ถ้ามี)
            let parsedDisease = [];
            if (Array.isArray(data.disease_conditions)) {
                parsedDisease = data.disease_conditions;
            } else if (
                typeof data.disease_conditions === "string" &&
                data.disease_conditions.trim() !== ""
            ) {
                try {
                    parsedDisease = JSON.parse(data.disease_conditions);
                } catch (e) { }
            }
            if (parsedDisease.length > 0) setDiseaseConditions(parsedDisease);

            // 5. Map ภูมิแพ้ (ถ้ามี)
            let parsedAllergies = null;
            if (typeof data.allergies === "object" && data.allergies !== null) {
                parsedAllergies = data.allergies;
            } else if (
                typeof data.allergies === "string" &&
                data.allergies.trim() !== ""
            ) {
                try {
                    parsedAllergies = JSON.parse(data.allergies);
                } catch (e) { }
            }

            if (parsedAllergies) {
                setAllergies((prev) => ({ ...prev, ...parsedAllergies }));
            }
        }
    }, [data]); // ทำงานเมื่อค่า data เปลี่ยนแปลง

    // --- Functions (เหมือนเดิม) ---
    const handleChange = (e, field) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleSave = async () => {
        if (!formData.name_th) {
            alert("กรุณากรอกชื่อวัคซีน");
            return;
        }

        try {
            let finalImageUrl = data?.image_url;

            // อัปโหลดไฟล์ใหม่ถ้ามีการเลือก
            if (selectedFile) {
                // สมมติว่ามี API Upload (ถ้ายังไม่มีข้ามส่วนนี้ไปก่อนได้)
                // const uploadData = new FormData();
                // uploadData.append("file", selectedFile);
                // const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadData });
                // const uploadJson = await uploadRes.json();
                // finalImageUrl = uploadJson.imageUrl;
            }

            const payload = {
                id: data.id, // ส่ง ID กลับไปด้วย
                ...formData,
                age_conditions: ageConditions,
                disease_conditions: diseaseConditions,
                allergies: allergies,
                image_url: finalImageUrl,
            };

            const res = await fetch(`/api/vaccines/${data.id}`, {
                // ใช้ Dynamic Route ID
                method: "PUT", // หรือ POST ขึ้นอยู่กับ API ของคุณ
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert("✅ แก้ไขข้อมูลวัคซีนสำเร็จ!");
                onBack(); // กลับไปหน้า List
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

    // Condition Handlers (คงเดิม)
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
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };
    const handleUploadClick = () => fileInputRef.current.click();
    const handleRemoveFile = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
        setPreviewImage(data?.image_url || null); // กลับไปใช้รูปเดิมถ้าลบรูปที่เพิ่งเลือก
        fileInputRef.current.value = "";
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
                            <Form.Label>ชื่อการค้า</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.trade_name}
                                onChange={(e) => handleChange(e, "trade_name")}
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
                            <Form.Label>วัคซีนป้องกัน</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name_en}
                                onChange={(e) => handleChange(e, "name_en")}
                            />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Label>ราคา (บาท/เข็ม)</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.price}
                                onChange={(e) => handleChange(e, "price")}
                            />
                        </Col>
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
                                <option value="Intradermal">ฉีดเข้าชั้นผิวหนัง (ID)</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* ส่วน Age, Disease, Allergy, Image, Button ใช้โค้ดเดิมของคุณได้เลยครับ ... */}
            {/* ผมละไว้เพื่อความกระชับ แต่ Logic การแสดงผลจะใช้ตัวแปร state ที่ update แล้วจาก useEffect ครับ */}
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
                                    รายละเอียดเพิ่มเติม
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
                        {[1, 2, 3, 4].map((num) => (
                            <Col md={3} key={num} className="mb-2">
                                <div className="border rounded p-2">
                                    <Form.Check
                                        type="checkbox"
                                        label={`ตัวเลือก ${num}`}
                                        checked={allergies[`drugOption${num}`]}
                                        onChange={() => handleAllergyChange(`drugOption${num}`)}
                                    />
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Card.Body>
            </Card>

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
