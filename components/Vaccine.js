import { Form, Button, Container } from "react-bootstrap";
import styles from "../styles/Vaccine.module.css"

function Vaccines() {
    
    const vaccinesData = [
        {
            id: 1,
            nameTH: "วัคซีนไข้หวัดใหญ่ ชนิดฉีด",
            nameEN: "(Influenza vaccine)",
            tradeName: "Influenza Vaccine(InFlu Vac Tetra) ®",
            type: "Inactivated Suspension 0.5 ml",
            dose: "1 เข็ม / ปี",
            price: 245,
        },
        {
            id: 2,
            nameTH: "วัคซีนตับอักเสบ บี",
            nameEN: "(Hepatitis B vaccine)",
            tradeName: "Engerix-B 20 mcg INJ®",
            type: "Inactivated Suspension 1 ml",
            dose: "3 เข็ม",
            price: 294,
        },
        {
            id: 3,
            nameTH: "วัคซีนปากมดลูก 4 สายพันธุ์",
            nameEN: "(HPV4 Vaccine)",
            tradeName: "Gardasil Vaccine®",
            type: "Inactivated Suspension 0.5 ml",
            dose: "3 เข็ม",
            price: 2444,
        },
        {
            id: 4,
            nameTH: "วัคซีนปากมดลูก 9 สายพันธุ์",
            nameEN: "(HPV9 Vaccine)",
            tradeName: "Gardasil 9 Vaccine®",
            type: "Inactivated Suspension 0.5 ml",
            dose: "3 เข็ม",
            price: 5593,
        },
        {
            id: 5,
            nameTH: "วัคซีน คอตีบ บาดทะยัก ไอกรน",
            nameEN: "(Tdap vaccine)",
            tradeName: "Bootagen Vaccine INJ 0.5 ml®",
            type: "Inactivated Suspension 0.5 ml",
            dose: "1 เข็ม",
            price: 644,
        },
        {
            id: 6,
            nameTH: "วัคซีนไข้เลือดออก",
            nameEN: "(Dengue Vaccine)",
            tradeName: "Qdenga vaccine®",
            type: "Live vaccine 0.5 ml",
            dose: "2 เข็ม",
            price: 1639,
        },
        {
            id: 7,
            nameTH: "วัคซีนป้องกันรวมหัด หัดเยอรมัน คางทูม",
            nameEN: "(Mumps Measles Rubella vaccine)",
            tradeName: "MMR (Masu) Vaccine INJ 0.5 ml®",
            type: "Live vaccine 0.5 ml",
            dose: "2 เข็ม",
            price: 235,
        },
        {
            id: 8,
            nameTH: "วัคซีนป้องกันงูสวัด",
            nameEN: "(Recombinant subunit Zoster vaccine)",
            tradeName: "Shingrix 50 mcg Vaccine®",
            type: "Inactivated Suspension 0.5 ml",
            dose: "2 เข็ม",
            price: 5199,
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
                                <td className="align-middle">
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
                                <td className="align-middle">
                                    <div className="fw-bold">{item.nameTH}</div>
                                    <div className="text-muted small">{item.nameEN}</div>
                                </td>

                                <td className="align-middle">
                                    {item.tradeName}
                                </td>
                                <td className="align-middle">
                                    {item.type}
                                </td>
                                <td className="align-middle">
                                    {item.dose}
                                </td>

                                {/* ราคา */}
                                <td className="text-success fw-bold align-middle">฿ {item.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Container>
    );
}

export default Vaccines;