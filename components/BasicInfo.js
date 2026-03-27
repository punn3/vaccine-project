/* eslint-disable react/no-unescaped-entities */
"use client";
import {
  Accordion,
  Button,
  Form,
  Col,
  Row,
} from "react-bootstrap";
import styles from "../styles/BasicInfo.module.css";
import { useState, useEffect } from "react";

function BasicInfo() {
  const [formData, setFormData] = useState({
    basic: {
      age: "",
      gender: "",
      pregnant: "ไม่ตั้งครรภ์",
      gestational_weeks: "",
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
    vaccines: {
      want_type: "no",
      selected: [""],
      received: [{ vaccine: "", date: "" }]
    },
    allergy: {
      none: false,
      food: false,
      drugAndVaccine: false,
      foodList: [],
      drugAndVaccineList: [],
    }
  });

  const [vaccineList, setVaccineList] = useState([]);

  const [touched, setTouched] = useState({
    age: false,
    gender: false,
    pregnant: false,
    gestational_weeks: false,
  });

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const res = await fetch('/api/vaccines');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const sortedData = data.sort((a, b) => {
          const nameA = a.name_en.trim().toLowerCase();
          const nameB = b.name_en.trim().toLowerCase();
          return nameA.localeCompare(nameB);
        });
        const uniqueData = sortedData.filter((v, index, self) =>
          index === self.findIndex((t) => t.name_en.trim() === v.name_en.trim())
        );
        setVaccineList(uniqueData);
      } catch (err) {
        console.error("Error fetching vaccines:", err);
      }
    };
    fetchVaccines();
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem("vaccineFormData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("vaccineFormData", JSON.stringify(formData));
  }, [formData]);

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleChange = (section, e) => {
    const { name, value, type, checked } = e.target;

    // ดักจับห้ามพิมพ์ตัวเลขติดลบ
    if (type === "number" && Number(value) < 0) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: type === "checkbox" ? (checked ? value : "") : value,
      },
    }));
  };

  const handleVaccineTypeChange = (val) => {
    setFormData(prev => ({ ...prev, vaccines: { ...prev.vaccines, want_type: val } }));
  };

  const handleVaccineChange = (index, value) => {
    const updated = [...formData.vaccines.selected];
    updated[index] = value;
    setFormData(prev => ({ ...prev, vaccines: { ...prev.vaccines, selected: updated } }));
  };

  const addVaccine = () => {
    setFormData(prev => ({
      ...prev,
      vaccines: { ...prev.vaccines, selected: [...prev.vaccines.selected, ""] }
    }));
  };

  const removeVaccine = (index) => {
    const updated = formData.vaccines.selected.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, vaccines: { ...prev.vaccines, selected: updated } }));
  };

  const handleReceivedChange = (index, field, value) => {
    const updated = [...formData.vaccines.received];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, vaccines: { ...prev.vaccines, received: updated } }));
  };

  const addReceivedVaccine = () => {
    setFormData(prev => ({
      ...prev,
      vaccines: { ...prev.vaccines, received: [...prev.vaccines.received, { vaccine: "", date: "" }] }
    }));
  };

  const removeReceivedVaccine = (index) => {
    const updated = formData.vaccines.received.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, vaccines: { ...prev.vaccines, received: updated } }));
  };

  const handleAllergyCheck = (name) => {
    setFormData(prev => {
      const current = prev.allergy;
      if (name === "none") {
        return { ...prev, allergy: { none: !current.none, food: false, drugAndVaccine: false, foodList: [], drugAndVaccineList: [] } };
      }
      return { ...prev, allergy: { ...current, none: false, [name]: !current[name] } };
    });
  };

  const handleListChange = (listName, value) => {
    setFormData(prev => {
      const currentList = prev.allergy[listName];
      const newList = currentList.includes(value)
        ? currentList.filter(v => v !== value)
        : [...currentList, value];
      return { ...prev, allergy: { ...prev.allergy, [listName]: newList } };
    });
  };

  const getAvailableWantedVaccines = (currentIndex) => {
    // เอาชื่อวัคซีนในช่อง "อื่นๆ" มาเก็บไว้
    const selectedInOtherDropdowns = formData.vaccines.selected.filter((_, i) => i !== currentIndex);
    // คืนค่าเฉพาะวัคซีนที่ยังไม่ถูกเลือกในช่องอื่น
    return vaccineList.filter(v => !selectedInOtherDropdowns.includes(v.name_en));
  };

  const getAvailableReceivedVaccines = (currentIndex) => {
    const receivedInOtherDropdowns = formData.vaccines.received
      .filter((_, i) => i !== currentIndex)
      .map(item => item.vaccine); // ดึงมาแค่ชื่อวัคซีน
    return vaccineList.filter(v => !receivedInOtherDropdowns.includes(v.name_en));
  };

  // ตัวแปรเช็คความครบถ้วนของข้อมูล (Validation Rules)
  const isDiseaseValid = Object.values(formData.disease).some(val => val !== "");
  const isAllergyValid = formData.allergy.none || formData.allergy.food || formData.allergy.drugAndVaccine;
  const isFoodAllergyValid = !formData.allergy.food || formData.allergy.foodList.length > 0;
  const isDrugAllergyValid = !formData.allergy.drugAndVaccine || formData.allergy.drugAndVaccineList.length > 0;

  return (
    <div className={`${styles.accordionWrapper} ${styles.customCheckbox}`}>
      <Accordion defaultActiveKey="0" alwaysOpen className="my-5">

        {/* ================= Section 1: ข้อมูลพื้นฐาน ================= */}
        <Accordion.Item eventKey="0" className="mb-5 border rounded">
          <Accordion.Header>
            <strong>ข้อมูลพื้นฐาน <span className="text-danger">*</span></strong>
          </Accordion.Header>
          <Accordion.Body>
            <Row className="row-gap-4 align-items-start">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>อายุ <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    name="age"
                    type="number"
                    min="0"
                    placeholder="ระบุอายุ (ปี)"
                    value={formData.basic.age}
                    onChange={(e) => handleChange("basic", e)}
                    onBlur={handleBlur}
                    isInvalid={touched.age && !formData.basic.age}
                  />
                  <Form.Control.Feedback type="invalid">
                    กรุณาระบุอายุให้ถูกต้อง
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className={styles.genderbox}>
                  <Form.Label>เพศสภาพ <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    id="gender"
                    name="gender"
                    className={styles.genderselect}
                    value={formData.basic.gender}
                    onChange={(e) => handleChange("basic", e)}
                    onBlur={handleBlur}
                    isInvalid={touched.gender && (!formData.basic.gender || formData.basic.gender === "เลือกเพศ")}
                  >
                    <option value="">เลือกเพศ</option>
                    <option value="ชาย">ชาย</option>
                    <option value="หญิง">หญิง</option>
                    <option value="ไม่ระบุ">ไม่ระบุ</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    กรุณาเลือกเพศสภาพ
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className={styles.pregnantbox}>
                  <Form.Label>การตั้งครรภ์ <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    id="pregnant"
                    name="pregnant"
                    value={formData.basic.pregnant}
                    className={styles.pregnantselect}
                    onChange={(e) => {
                      handleChange("basic", e);
                      if (e.target.value !== "ตั้งครรภ์") {
                        setFormData((prev) => ({
                          ...prev,
                          basic: { ...prev.basic, gestational_weeks: "" }
                        }));
                      }
                    }}
                    onBlur={handleBlur}
                    isInvalid={touched.pregnant && (!formData.basic.pregnant || formData.basic.pregnant === "กรุณาระบุข้อมูล")}>
                    <option value="ไม่ตั้งครรภ์">ไม่ตั้งครรภ์</option>
                    <option value="ให้นมบุตร">ให้นมบุตร</option>
                    <option value="ตั้งครรภ์">ตั้งครรภ์</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    กรุณาระบุข้อมูลการตั้งครรภ์
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {formData.basic.pregnant === "ตั้งครรภ์" && (
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>อายุครรภ์ (สัปดาห์) <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="number"
                      name="gestational_weeks"
                      min="1"
                      max="45"
                      placeholder="เช่น 14, 25, 30"
                      value={formData.basic.gestational_weeks || ""}
                      onChange={(e) => handleChange("basic", e)}
                      onBlur={handleBlur}
                      isInvalid={touched.gestational_weeks && !formData.basic.gestational_weeks}
                    />
                    <Form.Control.Feedback type="invalid">
                      กรุณาระบุอายุครรภ์เป็นตัวเลข
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              )}

              <Col md={6} className="align-content-center pt-3">
                <Form>
                  <Form.Check
                    inline
                    type="checkbox"
                    label="เป็นบุคลากรทางการแพทย์"
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

        {/* ================= Section 2: โรคประจำตัว ================= */}
        <Accordion.Item eventKey="2" className="mb-5 border rounded">
          <Accordion.Header>
            <strong>โรคประจำตัว <span className="text-danger">*</span></strong>
          </Accordion.Header>
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
            {/* ✅ แจ้งเตือน Error โรคประจำตัว */}
            {/* {!isDiseaseValid && (
              <div className="text-danger mt-3 small fw-bold">
                * กรุณาเลือกโรคประจำตัวอย่างน้อย 1 รายการ (หากไม่มีให้เลือก "ไม่มี")
              </div>
            )} */}
          </Accordion.Body>
        </Accordion.Item>

        {/* ================= Section 3: การรับวัคซีน ================= */}
        <Accordion.Item eventKey="3" className="mb-5 border rounded">
          <Accordion.Header>
            <strong>การรับวัคซีน <span className="text-danger">*</span></strong>
          </Accordion.Header>
          <Accordion.Body>
            <Form>
              <Row className="row-gap-2">
                <p className="fw-bold">วัคซีนที่ต้องการฉีด</p>
                <Col md={6} className={`row-gap-3 ${styles.travelchoice}`}>
                  <Form.Check
                    type="radio"
                    label="มีวัคซีนที่ต้องการฉีด"
                    name="vaccine_preference"
                    checked={formData.vaccines.want_type === "yes"}
                    onChange={() => handleVaccineTypeChange("yes")}
                  />
                </Col>
                <Col md={6}>
                  <Form.Check
                    type="radio"
                    label="ต้องการคำแนะนำ"
                    name="vaccine_preference"
                    checked={formData.vaccines.want_type === "no"}
                    onChange={() => handleVaccineTypeChange("no")}
                  />
                </Col>

                {formData.vaccines.want_type === "yes" && (
                  <div className="border p-3 rounded bg-light">
                    <p>ระบุวัคซีนที่ต้องการ: <span className="text-danger">*</span></p>
                    {formData.vaccines.selected.map((value, index) => (
                      <Row key={index} className="row-gap-2 mb-2 align-items-center ">
                        <Col md={6}>
                          <Form.Select
                            value={value}
                            onChange={(e) => handleVaccineChange(index, e.target.value)}
                            isInvalid={formData.vaccines.want_type === "yes" && value === ""}
                          >
                            <option value="">เลือกวัคซีนที่ต้องการ</option>
                            {getAvailableWantedVaccines(index).map((v) => (
                              <option key={v.id} value={v.name_en}>
                                {v.name_en}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            กรุณาระบุชื่อวัคซีน
                          </Form.Control.Feedback>
                        </Col>
                        <Col md={2} className="d-flex gap-2">
                          {formData.vaccines.selected.length > 1 && (
                            <Button variant="danger" onClick={() => removeVaccine(index)}>
                              ลบ
                            </Button>
                          )}
                        </Col>
                        <Row>
                          <Col md={12}>
                            {index === formData.vaccines.selected.length - 1 && (
                              <Button variant="success" className="mt-2" onClick={addVaccine}>เพิ่ม</Button>
                            )}
                          </Col>
                        </Row>
                      </Row>
                    ))}
                  </div>
                )}
              </Row>

              {/* วัคซีนที่เคยได้รับ (Optional) */}
              <Row className="row-gap-2 mt-4">
                <p className="fw-bold">วัคซีนที่เคยได้รับ (ถ้ามี)</p>
                <Col md={6}></Col>
                <Col md={6}><p className="m-0">วันที่ได้รับ</p></Col>
                {formData.vaccines.received.map((item, index) => (
                  <Row key={index} className="row-gap-2 align-items-center mb-2">
                    <Col md={6}>
                      <Form.Select
                        value={item.vaccine}
                        onChange={(e) => handleReceivedChange(index, "vaccine", e.target.value)}
                      >
                        <option value="">เลือกวัคซีน</option>
                        {getAvailableReceivedVaccines(index).map((v) => (
                          <option key={v.id} value={v.name_en}>{v.name_en}</option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col md={4}>
                      <Form.Control
                        type="date"
                        value={item.date}
                        onClick={(e) => e.target.showPicker()}
                        onChange={(e) => handleReceivedChange(index, "date", e.target.value)}
                      />
                    </Col>
                    <Col md={2} className="d-flex gap-2">
                      {formData.vaccines.received.length > 1 && (
                        <Button variant="danger" onClick={() => removeReceivedVaccine(index)}>
                          ลบ
                        </Button>
                      )}
                    </Col>
                    <Col md={12}>
                      {index === formData.vaccines.received.length - 1 && (
                        <Button variant="success" onClick={addReceivedVaccine}>เพิ่ม</Button>
                      )}
                    </Col>
                  </Row>
                ))}
              </Row>
            </Form>
          </Accordion.Body>
        </Accordion.Item>

        {/* ================= Section 4: ประวัติการแพ้ ================= */}
        <Accordion.Item eventKey="4" className="mb-5 border rounded">
          <Accordion.Header>
            <strong>ประวัติการแพ้อาหาร ยา และวัคซีน <span className="text-danger">*</span></strong>
          </Accordion.Header>
          <Accordion.Body>
            <Form>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Check
                    label="ไม่มี"
                    checked={formData.allergy.none}
                    onChange={() => handleAllergyCheck("none")}
                  />
                </Col>
                <Col md={4}>
                  <Form.Check
                    label="แพ้อาหาร"
                    checked={formData.allergy.food}
                    onChange={() => handleAllergyCheck("food")}
                    disabled={formData.allergy.none}
                  />
                </Col>
                <Col md={4}>
                  <Form.Check
                    label="แพ้ยา/วัคซีน"
                    checked={formData.allergy.drugAndVaccine}
                    onChange={() => handleAllergyCheck("drugAndVaccine")}
                    disabled={formData.allergy.none}
                  />
                </Col>
              </Row>

              {/* ✅ แจ้งเตือน Error ประวัติการแพ้ภาพรวม */}
              {/* {!isAllergyValid && (
                <div className="text-danger mb-3 small fw-bold">
                  * กรุณาเลือกประวัติการแพ้ (หากไม่มีให้เลือก "ไม่มี")
                </div>
              )} */}

              {/* แพ้อาหาร */}
              {formData.allergy.food && (
                <div className="border rounded p-3 my-4">
                  <Form.Label className="fw-bold">อาหารที่แพ้ <span className="text-danger">*</span></Form.Label>
                  <Row>
                    {["ไข่", "เจลาติน", "นม", "ยีสต์"].map((item) => (
                      <Col md={4} key={item}>
                        <Form.Check
                          label={item}
                          checked={formData.allergy.foodList.includes(item)}
                          onChange={() => handleListChange("foodList", item)}
                        />
                      </Col>
                    ))}
                  </Row>
                  {/* ✅ แจ้งเตือน Error อาหาร */}
                  {!isFoodAllergyValid && (
                    <div className="text-danger mt-2 small fw-bold">
                      * กรุณาระบุชนิดอาหารที่แพ้อย่างน้อย 1 อย่าง
                    </div>
                  )}
                </div>
              )}

              {/* แพ้ยาและวัคซีน */}
              {formData.allergy.drugAndVaccine && (
                <div className="border rounded p-3 my-4">
                  <Form.Label className="fw-bold">ยาและวัคซีนที่แพ้ <span className="text-danger">*</span></Form.Label>
                  <Row>
                    {["Neomycin", "Steptomycin", "Polymyxin B"].map((item) => (
                      <Col md={4} key={item}>
                        <Form.Check
                          label={item}
                          checked={formData.allergy.drugAndVaccineList.includes(item)}
                          onChange={() => handleListChange("drugAndVaccineList", item)}
                        />
                      </Col>
                    ))}
                  </Row>
                  {/* ✅ แจ้งเตือน Error ยา */}
                  {!isDrugAllergyValid && (
                    <div className="text-danger mt-2 small fw-bold">
                      * กรุณาระบุชนิดยาหรือวัคซีนที่แพ้อย่างน้อย 1 อย่าง
                    </div>
                  )}
                </div>
              )}
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default BasicInfo;