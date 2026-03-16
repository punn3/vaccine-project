import mysql from "mysql2/promise";

const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: true // บรรทัดนี้คือหัวใจสำคัญ! ปลดล็อกให้ Aiven ยอมรับการเชื่อมต่อ
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;