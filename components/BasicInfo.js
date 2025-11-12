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
import styles from "./BasicInfo.module.css";

function BasicInfo() {
  return (
    <div className={styles.accordionWrapper}>
      <Accordion defaultActiveKey="0" className="my-5">
        <Accordion.Item eventKey="0">
          <Accordion.Header>ข้อมูลพื้นฐาน</Accordion.Header>
          <Accordion.Body>
            <Row>
              <Col md={6}>
                <Form>
                  <Form.Label>อายุ *</Form.Label>
                  <Form.Control placeholder="ปี" />
                </Form>
              </Col>
              <Col md={6}>
                <Form className={styles.genderbox}>
                  <label className="mb-2">เพศสภาพ *</label>
                  <select
                    id="gender"
                    name="gender"
                    className={styles.genderselect}
                  >
                    <option>เลือกเพศ</option>
                    <option value="male">ชาย</option>
                    <option value="female">หญิง</option>
                    <option value="">ไม่ระบุ</option>
                  </select>
                </Form>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col md={6}>
                <Form className={styles.pregnantbox}>
                  <label className="mb-2">การตั้งครรภ์ *</label>
                  <select
                    id="pregnant"
                    name="pregnant"
                    className={styles.pregnantselect}
                  >
                    <option>ไม่ตั้งครรภ์</option>
                    <option value="">ตั้งครรภ์</option>
                    <option value="">ให้นมบุตร</option>
                  </select>
                </Form>
              </Col>
              <Col md={6} className="align-content-center">
                <Form>
                  {["checkbox"].map((type) => (
                    <div key={`inline-${type}`}>
                      <Form.Check
                        inline
                        label="บุคลากรทางการแพทย์"
                        name="group1"
                        type={type}
                        id={`inline-${type}-1`}
                      />
                    </div>
                  ))}
                </Form>
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>การเดินทาง</Accordion.Header>
          <Accordion.Body>
            <Row>
              <Col md={6}>
              <Form>
                  {["radio"].map((type) => (
                    <div key={`inline-${type}`} className={styles.travel}>
                      <Form.Check
                      inline
                        label="บุคลากรทางการแพทย์"
                        name="group1"
                        type={type}
                        id={`inline-${type}-1`}
                      />
                      <Form.Check
                      inline
                        label="บุคลากรทางการแพทย์"
                        name="group1"
                        type={type}
                        id={`inline-${type}-2`}
                      />
                    </div>
                  ))}
                </Form>
                </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>โรคประจำตัว</Accordion.Header>
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
        <Accordion.Item eventKey="3">
          <Accordion.Header>การฉีดวัคซีน</Accordion.Header>
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
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </div>
  );
}

export default BasicInfo;
