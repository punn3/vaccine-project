"use client";
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation'; 
import { Container, Card, Row, Col, Form, Collapse, Badge } from 'react-bootstrap';
import { CheckCircleFill, XCircleFill, ChevronDown, ChevronUp, InfoCircle } from 'react-bootstrap-icons';

const STATUS_PRIORITY = {
    'Recommended with risk-factor': 1,
    'Recommended': 2,
    'Optional': 3,
    'Share-decision': 4,
    'Cautious': 5,
    'No specific': 6
};

export default function AnalysisResult() {
    const router = useRouter();

    const [allowedVaccines, setAllowedVaccines] = useState([]);
    const [notAllowedVaccines, setNotAllowedVaccines] = useState([]);

    const [selectedVaccines, setSelectedVaccines] = useState([]); 
    const [expandedId, setExpandedId] = useState(null); 

    const getStatusBadgeStyle = (status) => {
        switch (status) {
            case 'Recommended':
                return { backgroundColor: '#1a7742', color: '#ffffff', border: '1px solid #1a7742' };
            case 'Optional':
                return { backgroundColor: '#ffe5a0', color: '#68501c', border: '1px solid #ffe5a0' };
            case 'Recommended with risk-factor':
                return { backgroundColor: '#0d5bb5', color: '#ffffff', border: '1px solid #0d5bb5' };
            case 'Cautious':
                return { backgroundColor: '#b70f18', color: '#ffd6d6', border: '1px solid #b70f18' };
            case 'Share-decision':
                return { backgroundColor: '#bfe2f8', color: '#165e99', border: '1px solid #bfe2f8' };
            case 'No specific':
                return { backgroundColor: '#e9e9e9', color: '#333333', border: '1px solid #e9e9e9' };
            default:
                return { backgroundColor: '#6c757d', color: '#ffffff' };
        }
    };

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const savedData = localStorage.getItem("vaccineFormData");
                if (!savedData) {
                    alert("ไม่พบข้อมูลการกรอก กรุณากรอกข้อมูลใหม่");
                    router.push('/form');
                    return;
                }

                const rawData = JSON.parse(savedData);

                // ✨ แก้ไขจุดนี้: ปั้นข้อมูลโรคใหม่ให้ตรงกับฐานข้อมูลเป๊ะๆ
                const selectedDiseases = [];
                const d = rawData.disease;

                if (d.heart_disease) selectedDiseases.push(d.heart_disease);
                if (d.chronic_liver) selectedDiseases.push(d.chronic_liver);
                if (d.asplenia) selectedDiseases.push(d.asplenia);
                if (d.cd4) selectedDiseases.push(d.cd4);
                
                // สังเกตว่าใน DB คุณพิมพ์ Immunocom เฉยๆ เราเลยบังคับให้ตรงกัน
                if (d.immunocon) selectedDiseases.push("Immunocom"); 
                if (d.post_tramised) selectedDiseases.push(d.post_tramised);

                // ✨ ประกอบร่างโรคไต
                if (d.chronic_kidney) {
                    selectedDiseases.push(`Chronic kidney disease ระยะที่ ${d.kidney_stage}`);
                }

                if (d.disease_selected && d.disease_selected !== "ไม่มีโรคประจำตัว") {
                    selectedDiseases.push(d.disease_selected);
                }

                let is_pregnant = false;
                let gestational_weeks = null;

                if (rawData.basic.pregnant === "ตั้งครรภ์") {
                    is_pregnant = true;
                    if (rawData.basic.gestational_weeks) {
                        gestational_weeks = parseInt(rawData.basic.gestational_weeks);
                    }
                }

                const allergiesObj = {};
                if (rawData.allergy && rawData.allergy.foodList) {
                    rawData.allergy.foodList.forEach(item => {
                        if (item === "ไข่") allergiesObj["ไข่ไก่"] = true;
                        else if (item === "นม") allergiesObj["นมวัว"] = true;
                        else allergiesObj[item] = true;
                    });
                }
                if (rawData.allergy && rawData.allergy.drugAndVaccineList) {
                    rawData.allergy.drugAndVaccineList.forEach(item => {
                        allergiesObj[item] = true;
                    });
                }

                let history = [];
                if (rawData.vaccines && rawData.vaccines.received) {
                    history = rawData.vaccines.received
                        .filter(item => item.vaccine !== "" && item.date !== "")
                        .map(item => ({
                            vaccine_name_en: item.vaccine,
                            date_received: item.date
                        }));
                }

                let wantedVaccines = [];
                if (rawData.vaccines && rawData.vaccines.want_type === "yes" && rawData.vaccines.selected) {
                    wantedVaccines = rawData.vaccines.selected.filter(v => v !== "");
                }

                const payload = {
                    age: parseInt(rawData.basic.age) || 0,
                    is_pregnant: is_pregnant,
                    gestational_weeks: gestational_weeks,
                    is_med_personnel: rawData.basic.medical === "เป็น",
                    diseases: selectedDiseases, // ส่งตัวที่เราปั้นใหม่ไปแทน
                    allergies: allergiesObj,
                    history: history,
                    wanted_vaccines: wantedVaccines
                };

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

    const sortedAllowedVaccines = useMemo(() => {
        if (!allowedVaccines || allowedVaccines.length === 0) return [];

        return [...allowedVaccines].sort((a, b) => {
            const priorityA = STATUS_PRIORITY[a.matchStatus] || 99;
            const priorityB = STATUS_PRIORITY[b.matchStatus] || 99;
            return priorityA - priorityB;
        });
    }, [allowedVaccines]);

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

    useEffect(() => {
        const fullSelectedVaccinesData = allowedVaccines.filter(vac =>
            selectedVaccines.includes(vac.id)
        );
        localStorage.setItem("selectedVaccinesForDetails", JSON.stringify(fullSelectedVaccinesData));
    }, [selectedVaccines, allowedVaccines]);


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

                {sortedAllowedVaccines.length === 0 ? (
                    <div className="text-muted text-center p-4 bg-white rounded-4 shadow-sm">ไม่มีวัคซีนที่เข้าเกณฑ์ของคุณในขณะนี้</div>
                ) : (
                    sortedAllowedVaccines.map((vac) => (
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
                                        </p>

                                        <div className="bg-light p-3 rounded-3 mb-3">
                                            <p className="fw-bold small mb-2"><InfoCircle className="me-1" /> การบริหารวัคซีน</p>
                                            <Row className="small text-center text-md-start">
                                                <Col xs={4} md={4}>
                                                    <span className="text-muted d-block" style={{ fontSize: '0.8rem' }}>ขนาด</span>
                                                    {vac.dosage_ml || '-'}
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

                                        <div className="mt-3">
                                            {(vac.reason || vac.matchStatus) && (
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <p className="small text-success fw-bold mb-0 d-flex align-items-center">
                                                        <CheckCircleFill className="me-2" size={14} />
                                                        เข้าเกณฑ์แนะนำสำหรับ :
                                                    </p>

                                                    {vac.matchStatus && (
                                                        <span
                                                            className="px-3 py-1 rounded-pill shadow-sm"
                                                            style={{
                                                                fontSize: '0.75rem',
                                                                fontWeight: 'bold',
                                                                whiteSpace: 'nowrap',
                                                                ...getStatusBadgeStyle(vac.matchStatus)
                                                            }}
                                                        >
                                                            {vac.matchStatus}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {vac.reason && (
                                                <ul className="mb-0 ps-4">
                                                    {vac.reason.split('|').map((text, index) => (
                                                        <li key={index} className="small text-success mb-1" style={{ lineHeight: '1.4' }}>
                                                            {text.trim()}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>

                                        <div
                                            className="text-primary small fw-bold user-select-none mt-2"
                                            style={{ cursor: 'pointer', display: 'inline-block' }}
                                            onClick={() => toggleExpand(vac.id)}
                                        >
                                            ดูผลข้างเคียง ข้อห้ามใช้ และข้อควรระวัง {expandedId === vac.id ? <ChevronUp className="ms-1" /> : <ChevronDown className="ms-1" />}
                                        </div>
                                        <Collapse in={expandedId === vac.id}>
                                            <div className="mt-2 text-danger small bg-danger bg-opacity-10 p-3 rounded-3 border border-danger border-opacity-25">
                                                {vac.side_effects ? (
                                                    <div className="mb-0">
                                                        {vac.side_effects.split('\n').map((line, index) => {
                                                            if (line.trim() !== "") {
                                                                return (
                                                                    <div key={index} className="mb-1" style={{ lineHeight: '1.5' }}>
                                                                        {line}
                                                                    </div>
                                                                );
                                                            }
                                                            return null;
                                                        })}
                                                    </div>
                                                ) : (
                                                    <span>ไม่มีระบุข้อมูลผลข้างเคียง ข้อห้ามใช้ และข้อควรระวัง</span>
                                                )}
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
                            <Card.Body className="p-4">
                                <div className="d-flex justify-content-between align-items-start w-100">
                                    <h6 className="fw-bold mb-0 pe-3">
                                        {vac.name_th} <span className="text-muted small fw-normal">({vac.name_en})</span>
                                    </h6>
                                    <div className="flex-shrink-0 text-end">
                                        <Badge bg="secondary" className="p-2 px-3 rounded-pill fw-normal">
                                            ไม่อยู่ในเกณฑ์รับบริการ
                                        </Badge>
                                    </div>
                                </div>
                                {vac.reason && (
                                    <div className="mt-3 w-100">
                                        <p className="text-danger small mb-1 fw-bold">เหตุผล :</p>
                                        <ul className="mb-0 ps-4">
                                            {vac.reason.split('|').map((text, index) => (
                                                <li key={index} className="small text-danger mb-1" style={{ lineHeight: '1.4' }}>
                                                    {text.trim()}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    ))
                )}
            </div>
        </Container>
    );
}