# Sử dụng Node.js 20 làm hình ảnh cơ sở
FROM node:20

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép các tệp package.json và package-lock.json để cài đặt các phụ thuộc
COPY package*.json ./

# Cài đặt các phụ thuộc của Node.js
RUN npm install

# Cài đặt Prisma toàn cục để tránh lỗi "Permission denied"
RUN npm install -g prisma

# Sao chép toàn bộ mã nguồn vào trong container
COPY . .

# Đảm bảo quyền truy cập của tất cả các tệp
RUN chown -R node:node /app

# Chạy lệnh prisma generate để tạo Prisma client
RUN npx prisma generate

# Mở cổng 3001 để phục vụ dịch vụ
EXPOSE 5004

# Khởi động ứng dụng
CMD ["npm", "start"]
