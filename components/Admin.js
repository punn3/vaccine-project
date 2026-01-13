import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { PencilSquare, Trash, Plus, Search } from "react-bootstrap-icons";
import AddVaccine from "./AddVaccine";

function Admin() {
    const [view, setView] = useState("list");

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

                    <div className="mt-5  align-middle shadow-sm rounded">
                        <table className="table table-striped">
                            <thead className="table-light">
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
                            <tbody>
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