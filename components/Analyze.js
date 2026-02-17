"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // สำหรับ Next.js App Router
import { Container, Card, Row, Col, Form, Button, Collapse, Badge } from 'react-bootstrap';
import { CheckCircleFill, XCircleFill, ChevronDown, ChevronUp, InfoCircle } from 'react-bootstrap-icons';

export default function AnalysisResult() {
    const router = useRouter();

    // State เก็บข้อมูลที่โหลดมาจาก API
    const [allowedVaccines, setAllowedVaccines] = useState([]);
    const [notAllowedVaccines, setNotAllowedVaccines] = useState([]);

    // State จัดการ UI
    const [selectedVaccines, setSelectedVaccines] = useState([]); // เก็บ ID วัคซีนที่ผู้ใช้ติ๊กเลือก
    const [expandedId, setExpandedId] = useState(null); // ควบคุมการเปิด/ปิด ดูผลข้างเคียง

    // ฟังก์ชันกำหนดสี Badge ตามสถานะ
    const getStatusBadgeStyle = (status) => {
        // ใช้ Switch case เช็คข้อความสถานะ
        switch (status) {
            case 'Reccomended':  // (อิงตามตัวสะกดใน Database ของคุณ)
            case 'Recommended':
                return { backgroundColor: '#1a7742', color: '#ffffff', border: '1px solid #1a7742' };
            case 'Consider':
                return { backgroundColor: '#ffe5a0', color: '#68501c', border: '1px solid #ffe5a0' };
            case 'Risk-base':
                return { backgroundColor: '#0d5bb5', color: '#ffffff', border: '1px solid #0d5bb5' };
            case 'Cautious':
                return { backgroundColor: '#b70f18', color: '#ffd6d6', border: '1px solid #b70f18' };
            case 'Share-decision':
                return { backgroundColor: '#bfe2f8', color: '#165e99', border: '1px solid #bfe2f8' };
            case 'No specific':
                return { backgroundColor: '#e9e9e9', color: '#333333', border: '1px solid #e9e9e9' };
            default:
                return { backgroundColor: '#6c757d', color: '#ffffff' }; // สีเทา (กรณีไม่มีข้อมูล)
        }
    };
    // โหลดข้อมูลและวิเคราะห์เมื่อเปิดหน้า
    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                // 1. ดึงข้อมูลที่ผู้ใช้กรอกไว้จาก LocalStorage
                const savedData = localStorage.getItem("vaccineFormData");
                if (!savedData) {
                    alert("ไม่พบข้อมูลการกรอก กรุณากรอกข้อมูลใหม่");
                    router.push('/form'); // เด้งกลับไปหน้ากรอกข้อมูล (แก้ path ให้ตรงกับโปรเจกต์คุณ)
                    return;
                }

                const rawData = JSON.parse(savedData);

                // ======================================================
                // 2. แปลงข้อมูล (Data Mapping) ให้ตรงสเปค API
                // ======================================================

                // กรองเฉพาะโรคที่เลือก (ตัดค่าว่าง และ "ไม่มีโรคประจำตัว" ออก)
                const selectedDiseases = Object.values(rawData.disease).filter(
                    (val) => val !== "" && val !== "ไม่มีโรคประจำตัว"
                );

                // จัดการการตั้งครรภ์ และ ดึงอายุครรภ์ออกมาเป็นตัวเลข
                let is_pregnant = false;
                let gestational_weeks = null;
                if (rawData.basic.pregnant && rawData.basic.pregnant !== "ไม่ตั้งครรภ์") {
                    is_pregnant = true;
                    // แปลง "14-27 สัปดาห์" ให้ดึงเลขตัวหน้ามาใช้ (เช่น 14)
                    const match = rawData.basic.pregnant.match(/(\d+)/);
                    if (match) gestational_weeks = parseInt(match[0]);
                }

                // แปลงข้อมูลการแพ้อาหารให้อยู่ในรูปแบบ Object (และปรับชื่อให้ตรง DB)
                const allergiesObj = {};
                if (rawData.allergy && rawData.allergy.foodList) {
                    rawData.allergy.foodList.forEach(item => {
                        if (item === "ไข่") allergiesObj["ไข่ไก่"] = true;
                        else if (item === "นม") allergiesObj["นมวัว"] = true;
                        else allergiesObj[item] = true;
                    });
                }
                // รวมแพ้ยา/วัคซีนเข้าไปด้วย
                if (rawData.allergy && rawData.allergy.drugAndVaccineList) {
                    rawData.allergy.drugAndVaccineList.forEach(item => {
                        allergiesObj[item] = true;
                    });
                }

                // จัดการประวัติการฉีดวัคซีนเก่า
                let history = [];
                if (rawData.vaccines && rawData.vaccines.received) {
                    history = rawData.vaccines.received
                        .filter(item => item.vaccine !== "" && item.date !== "")
                        .map(item => ({
                            vaccine_name_en: item.vaccine, // ส่งชื่อภาษาอังกฤษไปเทียบใน API
                            date_received: item.date
                        }));
                }

                // 📦 แพ็คข้อมูลเตรียมส่งให้ API
                const payload = {
                    age: parseInt(rawData.basic.age) || 0,
                    is_pregnant: is_pregnant,
                    gestational_weeks: gestational_weeks,
                    is_med_personnel: rawData.basic.medical === "เป็น",
                    diseases: selectedDiseases,
                    allergies: allergiesObj,
                    history: history
                };

                console.log("ข้อมูลที่แปลงแล้ว เตรียมส่งเข้า API:", payload);

                // ======================================================
                // 3. ยิงข้อมูลไปหา API วิเคราะห์ความปลอดภัย
                // ======================================================
                const res = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    const resultData = await res.json();
                    setAllowedVaccines(resultData.allowed);
                    setNotAllowedVaccines(resultData.notAllowed);
                } else {
                    console.error("API Error: ไม่สามารถวิเคราะห์ข้อมูลได้");
                }
            } catch (error) {
                console.error("Fetch Error:", error);
            }
        };

        fetchAnalysis();
    }, [router]);

    // ฟังก์ชันจัดการ UI
    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleCheckboxChange = (id) => {
        if (selectedVaccines.includes(id)) {
            setSelectedVaccines(selectedVaccines.filter(vId => vId !== id));
        } else {
            setSelectedVaccines([...selectedVaccines, id]);
        }
    };

    const handleNext = () => {
        // เซฟวัคซีนที่เลือกไว้ เผื่อเอาไปใช้หน้าถัดไป (หน้าสรุป/นัดหมาย)
        localStorage.setItem("selectedVaccinesFinal", JSON.stringify(selectedVaccines));
        alert(`คุณเลือกวัคซีนไปทั้งหมด ${selectedVaccines.length} ชนิด`);
        // router.push('/summary'); // เปลี่ยนหน้าไปยังหน้าถัดไป
    };

    return (
        <Container className="py-5">

            {/* ==============================================
                ส่วนที่ 1: วัคซีนที่ฉีดได้ (สีเขียว)
            ============================================== */}
            <div className="mb-5">
                <h5 className="fw-bold mb-3 d-flex align-items-center">
                    <CheckCircleFill color="#28a745" size={24} className="me-2" />
                    วัคซีนที่สามารถฉีดได้ ({allowedVaccines.length} ชนิด)
                </h5>

                {allowedVaccines.length === 0 ? (
                    <div className="text-muted text-center p-4 bg-white rounded-4 shadow-sm">ไม่มีวัคซีนที่เข้าเกณฑ์ของคุณในขณะนี้</div>
                ) : (
                    allowedVaccines.map((vac) => (
                        <Card key={vac.id} className="border-0 shadow-sm mb-3 rounded-4 overflow-hidden">
                            <Card.Body className="p-4">
                                <Row>
                                    <Col xs="auto" className="d-flex align-items-center">
                                        <Form.Check
                                            type="checkbox"
                                            style={{ transform: 'scale(1.5)', marginRight: '10px' }}
                                            checked={selectedVaccines.includes(vac.id)}
                                            onChange={() => handleCheckboxChange(vac.id)}
                                        />
                                    </Col>
                                    <Col xs="auto" className="d-none d-sm-block">
                                        {/* กล่องใส่รูป (ซ่อนในมือถือจอเล็กเพื่อประหยัดพื้นที่) */}
                                        <div style={{
                                            width: '100px', height: '100px',
                                            backgroundColor: '#e9ecef', borderRadius: '8px',
                                            backgroundImage: `url(${vac.image_url || '/img/default-vaccine.png'})`,
                                            backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'
                                        }}></div>
                                    </Col>
                                    <Col>
                                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-2">
                                            <div>
                                                <h5 className="fw-bold mb-1">{vac.name_th}</h5>
                                                <p className="text-muted small mb-0">{vac.trade_name || vac.name_en}</p>
                                            </div>
                                            <h5 className="text-success fw-bold mt-2 mt-md-0">
                                                {vac.price ? `฿ ${vac.price} /เข็ม` : 'ไม่มีข้อมูลราคา'}
                                            </h5>
                                        </div>

                                        <p className="small mb-3">
                                            <span className="text-muted">ชนิดวัคซีน :</span> {vac.vaccine_type}
                                            {vac.matchStatus && (
                                                <span
                                                    className="ms-2 px-3 py-1 rounded-pill"
                                                    style={{
                                                        fontSize: '0.85rem',
                                                        fontWeight: 'bold',
                                                        ...getStatusBadgeStyle(vac.matchStatus)
                                                    }}
                                                >
                                                    {vac.matchStatus}
                                                </span>
                                            )}
                                        </p>

                                        {/* รายละเอียดการบริหารวัคซีน */}
                                        <div className="bg-light p-3 rounded-3 mb-3">
                                            <p className="fw-bold small mb-2"><InfoCircle className="me-1" /> การบริหารวัคซีน</p>
                                            <Row className="small text-center text-md-start">
                                                <Col xs={4} md={4}>
                                                    <span className="text-muted d-block" style={{ fontSize: '0.8rem' }}>ขนาด</span>
                                                    {vac.dose_amount || '-'}
                                                </Col>
                                                <Col xs={4} md={4}>
                                                    <span className="text-muted d-block" style={{ fontSize: '0.8rem' }}>จำนวนโดส</span>
                                                    {vac.rule_dose || '-'} {vac.rule_freq ? `(${vac.rule_freq})` : ''}
                                                </Col>
                                                <Col xs={4} md={4}>
                                                    <span className="text-muted d-block" style={{ fontSize: '0.8rem' }}>ตำแหน่งที่ฉีด</span>
                                                    {vac.admin_route || '-'}
                                                </Col>
                                            </Row>
                                        </div>

                                        {/* โชว์เหตุผลที่อนุญาตให้ฉีดได้ (ข้อความสีเขียว) */}
                                        {vac.reason && (
                                            <p className="small text-success mb-3">
                                                <CheckCircleFill className="me-1" /> {vac.reason}
                                            </p>
                                        )}

                                        {/* ดูผลข้างเคียง Toggle */}
                                        <div
                                            className="text-primary small fw-bold user-select-none"
                                            style={{ cursor: 'pointer', display: 'inline-block' }}
                                            onClick={() => toggleExpand(vac.id)}
                                        >
                                            ดูผลข้างเคียง ข้อห้ามใช้ และข้อควรระวัง {expandedId === vac.id ? <ChevronUp className="ms-1" /> : <ChevronDown className="ms-1" />}
                                        </div>
                                        <Collapse in={expandedId === vac.id}>
                                            <div className="mt-2 text-danger small bg-danger bg-opacity-10 p-3 rounded-3 border border-danger border-opacity-25">
                                                {vac.side_effects || vac.precautions || 'ไม่มีระบุข้อมูลผลข้างเคียง'}
                                            </div>
                                        </Collapse>

                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))
                )}
            </div>

            {/* ==============================================
                ส่วนที่ 2: วัคซีนที่ฉีดไม่ได้ (สีแดง)
            ============================================== */}
            <div className="mb-4">
                <h5 className="fw-bold mb-3 d-flex align-items-center">
                    <XCircleFill color="#dc3545" size={24} className="me-2" />
                    วัคซีนที่ไม่สามารถฉีดได้ ({notAllowedVaccines.length} ชนิด)
                </h5>

                {notAllowedVaccines.length === 0 ? (
                    <div className="text-muted text-center p-4 bg-white rounded-4 shadow-sm">ไม่มีข้อห้ามสำหรับวัคซีนใดๆ ในระบบ</div>
                ) : (
                    notAllowedVaccines.map((vac) => (
                        <Card key={vac.id} className="border-0 shadow-sm mb-3 rounded-4 border-start border-danger border-4" style={{ backgroundColor: '#fff5f5' }}>
                            <Card.Body className="p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                                <div>
                                    <h6 className="fw-bold mb-2">{vac.name_th} <span className="text-muted small fw-normal">({vac.name_en})</span></h6>
                                    {/* เหตุผลจาก API จะมาแสดงตรงนี้ */}
                                    <p className="text-danger small mb-0 fw-bold">เหตุผล : <span className="fw-normal">{vac.reason}</span></p>
                                </div>

                                {/* โชว์ Badge สมมติว่ามีระบบนัดหมาย หรือแค่แจ้งเตือน */}
                                <div className="text-md-end">
                                    <Badge bg="secondary" className="p-2 px-3 rounded-pill fw-normal">
                                        ไม่อยู่ในเกณฑ์รับบริการ
                                    </Badge>
                                </div>
                            </Card.Body>
                        </Card>
                    ))
                )}
            </div>
        </Container>
    );
}