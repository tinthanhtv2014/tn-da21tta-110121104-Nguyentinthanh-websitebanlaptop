require("dotenv").config(); // Nạp các biến môi trường từ file .env
const express = require("express");
const cors = require("cors"); // Thêm cors
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const { PrismaClient } = require("@prisma/client"); // Thêm Prisma Client
const prisma = new PrismaClient(); // Khởi tạo Prisma Client
const app = express();
const http = require("http");
const { Server } = require("socket.io");
// Kích hoạt CORS với các thiết lập mặc định
app.use(
  cors({
    origin: "*", // Cho phép tất cả mọi nguồn (thường là mặc định)
    methods: ["GET", "POST", "PUT", "DELETE"], // Các phương thức HTTP được phép
    allowedHeaders: ["Content-Type", "Authorization"], // Các header được phép
  })
);
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Cho phép frontend kết nối
    methods: ["GET", "POST"],
  },
});

// Khi có client kết nối
io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Middleware xử lý JSON
app.use(express.json());

// Cấu hình Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0", // Định nghĩa chuẩn OpenAPI
    info: {
      title: "SSO API Documentation",
      version: "1.0.0",
      description: "Tài liệu API cho hệ thống SSO",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? `http://18.141.141.54:3001` // URL sản xuất
            : `http://localhost:${process.env.PORT || 3001}`, // URL phát triển
      },
    ],
  },
  apis: ["./src/router/**/*.js"],
};

// Khởi tạo Swagger Docs
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Tạo route để hiển thị Swagger UI
const basicAuth = require("basic-auth-connect");

const username = "admin"; // Tên đăng nhập
const password = "dev@123#"; // Mật khẩu
app.use((req, res, next) => {
  req.io = io;
  next();
});
// Middleware Basic Authentication
app.use(
  "/api-docs",
  basicAuth(username, password),
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs)
);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Import router và đăng ký các route
const orderRouter = require("./router/order-router");
const voucherRouter = require("./router/voucher-router");
const uservoucherRouter = require("./router/userVoucher-router");
const novuRouter = require("./router/novu-router");
app.use("/api/orders", orderRouter);
app.use("/api/vouchers", voucherRouter);
app.use("/api/uservouchers", uservoucherRouter);
app.use("/api/novu", novuRouter);
// Kết nối MySQL và log thông báo
async function connectToDatabase() {
  try {
    await prisma.$connect(); // Kết nối cơ sở dữ liệu MySQL
    console.log("Kết nối đến cơ sở dữ liệu MySQL thành công!");
  } catch (error) {
    console.error("Lỗi khi kết nối đến cơ sở dữ liệu:", error);
  }
}

// Gọi hàm kết nối đến database khi server khởi động
connectToDatabase();

// Khởi động server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`SSO Service open on http://localhost:${PORT}`);
  console.log("Tài liệu API có sẵn tại http://localhost:5003/api-docs");
});

module.exports = { io };
