import { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { PencilSquare, Trash, Plus } from "react-bootstrap-icons";
import AddVaccine from "./AddVaccine";

function Admin() {
    const [view, setView] = useState("list");
    const [vaccines, setVaccines] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. ฟังก์ชันดึงข้อมูล
    const fetchVaccines = async () => {
        try {
            const res = await fetch("/api/vaccines");
            const data = await res.json();
            setVaccines(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching vaccines:", error);
            setLoading(false);
        }
    };

    // 2. useEffect ดึงข้อมูล
    useEffect(() => {
        if (view === "list") {
            setLoading(true);
            fetchVaccines();
        }
    }, [view]);

    // --- 3. ฟังก์ชันลบข้อมูล (เพิ่มใหม่) ---
    const handleDelete = async (id) => {
        // ถามยืนยันก่อนลบ
        const confirmDelete = window.confirm("คุณแน่ใจหรือไม่ที่จะลบวัคซีนรายการนี้?");
        if (!confirmDelete) return;

        try {
            // ส่ง request delete ไปที่ api (สมมติว่า route คือ /api/vaccines/ตามด้วยไอดี)
            const res = await fetch(`/api/vaccines/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                // ถ้าลบสำเร็จ ให้เอา item นั้นออกจาก state ทันที (หน้าจอจะอัปเดตเองโดยไม่ต้องโหลดใหม่)
                setVaccines(vaccines.filter((item) => item.id !== id));
                alert("✅ ลบข้อมูลสำเร็จ");
            } else {
                alert("❌ ไม่สามารถลบข้อมูลได้");
            }
        } catch (error) {
            console.error("Error deleting:", error);
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        }
    };

    return (
        <Container fluid>
            {view === "add" ? (
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
                                    <th scope="col" style={{ width: "120px" }}>รูปวัคซีน</th>
                                    <th scope="col">ชื่อวัคซีน</th>
                                    <th scope="col">ชื่อการค้า</th>
                                    <th scope="col">ชนิดวัคซีน</th>
                                    <th scope="col">ราคา</th>
                                    <th scope="col" className="text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="text-center align-middle">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="py-5">กำลังโหลดข้อมูลล่าสุด...</td>
                                    </tr>
                                ) : (
                                    vaccines.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            style={{ backgroundColor: index % 2 === 0 ? "#fcfcfc" : "white" }}
                                        >
                                            <td className="py-3">
                                                {item.image_url ? (
                                                    <img
                                                        src={item.image_url}
                                                        alt=""
                                                        style={{ width: "80px", height: "55px", objectFit: "cover", borderRadius: "4px" }}
                                                        onError={(e) => { e.target.style.display = "none"; }}
                                                    />
                                                ) : (
                                                    <div style={{ width: "80px", height: "55px", backgroundColor: "#adb5bd", borderRadius: "4px", margin: "0 auto" }}></div>
                                                )}
                                            </td>
                                            <td>
                                                <div className="fw-bold text-dark">{item.name_th}</div>
                                                <div className="text-muted small">{item.name_en}</div>
                                            </td>
                                            <td className="text-dark">{item.trade_name}</td>
                                            <td className="text-dark">{item.vaccine_type}</td>
                                            <td className="text-success fw-bold">
                                                {item.price ? `฿ ${item.price.toLocaleString()}` : "-"}
                                            </td>
                                            <td className="text-center">
                                                <div className="d-flex justify-content-center border-start ps-2">
                                                    <Button variant="link" className="p-2 me-1 text-decoration-none">
                                                        <PencilSquare size={20} style={{ color: "#6f42c1" }} />
                                                    </Button>
                                                    
                                                    {/* --- ส่วนที่แก้ไข: ใส่ onClick เรียก handleDelete --- */}
                                                    <Button
                                                        variant="link"
                                                        className="p-2 text-decoration-none"
                                                        onClick={() => handleDelete(item.id)} // เรียกฟังก์ชันลบ
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