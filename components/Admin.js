import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { PencilSquare, Trash, Plus, Search } from "react-bootstrap-icons";
import AddVaccine from "./AddVaccine";

function Admin() {
    const [view, setView] = useState("list");

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
        <Container fluid>
            {view === "add" ? (
                <AddVaccine onBack={() => setView("list")} />
            ) : (
                // หน้ารายการวัคซีน (List)
                <Container className="mt-5">
                    <div>
                        <Form className="d-flex mt-5 justify-content-end">
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                                style={{ maxWidth: "500px" }} // ความกว้างช่องค้นหา
                            />
                            <Button
                                variant="primary"
                                className="d-flex align-items-center px-4 rounded-3"
                                style={{ backgroundColor: '#4a7fc1', border: 'none' }}
                                onClick={() => setView("add")}
                            >
                                <Plus className="me-2 fw-bold" size={20} /> เพิ่มวัคซีน
                            </Button>
                        </Form>
                    </div>

                    <div className="mt-5 shadow-sm rounded">
                        <table className="table table-striped">
                            <thead className="table-light align-middle">
                                <tr className="text-center fw-bold">
                                    <th scope="col" style={{ width: "120px" }}>รูปวัคซีน</th>
                                    <th scope="col">ชื่อวัคซีน</th>
                                    <th scope="col">ชื่อการค้า</th>
                                    <th scope="col">ชนิดวัคซีน</th>
                                    <th scope="col">จำนวนโดส</th>
                                    <th scope="col">ราคา</th>
                                    <th scope="col" className="text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="text-center align-middle">
                                {vaccinesData.map((item, index) => (
                                    <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#fcfcfc' : 'white' }}>
                                        <td className="py-3">
                                            <div style={{ width: "80px", height: "55px", backgroundColor: "#adb5bd", borderRadius: "4px" }}></div>
                                        </td>
                                        <td>
                                            <div className="fw-bold text-dark">{item.nameTH}</div>
                                            <div className="text-muted small">{item.nameEN}</div>
                                        </td>
                                        <td className="text-dark">{item.tradeName}</td>
                                        <td className="text-dark">{item.type}</td>
                                        <td className="text-dark">{item.dose}</td>
                                        <td className="text-success fw-bold">฿ {item.price}</td>
                                        <td className="text-center">
                                            <Button variant="link" className="p-0 me-3"><PencilSquare size={20} style={{ color: "#6f42c1" }} /></Button>
                                            <Button variant="link" className="p-0"><Trash size={20} className="text-danger" /></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Container>
            )}
        </Container>
    );
}

export default Admin;