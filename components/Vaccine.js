import { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import AddVaccine from "./AddVaccine";
import SearchBar from "./SearchBar";

function Vaccines() {
    const [view, setView] = useState("list"); // list, add, edit
    const [vaccines, setVaccines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

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

    const filteredVaccines = vaccines.filter((item) => {
        const search = searchTerm.toLowerCase();
        return (
            item.name_th?.toLowerCase().includes(search) ||
            item.name_en?.toLowerCase().includes(search) ||
            item.trade_name?.toLowerCase().includes(search)
        );
    });

    return (
        <Container fluid>
            {view === "add" && <AddVaccine onBack={() => setView("list")} />}
            {view === "list" && (
                <Container className="mt-5">
                    <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

                    <div className="shadow-sm rounded table-responsive">
                        <table className="table table-hover mb-0" style={{ minWidth: "800px" }}>
                            <thead className="table-light align-middle">
                                <tr className="text-center fw-bold">
                                    <th style={{ width: "180px" }}>รูปวัคซีน</th>
                                    <th>ชื่อวัคซีน</th>
                                    <th>ชื่อการค้า</th>
                                    <th>ชนิด</th>
                                    <th>ราคา</th>
                                    <th>สถานะการให้บริการ</th>
                                </tr>
                            </thead>
                            <tbody className="text-center align-middle">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="py-5">
                                            กำลังโหลดข้อมูล...
                                        </td>
                                    </tr>
                                ) : filteredVaccines.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-5 text-muted">
                                            ไม่พบข้อมูลวัคซีนที่ค้นหา
                                        </td>
                                    </tr>
                                ) : (
                                    filteredVaccines.map((item) => (
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
                                            <td
                                                className={
                                                    item.is_available
                                                        ? "text-success fw-bold"
                                                        : "text-muted fw-bold"
                                                }
                                            >
                                                {item.is_available ? "มีจำหน่าย" : "ไม่มีจำหน่าย"}
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

export default Vaccines;
