import { Form, Button } from "react-bootstrap";

function SearchBar({ searchTerm, onSearchChange }) {
    return (
        <Form 
            className="d-flex justify-content-end mb-4" 
            onSubmit={(e) => e.preventDefault()}
        >
            <Form.Control
                type="search"
                placeholder="Search Vaccine or Trade name"
                className="me-2"
                aria-label="Search"
                style={{ maxWidth: "500px" }}
                value={searchTerm} // รับค่ามาจาก Component แม่
                onChange={(e) => onSearchChange(e.target.value)} // ส่งค่ากลับไปให้ Component แม่
            />
            <Button variant="outline-success">Search</Button>
        </Form>
    );
}

export default SearchBar;