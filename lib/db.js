// lib/db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: '127.0.0.1',
    port: 3307,        // <-- สำคัญ! ต้องตรงกับ XAMPP ของคุณ (3307)
    user: 'root',
    password: '',
    database: 'vaccine_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;