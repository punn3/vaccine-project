import { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { PencilSquare, Trash, Plus } from "react-bootstrap-icons";
import AddVaccine from "./AddVaccine";
import EditVaccine from "./EditVaccine";

function Admin() {
    const [view, setView] = useState("list"); // list, add, edit
    const [vaccines, setVaccines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);

    // 1. ฟังก์ชันดึงข้อมูลทั้งหมด
    const fetchVaccines = async () => {
        try {
            const res = await fetch("/api/vaccines");
            const data = await res.json();
            setVaccines(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (view === "list") {
            setLoading(true);
            fetchVaccines();
        }
    }, [view]);

    // 2. ฟังก์ชันจัดการการลบ
    const handleDelete = async (id) => {
        if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบวัคซีนรายการนี้?")) return;
        try {
            const res = await fetch(`/api/vaccines/${id}`, { method: "DELETE" });
            if (res.ok) {
                setVaccines(vaccines.filter((item) => item.id !== id));
                alert("✅ ลบข้อมูลสำเร็จ");
            } else {
                alert("❌ ไม่สามารถลบข้อมูลได้");
            }
        } catch (error) {
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        }
    };

    // 3. ฟังก์ชันเข้าสู่หน้าแก้ไข
    const handleEditClick = (item) => {
        setEditingItem(item);
        setView("edit");
    };

    return (
        <Container fluid>
            {view === "add" && <AddVaccine onBack={() => setView("list")} />}

            {view === "edit" && (
                <EditVaccine
                    data={editingItem}
                    onBack={() => {
                        setView("list");
                        setEditingItem(null);
                    }}
                />
            )}

            {view === "list" && (
                <Container className="mt-5">
                    <div className="d-flex justify-content-end mb-4">
                        <Button
                            variant="primary"
                            className="d-flex align-items-center px-4 rounded-3"
                            style={{ backgroundColor: "#4a7fc1", border: "none" }}
                            onClick={() => setView("add")}
                        >
                            <Plus className="me-2" size={20} /> เพิ่มวัคซีน
                        </Button>
                    </div>

                    <div className="shadow-sm rounded overflow-hidden">
                        <table className="table table-hover mb-0">
                            <thead className="table-light align-middle">
                                <tr className="text-center fw-bold">
                                    <th style={{ width: "180px" }}>รูปวัคซีน</th>
                                    <th>ชื่อวัคซีน</th>
                                    <th>ชื่อการค้า</th>
                                    <th>ชนิด</th>
                                    <th>ราคา</th>
                                    <th>สถานะการให้บริการ</th>
                                    <th>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="text-center align-middle">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="py-5">
                                            กำลังโหลดข้อมูล...
                                        </td>
                                    </tr>
                                ) : (
                                    vaccines.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                {item.image_url ? (
                                                    <img
                                                        src={item.image_url}
                                                        alt=""
                                                        style={{
                                                            width: "120px",
                                                            height: "90px",
                                                            objectFit: "cover",
                                                            borderRadius: "4px",
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: "120px",
                                                            height: "90px",
                                                            backgroundColor: "#dee2e6",
                                                            borderRadius: "4px",
                                                            margin: "0 auto",
                                                        }}
                                                    ></div>
                                                )}
                                            </td>
                                            <td className="text-start">
                                                <div className="fw-bold">{item.name_th}</div>
                                                <small className="text-muted">{item.name_en}</small>
                                            </td>
                                            <td className="text-start">{item.trade_name}</td>
                                            <td className="text-start">{item.vaccine_type}</td>
                                            <td className="text-success fw-bold">
                                                ฿{Number(item.price).toLocaleString()}
                                            </td>
                                            <td className={item.is_available ? "text-success fw-bold" : "text-muted fw-bold"}>
                                                {item.is_available ? "มีจำหน่าย" : "ไม่มีจำหน่าย"}
                                            </td>
                                            <td className="text-center">
                                                <div className="d-flex justify-content-center border-start ps-2">
                                                    <Button
                                                        variant="link"
                                                        className="p-1"
                                                        onClick={() => handleEditClick(item)}
                                                    >
                                                        <PencilSquare
                                                            size={18}
                                                            style={{ color: "#6f42c1" }}
                                                        />
                                                    </Button>
                                                    <Button
                                                        variant="link"
                                                        className="p-1"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <Trash size={18} className="text-danger" />
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
