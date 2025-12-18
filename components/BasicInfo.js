"use client";
import {
  Accordion,
  Button,
  Form,
  Col,
  Row,
  InputGroup,
  FloatingLabel,
} from "react-bootstrap";
import styles from "../styles/BasicInfo.module.css";
import { useState, useEffect } from "react";

function BasicInfo() {
  const [formData, setFormData] = useState({
    basic: {
      age: "",
      gender: "",
      pregnant: "",
      medical: "",
    },
    travel: {
      travel_status: "",
      travel_selected: "none",
    },
    disease: {
      heart_disease: "",
      chronic_kidney: "",
      chronic_liver: "",
      asplenia: "",
      cd4: "",
      immunocon: "",
      post_tramised: "",
      disease_selected_none: "",
    },
  });

  //โหลดข้อมูล
  useEffect(() => {
    const savedData = localStorage.getItem("vaccineFormData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  //เช็คข้อมูลการเปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem("vaccineFormData", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (section, e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: type === "checkbox" ? (checked ? value : "") : value,
      },
    }));
  };

  return (
    <div className={styles.accordionWrapper}>
      <Accordion defaultActiveKey="0" alwaysOpen className="my-5">
        {/* ข้อมูลพื้นฐาน  */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>ข้อมูลพื้นฐาน</Accordion.Header>
          <Accordion.Body>
            <Row className="row-gap-4">
              <Col md={6}>
                <Form>
                  <Form.Label>อายุ *</Form.Label>
                  <Form.Control
                    name="age"
                    type="number"
                    placeholder="ปี"
                    value={formData.basic.age}
                    onChange={(e) => handleChange("basic", e)}
                  />
                </Form>
              </Col>
              <Col md={6}>
                <Form className={styles.genderbox}>
                  <label className="mb-2">เพศสภาพ *</label>
                  <select
                    id="gender"
                    name="gender"
                    className={styles.genderselect}
                    value={formData.basic.gender}
                    onChange={(e) => handleChange("basic", e)}
                  >
                    <option>เลือกเพศ</option>
                    <option value="ชาย">ชาย</option>
                    <option value="หญิง">หญิง</option>
                    <option value="ไม่ระบุ">ไม่ระบุ</option>
                  </select>
                </Form>
              </Col>
              <Col md={6}>
                <Form className={styles.pregnantbox}>
                  <label className="mb-2">การตั้งครรภ์ *</label>
                  <select
                    id="pregnant"
                    name="pregnant"
                    value={formData.basic.pregnant}
                    className={styles.pregnantselect}
                    onChange={(e) => handleChange("basic", e)}
                    
                  >
                    <option value="">กรุณาระบุข้อมูล</option>
                    <option value="ไม่ตั้งครรภ์">ไม่ตั้งครรภ์</option>
                    <option value="ให้นมบุตร">ให้นมบุตร</option>
                    <optgroup label="ตั้งครรภ์">
                      <option value="12-14 สัปดาห์">12-14 สัปดาห์</option>
                      <option value="14-27 สัปดาห์">14-27 สัปดาห์</option>
                      <option value="27-36 สัปดาห์">27-36 สัปดาห์</option>
                    </optgroup>
                  </select>
                </Form>
              </Col>
              <Col md={6} className="align-content-center">
                <Form>
                  <Form.Check
                    inline
                    type="checkbox"
                    label="บุคลากรทางการแพทย์"
                    name="medical"
                    value="เป็น"
                    checked={formData.basic.medical !== ""}
                    onChange={(e) => handleChange("basic", e)}
                  />
                </Form>
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
        {/* การเดินทาง */}
        <Accordion.Item eventKey="1">
          <Accordion.Header>การเดินทาง</Accordion.Header>
          <Accordion.Body>
            <Form>
              <Row>
                <Col md={6} className={`row-gap-3 ${styles.travelchoice}`}>
                  <Form.Check
                    inline
                    label="มีความประสงค์จะเดินทาง"
                    value="travel"
                    name="travel_status"
                    type="radio"
                    id="travel-yes"
                    onChange={(e) => handleChange("travel", e)}
                    checked={formData.travel.travel_status === "travel"}
                  />
                  <select
                    name="travel_selected"
                    value={formData.travel.travel_selected}
                    onChange={(e) => handleChange("travel", e)}
                    disabled={formData.travel.travel_status !== "travel"}
                  >
                    <option>เลือกวัคซีนที่ต้องการ</option>
                    <option value="วัคซีนไทฟอยด์">วัคซีนไทฟอยด์</option>
                    <option value="วัคซีนอหิวาตกโรค">วัคซีนอหิวาตกโรค</option>
                    <option value="วัคซีนพิษสุนัขบ้า">วัคซีนพิษสุนัขบ้า</option>
                    <option value="วัคซีนไวรัสตับอักเสบเอ">
                      วัคซีนไวรัสตับอักเสบเอ
                    </option>
                    <option value="วัคซีนไข้กาฬหลังแอ่น">
                      วัคซีนไข้กาฬหลังแอ่น
                    </option>
                    <option value="วัคซีนไขสมองอักเสบจากเห็บ">
                      วัคซีนไขสมองอักเสบจากเห็บ
                    </option>
                  </select>
                </Col>
                <Col md={6}>
                  <Form.Check
                    inline
                    label="ไม่มี"
                    value="none"
                    name="travel_status"
                    type="radio"
                    id="travel-no"
                    checked={formData.travel.travel_status === "none"}
                    onChange={(e) => handleChange("travel", e)}
                    
                  />
                </Col>
              </Row>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
        {/* โรคประจำตัว */}
        <Accordion.Item eventKey="2">
          <Accordion.Header>โรคประจำตัว</Accordion.Header>
          <Accordion.Body>
            <Row className="row-gap-4">
              <Col md={6}>
                  <Form.Check
                  inline
                  type="checkbox"
                  label="Heart disease, diabetes or chronic lung disease"
                  name="heart_disease" 
                  value="Heart disease, diabetes or chronic lung disease" 
                  checked={formData.disease.heart_disease !== ""} 
                  onChange={(e) => handleChange("disease", e)}
                />
              </Col>
              <Col md={6} className="align-content-center">
                <Form>
                  <Form.Check
                  inline
                  type="checkbox"
                  label="Chronic kidney disease"
                  name="chronic_kidney"
                  value="Chronic kidney disease"
                  checked={formData.disease.chronic_kidney !== ""}
                  onChange={(e) => handleChange("disease", e)}
                />
                <select className="form-select mt-1" disabled={formData.disease.chronic_kidney === ""}>
                  <option value="state1">ระยะที่ 1</option>
                  <option value="state2">ระยะที่ 2</option>
                  <option value="state3">ระยะที่ 3</option>
                  <option value="state4">ระยะที่ 4</option>
                  <option value="state5">ระยะที่ 5</option>
                </select>
                </Form>
              </Col>
              <Col md={6} className="align-content-center">
                <Form>
                  {["checkbox"].map((type) => (
                    <div key={`inline-${type}`}>
                      <Form.Check
                        inline
                        label="Chronic liver disease"
                        value={formData.disease.chronic_liver}
                        onChange={(e) => handleChange("disease", e)}
                        name="group1"
                        type={type}
                        id={`inline-${type}-1`}
                      />
                    </div>
                  ))}
                </Form>
              </Col>
              <Col md={6} className="align-content-center">
                <Form.Check
                  inline
                  type="checkbox"
                  label="Chronic liver disease"
                  name="chronic_liver"
                  value="Chronic liver disease"
                  checked={formData.disease.chronic_liver !== ""}
                  onChange={(e) => handleChange("disease", e)}
                />
              </Col>
              <Col md={6} className="align-content-center">
                <Form.Check
                  inline
                  type="checkbox"
                  label="Asplenia"
                  name="asplenia"
                  value="Asplenia"
                  checked={formData.disease.asplenia !== ""}
                  onChange={(e) => handleChange("disease", e)}
                />
              </Col>
              <Col md={6} className="align-content-center">
                <Form.Check
                  inline
                  type="checkbox"
                  label="CD4 < 200"
                  name="cd4"
                  value="CD4 < 200"
                  checked={formData.disease.cd4 !== ""}
                  onChange={(e) => handleChange("disease", e)}
                />
              </Col>
              <Col md={6} className="align-content-center">
                <Form.Check
                  inline
                  type="checkbox"
                  label="Immunocompromised"
                  name="immunocon"
                  value="Immunocompromised"
                  checked={formData.disease.immunocon !== ""}
                  onChange={(e) => handleChange("disease", e)}
                />
              </Col>
              <Col md={6} className="align-content-center">
                <Form.Check
                  inline
                  type="checkbox"
                  label="Post-tramised"
                  name="post_tramised"
                  value="Post-tramised"
                  checked={formData.disease.post_tramised !== ""}
                  onChange={(e) => handleChange("disease", e)}
                />
              </Col>
              <Col md={6} className="align-content-center">
                <Form.Check
                  inline
                  type="checkbox"
                  label="ไม่มี"
                  name="disease_selected_none"
                  value="ไม่มีโรคประจำตัว"
                  checked={formData.disease.disease_selected_none !== ""}
                  onChange={(e) => handleChange("disease", e)}
                />
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
        {/* การรับวัคซีน */}
        <Accordion.Item eventKey="3">
          <Accordion.Header>การรับวัคซีน</Accordion.Header>
          <Accordion.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Accordion.Body>
        </Accordion.Item>
        {/* ประวัติการแพ้ */}
        <Accordion.Item eventKey="4">
          <Accordion.Header>ประวัติการแพ้อาหาร ยา และวัคซีน</Accordion.Header>
          <Accordion.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* <button onClick={() => console.log(formData)}>click</button> */}
    </div>
  );
}

export default BasicInfo;
