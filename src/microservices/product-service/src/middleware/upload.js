const multer = require("multer");

// Sử dụng bộ nhớ tạm thời để lưu file
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

module.exports = upload;
