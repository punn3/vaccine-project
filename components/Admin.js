import { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { PencilSquare, Trash, Plus } from "react-bootstrap-icons";
import AddVaccine from "./AddVaccine";

function Admin() {
    const [view, setView] = useState("list");
    const [vaccines, setVaccines] = useState([]); // ตัวแปรเก็บข้อมูลจริงจาก DB
    const [loading, setLoading] = useState(true);

    // 1. ฟังก์ชันดึงข้อมูลจาก API (Database)
    const fetchVaccines = async () => {
        try {
            const res = await fetch("/api/vaccines");
            const data = await res.json();
            setVaccines(data); // เอาข้อมูลใหม่ใส่ตัวแปร
            setLoading(false);
        } catch (error) {
            console.error("Error fetching vaccines:", error);
            setLoading(false);
        }
    };

    // 2. สั่งให้ดึงข้อมูลใหม่ทุกครั้งที่หน้านี้แสดงผล (รวมถึงตอนกลับมาจากหน้า Add)
    useEffect(() => {
        if (view === "list") {
            setLoading(true); // ขึ้นหมุนๆ รอ
            fetchVaccines();
        }
    }, [view]);

    return (
        <Container fluid>
            {view === "add" ? (
                // ส่งฟังก์ชัน setView("list") ไปให้หน้า Add ใช้กดกลับ
                <AddVaccine onBack={() => setView("list")} />
            ) : (
                <Container className="mt-5">
                    <div>
                        <Form className="d-flex mt-5 justify-content-end">
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                style={{ maxWidth: "500px" }}
                            />
                            <Button
                                variant="primary"
                                className="d-flex align-items-center px-4 rounded-3"
                                style={{ backgroundColor: "#4a7fc1", border: "none" }}
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
                                    <th scope="col" style={{ width: "120px" }}>
                                        รูปวัคซีน
                                    </th>
                                    <th scope="col">ชื่อวัคซีน</th>
                                    <th scope="col">ชื่อการค้า</th>
                                    <th scope="col">ชนิดวัคซีน</th>
                                    {/* <th scope="col">ขนาด/วิธีใช้</th> */}
                                    <th scope="col">ราคา</th>
                                    <th scope="col" className="text-center">
                                        จัดการ
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-center align-middle">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="py-5">
                                            กำลังโหลดข้อมูลล่าสุด...
                                        </td>
                                    </tr>
                                ) : (
                                    vaccines.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            style={{
                                                backgroundColor: index % 2 === 0 ? "#fcfcfc" : "white",
                                            }}
                                        >
                                            <td className="py-3">
                                                {item.image_url ? (
                                                    <img
                                                        src={item.image_url}
                                                        alt=""
                                                        style={{
                                                            width: "80px",
                                                            height: "55px",
                                                            objectFit: "cover",
                                                            borderRadius: "4px",
                                                        }}
                                                        onError={(e) => {
                                                            e.target.style.display = "none";
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: "80px",
                                                            height: "55px",
                                                            backgroundColor: "#adb5bd",
                                                            borderRadius: "4px",
                                                            margin: "0 auto",
                                                        }}
                                                    ></div>
                                                )}
                                            </td>
                                            <td>
                                                <div className="fw-bold text-dark">{item.name_th}</div>
                                                <div className="text-muted small">{item.name_en}</div>
                                            </td>
                                            <td className="text-dark">{item.trade_name}</td>
                                            <td className="text-dark">{item.vaccine_type}</td>
                                            {/* <td className="text-dark small">
                                                {item.administration ||
                                                    (item.dosage_ml ? item.dosage_ml + " ml" : "-")}
                                            </td> */}
                                            <td className="text-success fw-bold">
                                                {item.price ? `฿ ${item.price.toLocaleString()}` : "-"}
                                            </td>
                                            <td className="text-center">
                                                <div className="d-flex justify-content-center border-start ps-2">
                                                    <Button
                                                        variant="link"
                                                        className="p-2 me-1 text-decoration-none"
                                                    >
                                                        <PencilSquare
                                                            size={20}
                                                            style={{ color: "#6f42c1" }}
                                                        />
                                                    </Button>
                                                    <Button
                                                        variant="link"
                                                        className="p-2 text-decoration-none"
                                                    >
                                                        <Trash size={20} className="text-danger" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Container>
            )}
        </Container>
    );
}

export default Admin;
