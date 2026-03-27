import { Row, Col, Form, Button } from "react-bootstrap";

const getStatusColor = (status) => {
  switch (status) {
    case 'Recommended':
      return '#1a7742';
    case 'Optional':
      return '#ffe5a0';
    case 'Recommended with risk-factor':
      return '#0d5bb5';
    case 'Cautious':
      return '#b70f18';
    case 'Share-decision':
      return '#bfe2f8';
    case 'No specific':
      return '#e9e9e9';
    default:
      return '#000000';
  }
};

function AgeCondition({ index, data, onChange, onRemove }) {
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
          <Form.Label>อายุเริ่มต้น (ปี)</Form.Label>
          <Form.Control
            type="number"
            value={data.minAge || ""}
            onChange={(e) => onChange(index, 'minAge', e.target.value)}
          />
        </Col>
        <Col md={6}>
          <Form.Label>อายุสูงสุด (ปี)</Form.Label>
          <Form.Control
            type="number"
            value={data.maxAge || ""}
            onChange={(e) => onChange(index, 'maxAge', e.target.value)}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Label>ระดับการเเนะนำ</Form.Label>
          <Form.Select
            value={data.status || ""}
            onChange={(e) => onChange(index, 'status', e.target.value)}
            style={{
              color: getStatusColor(data.status),
              backgroundColor: '#ffffff'
            }}
          >
            <option value="" style={{ color: "#000" }}>เลือกระดับการเเนะนำ</option>
            <option value="Recommended" style={{ color: "#1a7742" }}>⬤ Recommended</option>
            <option value="Optional" style={{ color: "#68501c" }}>⬤ Optional</option>
            <option value="Recommended with risk-factor" style={{ color: "#0d5bb5" }}>⬤ Recommended with risk-factor</option>
            <option value="Cautious" style={{ color: "#b70f18" }}>⬤ Cautious</option>
            <option value="Share-decision" style={{ color: "#165e99" }}>⬤ Share-decision</option>
            <option value="No specific" style={{ color: "#333333" }}>⬤ No specific</option>
          </Form.Select>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Label>จำนวนโดส</Form.Label>
          <Form.Control
            type="number"
            value={data.dose || ""}
            onChange={(e) => onChange(index, 'dose', e.target.value)}
          />
        </Col>
        <Col md={6}>
          <Form.Label>ความถี่ในการฉีด</Form.Label>
          <Form.Select
            value={data.frequency || ""}
            onChange={(e) => onChange(index, 'frequency', e.target.value)}
          >
            <option value="">เลือกความถี่</option>
            <option value="-">-</option>
            <option value="ครั้งเดียว">ครั้งเดียว</option>
            <option value="ปีละ 1 เข็ม">ปีละ 1 เข็ม</option>
            <option value="กระตุ้นทุก 10 ปี">กระตุ้นทุก 10 ปี</option>
            <option value="ห่าง 7 วัน">ห่าง 7 วัน</option>
            <option value="ห่าง 4 สัปดาห์">ห่าง 4 สัปดาห์</option>
            <option value="ห่าง 4-8 สัปดาห์">ห่าง 4-8 สัปดาห์</option>
            <option value="ห่าง 8 สัปดาห์">ห่าง 8 สัปดาห์</option>
            <option value="ห่าง 1-2 เดือน">ห่าง 1-2 เดือน</option>
            <option value="ห่าง 2-6 เดือน">ห่าง 2-6 เดือน</option>
            <option value="ห่าง 6 เดือน">ห่าง 6 เดือน</option>
            <option value="ห่าง 0, 3 เดือน">ห่าง 0, 3 เดือน</option>
            <option value="ห่าง 0, 1, 6 เดือน">ห่าง 0, 1, 6 เดือน</option>
            <option value="ห่าง 0, 1-2, 6 เดือน">ห่าง 0, 1-2, 6 เดือน</option>
            <option value="ห่าง 0, 1, 2, 6 เดือน">ห่าง 0, 1, 2, 6 เดือน</option>
            <option value="ห่าง 7-28 วัน และ 1 ปี">ห่าง 7-28 วัน และ 1 ปี</option>
            <option value="ห่าง 1-2 เดือน หรือ 2-6 เดือน">ห่าง 1-2 เดือน หรือ 2-6 เดือน</option>
            <option value="ทุกท้อง 12 - 20 สัปดาห์">ทุกท้อง 12 - 20 สัปดาห์</option>
            <option value="ทุกท้อง 20 - 32 สัปดาห์">ทุกท้อง 20 - 32 สัปดาห์</option>
            <option value="ทุกท้อง 24 - 36 สัปดาห์">ทุกท้อง 24 - 36 สัปดาห์</option>
          </Form.Select>
        </Col>
      </Row>
    </div>
  );
}

export default AgeCondition;