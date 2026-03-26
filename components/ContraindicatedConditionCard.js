import { Row, Col, Form, Button } from "react-bootstrap";

function ContraindicatedCondition({ index, data, onChange, onRemove, vaccineList = [] }) {
    return (
        <div className="p-3 mb-3 rounded" style={{ backgroundColor: "#f8f9fa", border: "1px solid #eee" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">เงื่อนไขที่ {index + 1}</h6>
                {index > 0 && (
                    <Button variant="outline-danger" size="sm" onClick={() => onRemove(index)}>ลบ</Button>
                )}
            </div>

            <Row className="mb-3">
                <Col md={6}>
                    <Form.Label>ชื่อวัคซีนที่ไม่สามารถฉีดร่วมได้</Form.Label>
                    <Form.Select
                        value={data.contraindicated_vaccine || ""}
                        onChange={(e) => onChange(index, 'contraindicated_vaccine', e.target.value)}
                    >
                        <option value="">เลือกวัคซีน</option>
                        {vaccineList.map((vac) => (
                            <option key={vac.id} value={vac.name_th}>
                                {vac.name_th} {vac.trade_name ? `(${vac.trade_name})` : ""}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={6}>
                    <Form.Label>ระยะห่าง</Form.Label>
                    <Form.Select
                        value={data.interval_desc || ""}
                        onChange={(e) => onChange(index, 'interval_desc', e.target.value)}
                    >
                        <option value="">เลือกระยะห่าง</option>
                        <option value="1 เดือน">1 เดือน</option>
                        <option value="2 เดือน">2 เดือน</option>
                        <option value="3 เดือน">3 เดือน</option>
                        <option value="6 เดือน">6 เดือน</option>
                        <option value="1 ปี">1 ปี</option>
                    </Form.Select>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <Form.Label>คำแนะนำเพิ่มเติม</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="ระบุคำแนะนำเพิ่มเติม..."
                        value={data.detail || ""}
                        onChange={(e) => onChange(index, 'detail', e.target.value)}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default ContraindicatedCondition;