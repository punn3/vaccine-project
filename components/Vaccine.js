import { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import AddVaccine from "./AddVaccine";
import SearchBar from "./SearchBar";

// Component สำหรับวาดไอคอนลูกศร
const SortIcon = ({ active, direction }) => {
    // ถ้าไม่ได้กด (active=false) จะเป็นสีเทาอ่อนทั้งคู่
    // ถ้ากดแล้ว จะดูว่าเรียงแบบไหน (asc/desc) แล้วเปลี่ยนสีเข้มที่ลูกศรตัวนั้น
    const upColor = active && direction === "asc" ? "#212529" : "#969696";
    const downColor = active && direction === "desc" ? "#212529" : "#969696";

    return (
        <svg
            width="10"
            height="14"
            viewBox="0 0 10 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginLeft: "6px", verticalAlign: "middle" }}
        >
            {/* สามเหลี่ยมชี้ขึ้น */}
            <path d="M5 0L10 5H0L5 0Z" fill={upColor} />
            {/* สามเหลี่ยมชี้ลง */}
            <path d="M5 14L0 9H10L5 14Z" fill={downColor} />
        </svg>
    );
};

// Component ไอคอนมีจำหน่าย
const CheckIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        className="me-2"
    >
        {/* พื้นหลังวงกลมสีเขียว  */}
        <circle cx="12" cy="12" r="12" fill="#198754" />
        
        {/* เครื่องหมายถูกสีขาว */}
        <polyline 
            points="17 8 10 16 7 13" 
            fill="none" 
            stroke="white" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
        />
    </svg>
);

// Component ไอคอนไม่มีจำหน่าย (
const MinusIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        className="me-2"
    >
        {/* พื้นหลังวงกลมสีเทาอ่อน */}
        <circle cx="12" cy="12" r="12" fill="#737373" />
        
        {/* เครื่องหมายลบสีขาว */}
        <line 
            x1="7" 
            y1="12" 
            x2="17" 
            y2="12" 
            fill="none" 
            stroke="white" 
            strokeWidth="3" 
            strokeLinecap="round" 
        />
    </svg>
);

function Vaccines() {
    const [view, setView] = useState("list"); // list, add, edit
    const [vaccines, setVaccines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

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

    const sortedVaccines = [...filteredVaccines].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const key = sortConfig.key;
        let aValue = a[key] ?? "";
        let bValue = b[key] ?? "";

        if (key === "price") {
            aValue = Number(aValue);
            bValue = Number(bValue);
        }

        if (key === "is_available") {
            aValue = aValue ? 1 : 0;
            bValue = bValue ? 1 : 0;
        }

        if (aValue < bValue) {
            return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
    });

    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // อัปเดตฟังก์ชันดึงไอคอนให้มาใช้ Component ที่เราสร้างไว้
    const renderSortIcon = (columnName) => {
        const isActive = sortConfig.key === columnName;
        return <SortIcon active={isActive} direction={sortConfig.direction} />;
    };

    return (
        <Container fluid>
            {view === "add" && <AddVaccine onBack={() => setView("list")} />}
            {view === "list" && (
                <Container className="mt-5">
                    <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

                    <div className="shadow-sm rounded table-responsive">
                        <table
                            className="table table-hover mb-0"
                            style={{ minWidth: "800px" }}
                        >
                            <thead className="table-light align-middle">
                                <tr className="text-center fw-bold">
                                    <th style={{ width: "180px" }}>รูปวัคซีน</th>

                                    {/* นำฟังก์ชัน renderSortIcon มาเสียบต่อท้ายชื่อคอลัมน์ */}
                                    <th
                                        onClick={() => requestSort("name_th")}
                                        style={{
                                            cursor: "pointer",
                                            userSelect: "none",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        ชื่อวัคซีน {renderSortIcon("name_th")}
                                    </th>
                                    <th
                                        onClick={() => requestSort("trade_name")}
                                        style={{
                                            cursor: "pointer",
                                            userSelect: "none",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        ชื่อการค้า {renderSortIcon("trade_name")}
                                    </th>
                                    <th
                                        onClick={() => requestSort("vaccine_type")}
                                        style={{
                                            cursor: "pointer",
                                            userSelect: "none",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        ชนิด {renderSortIcon("vaccine_type")}
                                    </th>
                                    <th
                                        onClick={() => requestSort("is_available")}
                                        style={{
                                            cursor: "pointer",
                                            userSelect: "none",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        สถานะ {renderSortIcon("is_available")}
                                    </th>
                                    <th
                                        onClick={() => requestSort("price")}
                                        style={{
                                            cursor: "pointer",
                                            userSelect: "none",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        ราคา {renderSortIcon("price")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-center align-middle">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="py-5">
                                            กำลังโหลดข้อมูล...
                                        </td>
                                    </tr>
                                ) : sortedVaccines.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-5 text-muted">
                                            ไม่พบข้อมูลวัคซีนที่ค้นหา
                                        </td>
                                    </tr>
                                ) : (
                                    sortedVaccines.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                {item.image_url ? (
                                                    <img
                                                        src={item.image_url}
                                                        alt="ไม่มีรูป"
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
                                            <td>
                                                <div className="d-flex align-items-center justify-content-center">
                                                    {item.is_available ? (
                                                        <>
                                                            <CheckIcon />
                                                            <span className="text-success fw-bold"></span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <MinusIcon />
                                                            <span className="text-muted fw-bold"></span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="text-success fw-bold">
                                                ฿{Number(item.price).toLocaleString()}
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
