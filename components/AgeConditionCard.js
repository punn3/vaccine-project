import { Row, Col, Form, Button } from "react-bootstrap";

function AgeCondition({ index, data, onChange, onRemove }) {
  return (
    <div className="p-3 mb-3 rounded" style={{ backgroundColor: "#f8f9fa", border: "1px solid #eee" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0">เงื่อนไขที่ {index + 1}</h6>
        {index > 0 && ( // ให้ลบได้ตั้งแต่เงื่อนไขที่ 2 เป็นต้นไป
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
            <option value="ครั้งเดียว">ครั้งเดียว</option>
            <option value="ปีละ 1 เข็ม">ปีละ 1 เข็ม</option>
            <option value="กระตุ้นทุก 10 ปี">กระตุ้นทุก 10 ปี</option>
            <option value="ห่าง 0, 1, 6 เดือน">ห่าง 0, 1, 6 เดือน</option>
            <option value="ห่าง 0, 1, 2, 6 เดือน">ห่าง 0, 1, 2, 6 เดือน</option>
            <option value="ห่าง 0, 3 เดือน">ห่าง 0, 3 เดือน</option>
            <option value="ห่าง 4 สัปดาห์">ห่าง 4 สัปดาห์</option>
            <option value="ห่าง 4 - 8 สัปดาห์">ห่าง 4 - 8 สัปดาห์</option>
          </Form.Select>
        </Col>
      </Row>
    </div>
  );
}

export default AgeCondition;