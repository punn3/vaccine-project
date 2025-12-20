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
      disease_selected: "",
    },
  });

  const [selectedVaccines, setSelectedVaccines] = useState([""]);

  const [receivedVaccines, setReceivedVaccines] = useState([
    { vaccine: "", date: "" },
  ]);

  const [allergy, setAllergy] = useState({
    none: false,
    food: false,
    drugAndVaccine: false,
    foodList: [],
    drugAndVaccineList: [],
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

  //เพิ่มวัคซีนที่ต้องการฉีด
  const addVaccine = () => {
    setSelectedVaccines([...selectedVaccines, ""]);
  };

  //ลบวัคซีนที่ต้องการฉีด
  const removeVaccine = (index) => {
    setSelectedVaccines(selectedVaccines.filter((_, i) => i !== index));
  };

  const handleVaccineChange = (index, value) => {
    const updated = [...selectedVaccines];
    updated[index] = value;
    setSelectedVaccines(updated);
  };

  //เพิ่มวัคซีนที่เคยได้รับ
  const addReceivedVaccine = () => {
    setReceivedVaccines([...receivedVaccines, { vaccine: "", date: "" }]);
  };

  //ลบวัคซีนที่เคยได้รับ
  const removeReceivedVaccine = (index) => {
    setReceivedVaccines(receivedVaccines.filter((_, i) => i !== index));
  };

  const handleAllergyCheck = (name) => {
    setAllergy((prev) => {
      if (name === "none") {
        return {
          none: !prev.none,
          food: false,
          drugAndVaccine: false,
          foodList: [],
          drugAndVaccineList: [],
        };
      }
      return {
        ...prev,
        none: false,
        [name]: !prev[name],
      };
    });
  };

  const handleFoodChange = (value) => {
    setAllergy((prev) => ({
      ...prev,
      foodList: prev.foodList.includes(value)
        ? prev.foodList.filter((v) => v !== value)
        : [...prev.foodList, value],
    }));
  };

  const handleDrugAndVaccineChange = (value) => {
    setAllergy((prev) => ({
      ...prev,
      drugAndVaccineList: prev.drugAndVaccineList.includes(value)
        ? prev.drugAndVaccineList.filter((v) => v !== value)
        : [...prev.drugAndVaccineList, value],
    }));
  }

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
                  <Form.Select
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
                  </Form.Select>
                </Form>
              </Col>
              <Col md={6}>
                <Form className={styles.pregnantbox}>
                  <label className="mb-2">การตั้งครรภ์ *</label>
                  <Form.Select
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
                  </Form.Select>
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
                  <Form.Select
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
                  </Form.Select>
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
                  <Form.Select className="form-select mt-1" 
                  name="disease_selected"
                  value={formData.disease.disease_selected}
                  onChange={(e) => handleChange("disease", e)}
                  disabled={formData.disease.chronic_kidney === ""}>
                    <option value="">ระยะโรคไต</option>
                    <option value="ระยะที่ 1">ระยะที่ 1</option>
                    <option value="ระยะที่ 2">ระยะที่ 2</option>
                    <option value="ระยะที่ 3">ระยะที่ 3</option>
                    <option value="ระยะที่ 4">ระยะที่ 4</option>
                    <option value="ระยะที่ 5">ระยะที่ 5</option>
                  </Form.Select>
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
            <Form>
              {["radio"].map((type) => (
                <div key={`inline-${type}`}>
                  {/* วัคซีนที่ต้องการฉีด */}
                  <Row className="row-gap-3">
                    <h5>วัคซีนที่ต้องการฉีด</h5>
                    <Col md={6} className={`row-gap-3 ${styles.travelchoice}`}>
                      <Form.Check
                        inline
                        label="มีวัคซีนที่ต้องการฉีด"
                        name="group1"
                        type={type}
                        id={`inline-${type}-1`}
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Check
                        inline
                        label="ต้องการคำแนะนำ"
                        name="group1"
                        type={type}
                        id={`inline-${type}-2`}
                        defaultChecked
                      />
                    </Col>
                    {selectedVaccines.map((value, index) => (
                      <Row key={index} className="row-gap-2 mb-2 align-items-center">
                        <Col md={6}>
                          <Form.Select
                            value={value}
                            onChange={(e) =>
                              handleVaccineChange(index, e.target.value)
                            }
                          >
                            <option value="">เลือกวัคซีนที่ต้องการ</option>
                            <option value="Tetanus">Tetanus, diphtheria, and pertussis</option>
                            <option value="Influenza">Influenza</option>
                            <option value="COVID-19">COVID-19</option>
                            <option value="MMR">Measles, mumps, and rubella</option>
                            <option value="Varicella">Varicella</option>
                            <option value="HepA">Hepatitis A virus</option>
                            <option value="HepB">Hepatitis B virus</option>
                            <option value="HPV">Human papillomavirus (HPV)</option>
                            <option value="Pneumococcal">Pneumococcal</option>
                            <option value="RSV">Respiratory syncytial virus (RSV)</option>
                            <option value="Zoster-live">Live-attenuated zoster</option>
                            <option value="Zoster-recombinant">Recombinant zoster</option>
                            <option value="Dengue">Live-attenuated dengue</option>
                            <option value="Yellow-fever">Yellow fever</option>
                            <option value="JE">Japanese encephalitis</option>
                            <option value="Meningococcal">Meningococcal</option>
                            <option value="Mpox">Mpox</option>
                          </Form.Select>
                        </Col>
                        <Col md={6} className="d-flex gap-2">
                          {selectedVaccines.length > 1 && (
                            <Button
                              variant="danger"
                              onClick={() => removeVaccine(index)}
                            >
                              −
                            </Button>
                          )}
                        </Col>
                        <Col md={12}>
                          {index === selectedVaccines.length - 1 && (
                            <Button variant="success" onClick={addVaccine}>
                              +
                            </Button>
                          )}
                        </Col>
                      </Row>
                    ))}
                  </Row>
                  {/* วัคซีนที่เคยได้รับ */}
                  <Row className="row-gap-3">
                    <h5 className="mt-4">วัคซีนที่เคยได้รับ</h5>
                    <Col md={6}></Col>
                    <Col md={6}><h5>วันที่ได้รับ</h5></Col>
                    {receivedVaccines.map((item, index) => (
                      <Row key={index} className="row-gap-2 align-items-center mb-2">
                        <Col md={6}>
                          <Form.Select
                            value={item.vaccine}
                            onChange={(e) =>
                              handleReceivedChange(index, "vaccine", e.target.value)
                            }
                          >
                            <option value="">เลือกวัคซีน</option>
                            <option value="Tetanus">Tetanus, diphtheria, and pertussis</option>
                            <option value="Influenza">Influenza</option>
                            <option value="COVID-19">COVID-19</option>
                            <option value="MMR">Measles, mumps, and rubella</option>
                            <option value="Varicella">Varicella</option>
                            <option value="HepA">Hepatitis A virus</option>
                            <option value="HepB">Hepatitis B virus</option>
                            <option value="HPV">Human papillomavirus (HPV)</option>
                            <option value="Pneumococcal">Pneumococcal</option>
                            <option value="RSV">Respiratory syncytial virus (RSV)</option>
                            <option value="Zoster-live">Live-attenuated zoster</option>
                            <option value="Zoster-recombinant">Recombinant zoster</option>
                            <option value="Dengue">Live-attenuated dengue</option>
                            <option value="Yellow-fever">Yellow fever</option>
                            <option value="JE">Japanese encephalitis</option>
                            <option value="Meningococcal">Meningococcal</option>
                            <option value="Mpox">Mpox</option>
                          </Form.Select>
                        </Col>

                        <Col md={4}>
                          <Form.Control
                            type="date"
                            value={item.date}
                            onChange={(e) =>
                              handleReceivedChange(index, "date", e.target.value)
                            }
                          />
                        </Col>

                        <Col md={2} className="d-flex gap-2">
                          {receivedVaccines.length > 1 && (
                            <Button
                              variant="danger"
                              onClick={() => removeReceivedVaccine(index)}
                            >
                              −
                            </Button>
                          )}
                        </Col>
                        <Col md={12}>
                          {index === receivedVaccines.length - 1 && (
                            <Button variant="success" onClick={addReceivedVaccine}>
                              +
                            </Button>
                          )}
                        </Col>
                      </Row>
                    ))}
                  </Row>
                </div>
              ))}
            </Form>
          </Accordion.Body>
        </Accordion.Item>
        {/* ประวัติการแพ้ */}
        <Accordion.Item eventKey="4">
          <Accordion.Header>ประวัติการแพ้อาหาร ยา และวัคซีน</Accordion.Header>
          <Accordion.Body>
            <Form>
              <h6 className="mb-3">ประวัติการแพ้อาหาร ยา และวัคซีน</h6>

              {/* ตัวเลือกการแพ้ */}
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Check
                    label="ไม่มี"
                    checked={allergy.none}
                    onChange={() => handleAllergyCheck("none")}
                  />
                </Col>
                <Col md={4}>
                  <Form.Check
                    label="แพ้อาหาร"
                    checked={allergy.food}
                    onChange={() => handleAllergyCheck("food")}
                    disabled={allergy.none}
                  />
                </Col>
                <Col md={4}>
                  <Form.Check
                    label="แพ้ยา/วัคซีน"
                    checked={allergy.drugAndVaccine}
                    onChange={() => handleAllergyCheck("drugAndVaccine")}
                    disabled={allergy.none}
                  />
                </Col>
              </Row>

              {/* แพ้อาหาร */}
              {allergy.food && (
                <div className="border rounded p-3 mb-3">
                  <Form.Label>อาหารที่แพ้</Form.Label>
                  <Row>
                    {["ไข่", "เจลาติน", "นม", "ยีสต์"].map((item) => (
                      <Col md={4} key={item}>
                        <Form.Check
                          label={item}
                          checked={allergy.foodList.includes(item)}
                          onChange={() => handleFoodChange(item)}
                        />
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              {/* {แพ้ยาและวัคซีน} */}
              {allergy.drugAndVaccine && (
                <div className="border rounded p-3 mb-3">
                  <Form.Label>ยาและวัคซีนที่แพ้</Form.Label>
                  <Row>
                    {["ยา1", "ยา2", "ยา3", "ยา4"].map((item) => (
                      <Col md={4} key={item}>
                        <Form.Check
                          label={item}
                          checked={allergy.drugAndVaccineList.includes(item)}
                          onChange={() => handleDrugAndVaccineChange(item)}
                        />
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* <button onClick={() => console.log(formData)}>click</button> */}
    </div>
  );
}

export default BasicInfo;
