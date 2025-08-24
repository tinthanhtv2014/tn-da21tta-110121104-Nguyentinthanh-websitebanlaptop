const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // Sử dụng uuid để tạo GUID
const folderSave = path.join(__dirname, "../public/uploads");

// Hàm kiểm tra và tạo folder nếu chưa tồn tại
const checkAndCreateFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Hàm xóa file nếu tồn tại
const deleteFileIfExists = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath); // Xóa file nếu tồn tại
  }
};
// Hàm xóa folder nếu tồn tại
const deleteFolderIfExists = (folderPath) => {
  if (fs.existsSync(folderPath)) {
    const files = fs.readdirSync(folderPath);
    files.forEach((file) => {
      const currentPath = path.join(folderPath, file);
      if (fs.statSync(currentPath).isDirectory()) {
        deleteFolderIfExists(currentPath); // xóa cái folder
      } else {
        fs.unlinkSync(currentPath); // xóa các tệp
      }
    });

    fs.rmdirSync(folderPath); // Xóa folder nếu tồn tại
  }
};

const deleteFolder = (folderPath, distinctive) => {
  const fullFolderPath = path.join(
    __dirname,
    "../../public",
    folderPath,
    distinctive
  );
  deleteFolderIfExists(fullFolderPath);
  return true;
};

const apiUploadSingleFile = (file, folderPath, imgName) => {
  let newFileName;

  if (!imgName || imgName.trim() === "") {
    newFileName = uuidv4() + path.extname(file.originalname);
  } else {
    newFileName = imgName;
    const oldFilePath = path.join(folderSave, folderPath, imgName);
    deleteFileIfExists(oldFilePath);
    newFileName = uuidv4() + path.extname(file.originalname);
  }

  return new Promise((resolve, reject) => {
    const newFullFolderPath = path.join(folderSave, folderPath);

    checkAndCreateFolder(newFullFolderPath);

    const filePath = path.join(newFullFolderPath, newFileName);

    fs.writeFile(filePath, file.buffer, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          message: "File uploaded successfully!",
          fileName: newFileName,
          folderPath,
        });
      }
    });
  });
};

const apiUploadMultipleFiles = (files, folderPath) => {
  const fullFolderPath = path.join(folderSave, folderPath);

  return new Promise((resolve, reject) => {
    deleteFolderIfExists(fullFolderPath);
    checkAndCreateFolder(fullFolderPath);

    const uploadPromises = files.map((file) => {
      const newFileName = uuidv4() + path.extname(file.originalname);
      const filePath = path.join(fullFolderPath, newFileName);

      return new Promise((resolve, reject) => {
        fs.writeFile(filePath, file.buffer, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              fileName: newFileName,
              message: `File ${file.originalname} uploaded successfully!`,
              folderPath: fullFolderPath,
            });
          }
        });
      });
    });

    Promise.all(uploadPromises)
      .then((results) => resolve(results))
      .catch((error) => reject(error));
  });
};

const uploadSingleFileAsync = (file, folderPath, imgName) => {
  const newFullFolderPath = path.join(folderSave, folderPath);
  deleteFolderIfExists(newFullFolderPath);

  return new Promise((resolve, reject) => {
    checkAndCreateFolder(newFullFolderPath);

    const newFileName = uuidv4() + ".png";
    const filePath = path.join(newFullFolderPath, newFileName);

    fs.writeFile(filePath, file[0].buffer, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          message: "File uploaded successfully!",
          fileName: newFileName,
          folderPath: newFullFolderPath,
        });
      }
    });
  });
};

const uploadMultipleFilesAsync = (files, folderPath, distinctive) => {
  const fullFolderPath = path.join(folderSave, folderPath, distinctive);

  return new Promise((resolve, reject) => {
    deleteFolderIfExists(fullFolderPath);
    checkAndCreateFolder(fullFolderPath);

    const uploadPromises = files.map((file) => {
      const newFileName = uuidv4() + ".png";
      const filePath = path.join(fullFolderPath, newFileName);

      return new Promise((resolve, reject) => {
        fs.writeFile(filePath, file.buffer, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              fileName: newFileName,
              message: `File ${file.originalname} uploaded successfully!`,
              fullFolderPath,
            });
          }
        });
      });
    });

    Promise.all(uploadPromises)
      .then((results) => {
        const fileNames = results.map((file) => file.fileName);
        resolve({
          fileNames: JSON.stringify(fileNames),
          message: "Tất cả các file đã được tải lên thành công!",
          folderPath: fullFolderPath,
        });
      })
      .catch((error) => reject(error));
  });
};

module.exports = {
  apiUploadSingleFile,
  apiUploadMultipleFiles,
  uploadMultipleFilesAsync,
  uploadSingleFileAsync,
  deleteFolder,
  deleteFolderIfExists,
};
