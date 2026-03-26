// import mysql from 'mysql2/promise';

// let pool;

// if (process.env.DATABASE_URL) {
//     pool = mysql.createPool({
//         uri: process.env.DATABASE_URL,
//         ssl: {
//             rejectUnauthorized: false //ช่วยให้ Vercel คุยกับ Aiven ได้โดยไม่ต้องใช้ไฟล์ใบรับรอง CA
//         },
//         waitForConnections: true,
//         connectionLimit: 10,
//         queueLimit: 0
//     });
// } else {
//     pool = mysql.createPool({
//         host: '127.0.0.1',
//         port: 3307,        // ใช้พอร์ต 3307 
//         user: 'root',
//         password: '',
//         database: 'vaccine_db',
//         waitForConnections: true,
//         connectionLimit: 10,
//         queueLimit: 0
//     });
// }

// export default pool;

import mysql from 'mysql2/promise';

let pool;

if (process.env.DATABASE_URL) {
    // สำหรับ Production (เช่น Vercel เชื่อมต่อ Aiven)
    pool = mysql.createPool({
        uri: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        },
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
} else {
    pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
}

export default pool;