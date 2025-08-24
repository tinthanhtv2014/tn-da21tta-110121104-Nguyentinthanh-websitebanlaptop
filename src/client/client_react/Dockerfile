# Dùng Node 20 làm base image
FROM node:20

# Set thư mục làm việc trong container
WORKDIR /app

# Copy file package.json và package-lock.json để cài dependencies trước
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ source code vào container
COPY . .

# Mở port 3000 (CRA mặc định chạy ở đây)
EXPOSE 3000

# Lệnh chạy dev server
CMD ["npm", "start"]
