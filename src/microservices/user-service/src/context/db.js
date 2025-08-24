const mysql = require("mysql2/promise");
require("dotenv").config();

// Tạo kết nối đến MySQL
const pool = mysql.createPool({
  host: "mysql",
  port: process.env.DATABASE_PORT || "",
  user: process.env.DATABASE_USER || "dev",
  // password: process.env.DATABASE_PASSWORD || 'dev@123',
  database: process.env.DATABASE_NAME || "database",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Kiểm tra kết nối khi ứng dụng khởi động
async function checkConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Kết nối MySQL thành công!");
    connection.release(); // Giải phóng kết nối
  } catch (error) {
    console.error("Không thể kết nối đến MySQL:", error.message);
  }
}

// Gọi hàm kiểm tra kết nối
checkConnection();

module.exports = pool;
