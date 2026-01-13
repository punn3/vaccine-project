import { Form, Button, Container } from "react-bootstrap";
import styles from "../styles/Vaccine.module.css"

function Vaccines() {
    
    const vaccinesData = [
        {
            id: 1,
            nameTH: "วัคซีนไข้หวัดใหญ่",
            nameEN: "(Influenza vaccine)",
            tradeName: "ชื่อการค้า",
            type: "Inactivated",
            dose: "1 เข็ม / ปี",
            price: 257,
        },
        {
            id: 2,
            nameTH: "วัคซีนตับอักเสบ บี",
            nameEN: "(Hepatitis B vaccine)",
            tradeName: "ชื่อการค้า",
            type: "Inactivated",
            dose: "3 เข็ม",
            price: 294,
        },
        {
            id: 3,
            nameTH: "วัคซีนไข้หวัดใหญ่",
            nameEN: "(Influenza vaccine)",
            tradeName: "ชื่อการค้า",
            type: "Inactivated",
            dose: "1 เข็ม / ปี",
            price: 257,
        },
        {
            id: 4,
            nameTH: "วัคซีนตับอักเสบ บี",
            nameEN: "(Hepatitis B vaccine)",
            tradeName: "ชื่อการค้า",
            type: "Inactivated",
            dose: "3 เข็ม",
            price: 294,
        },
        {
            id: 5,
            nameTH: "วัคซีนไข้หวัดใหญ่",
            nameEN: "(Influenza vaccine)",
            tradeName: "ชื่อการค้า",
            type: "Inactivated",
            dose: "1 เข็ม / ปี",
            price: 257,
        },
        {
            id: 6,
            nameTH: "วัคซีนตับอักเสบ บี",
            nameEN: "(Hepatitis B vaccine)",
            tradeName: "ชื่อการค้า",
            type: "Inactivated",
            dose: "3 เข็ม",
            price: 294,
        },
        {
            id: 7,
            nameTH: "วัคซีนไข้หวัดใหญ่",
            nameEN: "(Influenza vaccine)",
            tradeName: "ชื่อการค้า",
            type: "Inactivated",
            dose: "1 เข็ม / ปี",
            price: 257,
        },
        {
            id: 8,
            nameTH: "วัคซีนตับอักเสบ บี",
            nameEN: "(Hepatitis B vaccine)",
            tradeName: "ชื่อการค้า",
            type: "Inactivated",
            dose: "3 เข็ม",
            price: 294,
        },
    ];

    return (
        <Container fluid className={styles.vaccine_table}>
            <Form className="d-flex mt-5 justify-content-end">
                <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    style={{ maxWidth: "500px" }} // ความกว้างช่องค้นหา
                />
                <Button variant="outline-success">Search</Button>
            </Form>

            <div className="mt-5 align-middle shadow-sm rounded ">
                <table className="table table-striped p-0">
                    <thead className="table-light">
                        <tr className="text-center fw-bold">
                            <th scope="col" style={{ width: "150px" }} className={styles.th_table}>รูปวัคซีน</th>
                            <th scope="col" className={styles.th_table}>ชื่อวัคซีน</th>
                            <th scope="col" className={styles.th_table}>ชื่อการค้า</th>
                            <th scope="col" className={styles.th_table}>ชนิดวัคซีน</th>
                            <th scope="col" className={styles.th_table}>จำนวนโดส</th>
                            <th scope="col" className={styles.th_table}>ราคา</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vaccinesData.map((item) => (
                            <tr key={item.id} className="text-center">
                                {/* ช่องรูปภาพ (จำลองด้วยกล่องสีเทา) */}
                                <td className={styles.td_table}>
                                    <div
                                        style={{
                                            width: "100px",
                                            height: "70px",
                                            backgroundColor: "#adb5bd", // สีเทา
                                            margin: "0 auto", // จัดกึ่งกลาง div
                                            borderRadius: "4px"
                                        }}
                                    ></div>
                                </td>

                                {/* ชื่อวัคซีน */}
                                <td className={styles.td_table}>
                                    <div className="fw-bold">{item.nameTH}</div>
                                    <div className="text-muted small">{item.nameEN}</div>
                                </td>

                                <td className={styles.td_table}>
                                    {item.tradeName}
                                </td>
                                <td className={styles.td_table}>
                                    {item.type}
                                </td>
                                <td className={styles.td_table}>
                                    {item.dose}
                                </td>

                                {/* ราคา */}
                                <td className={`text-success fw-bold ${styles.td_table}`}>฿ {item.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Container>
    );
}

export default Vaccines;