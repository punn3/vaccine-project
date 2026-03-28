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
    "Lactation",
    "Traveler"
  ];

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

export default DiseaseCondition;