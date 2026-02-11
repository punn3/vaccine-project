import React from 'react';
import { Row, Col, Form } from "react-bootstrap";

function DiseaseCondition({ index, data, onChange, onRemove }) {
  // รายการโรคทั้งหมด
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

  // ดึงค่าโรคที่เลือกมา (ถ้ายังไม่มีค่า ให้เป็น Array ว่าง [] เสมอ เพื่อกัน Error)
  const selectedDiseases = data.selectedDiseases || [];

  // ฟังก์ชันจัดการการติ๊กเลือก (เพิ่ม/ลบ ออกจาก Array)
  const handleCheckboxChange = (diseaseName) => {
    let newSelected;
    
    if (selectedDiseases.includes(diseaseName)) {
      // ถ้ามีอยู่แล้ว -> เอาออก (Uncheck)
      newSelected = selectedDiseases.filter((d) => d !== diseaseName);
    } else {
      // ถ้ายังไม่มี -> เพิ่มเข้าไป (Check)
      newSelected = [...selectedDiseases, diseaseName];
    }

    // ส่งค่ากลับไปบันทึก
    onChange(index, 'selectedDiseases', newSelected);
  };

  return (
    <div className="p-4 mb-4 rounded border bg-white shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold">เงื่อนไขที่ {index + 1}</h6>
        {index > 0 && (
          <button 
            className="btn btn-sm btn-outline-danger" 
            onClick={() => onRemove(index)}
          >
            ลบ
          </button>
        )}
      </div>

      <Row className="mb-3">
        {diseaseList.map((disease) => {
          // ตรวจสอบสถานะการเลือก (จะได้ true/false เสมอ ไม่ใช่ undefined)
          const isChecked = selectedDiseases.includes(disease);

          return (
            <Col md={6} key={disease} className="mb-2">
              <Form.Check
                inline
                type="checkbox"
                id={`disease-${index}-${disease}`}
                label={disease}
                // ใช้ค่า Boolean ที่คำนวณไว้ กัน Error "uncontrolled input"
                checked={isChecked}
                onChange={() => handleCheckboxChange(disease)}
              />
              
              {/* Logic พิเศษ: ถ้าเลือกโรคไต ให้โชว์ Dropdown ระยะโรคไต */}
              {disease === "Chronic kidney disease" && isChecked && (
                <div className="mt-2 ms-4" style={{ width: '80%' }}>
                    <Form.Select 
                      size="sm"
                      value={data.kidneyStage || ""} // กัน Error ด้วย || ""
                      onChange={(e) => onChange(index, 'kidneyStage', e.target.value)}
                    >
                      <option value="">ระบุระยะโรคไต</option>
                      <option value="1">ระยะที่ 1</option>
                      <option value="2">ระยะที่ 2</option>
                      <option value="3">ระยะที่ 3</option>
                      <option value="4">ระยะที่ 4</option>
                      <option value="5">ระยะที่ 5</option>
                    </Form.Select>
                </div>
              )}
            </Col>
          );
        })}
      </Row>

      <hr />

      {/* ส่วนกรอกข้อมูลด้านล่างของการ์ด */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Label>จำนวนโดส</Form.Label>
          <Form.Control 
            type="number" 
            value={data.dose || ""} // กัน Error ด้วย || ""
            onChange={(e) => onChange(index, 'dose', e.target.value)}
          />
        </Col>
        <Col md={6}>
          <Form.Label>ความถี่ในการฉีด</Form.Label>
          <Form.Select 
            value={data.frequency || ""} // กัน Error ด้วย || ""
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