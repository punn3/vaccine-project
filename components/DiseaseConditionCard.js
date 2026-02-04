import { Row, Col, Form } from "react-bootstrap";

function DiseaseCondition({ index, data, onChange, onRemove }) {
  // รายการโรค (ดึงมาจากรูปภาพที่คุณส่งมา)
  const diseaseList = [
    "Heart disease, diabetes or chronic lung disease",
    "Chronic liver disease",
    "CD4 < 200",
    "Post-tramised",
    "Healthcare personnel",
    "Chronic kidney disease",
    "Asplenia",
    "Immunocompromised",
    "Pregnancy",
    "Traveler"
  ];

  return (
    <div className="p-4 mb-4 rounded border bg-white shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold">เงื่อนไขที่ {index + 1}</h6>
        {index > 0 && (
          <button className="btn btn-sm btn-outline-danger" onClick={() => onRemove(index)}>ลบ</button>
        )}
      </div>

      <Row className="mb-3">
        {diseaseList.map((disease) => (
          <Col md={6} key={disease} className="mb-2">
            <Form.Check
              type="radio"
              // name ต้องไม่ซ้ำกันในแต่ละการ์ด (index) เพื่อให้แยกกลุ่มการเลือก
              name={`disease-group-${index}`} 
              label={disease}
              id={`disease-${index}-${disease}`}
              checked={data.selectedDisease === disease}
              onChange={() => onChange(index, 'selectedDisease', disease)}
            />
            
            {/* Logic พิเศษ: ถ้าเลือกโรคไต ให้โชว์ Dropdown ระยะโรคไต */}
            {disease === "Chronic kidney disease" && data.selectedDisease === disease && (
              <Form.Select 
                className="mt-2 ms-4" 
                style={{ width: '80%' }}
                value={data.kidneyStage}
                onChange={(e) => onChange(index, 'kidneyStage', e.target.value)}
              >
                <option value="">ระบุระยะโรคไต</option>
                <option value="1">ระยะที่ 1</option>
                <option value="2">ระยะที่ 2</option>
                <option value="3">ระยะที่ 3</option>
              </Form.Select>
            )}
          </Col>
        ))}
      </Row>

      <hr />

      {/* ส่วนกรอกข้อมูลด้านล่างของการ์ด */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Label>จำนวนโดส</Form.Label>
          <Form.Control 
            type="number" 
            value={data.dose}
            onChange={(e) => onChange(index, 'dose', e.target.value)}
          />
        </Col>
        <Col md={6}>
          <Form.Label>ความถี่ในการฉีด</Form.Label>
          <Form.Select 
            value={data.frequency}
            onChange={(e) => onChange(index, 'frequency', e.target.value)}
          >
            <option value="">เลือกความถี่</option>
            <option value="one-time">ครั้งเดียว</option>
            <option value="0,1,6">0,1,6</option>
            <option value="0,1,2,6">0,1,2,6</option>
            <option value="0,3">0,3</option>
            <option value="everyYear">ทุกปี</option>
            <option value="every 10 year">ทุก 10 ปี</option>
          </Form.Select>
        </Col>
      </Row>
    </div>
  );
}

export default DiseaseCondition;