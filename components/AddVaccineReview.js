import React from "react";
import { Modal, Button, Container, Row, Col } from "react-bootstrap";

export default function VaccineReviewModal({ 
    show, 
    onHide, 
    onConfirm, 
    data, 
    previewImage 
}) {
    // ดึงตัวแปรออกจาก data เพื่อให้เขียนสั้นลง
    const { formData, ageConditions, diseaseConditions, allergies } = data;

    if (!data) return null;
    
    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton className="bg-light">
                <Modal.Title className="fw-bold">ตรวจสอบความถูกต้อง</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <Container>
                    {/* 1. รูปภาพ */}
                    <Row className="mb-3 text-center">
                        <Col>
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    style={{ maxHeight: "150px", borderRadius: "8px" }}
                                />
                            ) : (
                                <div className="text-muted fst-italic">- ไม่มีรูปภาพ -</div>
                            )}
                        </Col>
                    </Row>

                    {/* 2. ข้อมูลทั่วไป */}
                    <h6 className="fw-bold text-primary">ข้อมูลทั่วไป</h6>
                    <table className="table table-bordered table-sm">
                        <tbody>
                            <tr><th style={{ width: "30%" }}>ชื่อวัคซีน</th><td>{formData.name_th}</td></tr>
                            <tr><th>ชื่อภาษาอังกฤษ</th><td>{formData.name_en || "-"}</td></tr>
                            <tr><th>ชื่อการค้า</th><td>{formData.trade_name || "-"}</td></tr>
                            <tr><th>ประเภท</th><td>{formData.vaccine_type || "-"}</td></tr>
                            <tr><th>ราคา</th><td>{formData.price} บาท</td></tr>
                            <tr><th>ขนาด/ตำแหน่ง</th><td>{formData.dosage_ml} ml / {formData.admin_route}</td></tr>
                            <tr><th>สถานะ</th><td className={formData.is_available ? "text-success" : "text-danger"}>{formData.is_available ? "มีจำหน่าย" : "ไม่พร้อมจำหน่าย"}</td></tr>
                        </tbody>
                    </table>

                    {/* --- ส่วนที่ 3: เงื่อนไขอายุ --- */}
                    <h6 className="fw-bold text-primary border-bottom pb-2">2. เงื่อนไขอายุ</h6>
                    {ageConditions && ageConditions.length > 0 && ageConditions[0].minAge ? (
                        <ul className="list-group mb-4">
                            {ageConditions.map((ac, i) => (
                                <li key={i} className="list-group-item">
                                    <strong>ช่วงอายุ {ac.minAge} - {ac.maxAge} ปี</strong> 
                                    <span className="text-muted ms-2">(ปริมาณ: {ac.dose}, ความถี่: {ac.frequency})</span>
                                    {ac.detail && <div className="small text-secondary mt-1">Note: {ac.detail}</div>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted small mb-4">- ไม่มีการระบุเงื่อนไขอายุ -</p>
                    )}

                    {/* --- ส่วนที่ 4: เงื่อนไขโรคประจำตัว (เพิ่มส่วนนี้เข้าไปครับ) --- */}
                    <h6 className="fw-bold text-primary border-bottom pb-2">3. เงื่อนไขโรคประจำตัว</h6>
                    {diseaseConditions && diseaseConditions.length > 0 && diseaseConditions[0].selectedDisease ? (
                        <ul className="list-group mb-4">
                            {diseaseConditions.map((dc, i) => (
                                <li key={i} className="list-group-item">
                                    <strong>โรค: {dc.selectedDisease}</strong> {dc.kidneyStage && `(ระยะที่ ${dc.kidneyStage})`}
                                    <div className="small text-muted">
                                        คำแนะนำ: {dc.recommendation || "-"} <br/>
                                        ปริมาณ: {dc.dose} | ความถี่: {dc.frequency}
                                    </div>
                                    {dc.detail && <div className="small text-danger mt-1">เพิ่มเติม: {dc.detail}</div>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted small mb-4">- ไม่มีการระบุเงื่อนไขโรค -</p>
                    )}

                    {/* --- ส่วนที่ 5: ข้อมูลการแพ้ --- */}
                    <h6 className="fw-bold text-primary border-bottom pb-2">4. ข้อมูลการแพ้</h6>
                    <div className="mb-4">
                        <div className="d-flex flex-wrap gap-2">
                            {allergies && Object.entries(allergies).filter(([_, v]) => v).length > 0 ? (
                                Object.entries(allergies).map(([key, value]) =>
                                    value && (
                                        <span key={key} className="badge bg-danger p-2" style={{fontSize: '0.9em'}}>
                                            {key === 'egg' ? 'แพ้ไข่' : 
                                             key === 'milk' ? 'แพ้นม' : 
                                             key === 'gelatin' ? 'แพ้เจลาติน' : 
                                             key === 'yeast' ? 'แพ้ยีสต์' : key}
                                        </span>
                                    )
                                )
                            ) : (
                                <span className="text-muted small">- ไม่มีการระบุการแพ้ -</span>
                            )}
                        </div>
                    </div>

                    {/* --- ส่วนที่ 6: ผลข้างเคียง (เพิ่มส่วนนี้เข้าไปครับ) --- */}
                    <h6 className="fw-bold text-primary border-bottom pb-2">5. ผลข้างเคียง / ข้อควรระวัง</h6>
                    <div className="p-3 bg-light rounded border mb-3">
                        {formData.side_effects ? (
                            <p className="mb-0" style={{ whiteSpace: "pre-line" }}>{formData.side_effects}</p>
                        ) : (
                            <span className="text-muted fst-italic">- ไม่มีการระบุ -</span>
                        )}
                    </div>

                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    แก้ไขข้อมูล
                </Button>
                <Button variant="success" onClick={onConfirm}>
                    ยืนยันและบันทึก
                </Button>
            </Modal.Footer>
        </Modal>
    );
}