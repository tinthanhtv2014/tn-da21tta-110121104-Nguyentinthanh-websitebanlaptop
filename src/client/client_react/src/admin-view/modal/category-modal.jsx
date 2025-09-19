import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Chip,
  Autocomplete,
} from "@mui/material";
import categoryService from "../../services/category-service";
import { toast } from "react-toastify";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const CategoryModalMui = ({ open, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
      });
    } else {
      setFormData({
        name: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error("Danh mục là bắt buộc!");
      return;
    }

    const payload = {
      name: formData.name,
    };

    try {
      if (initialData?.id) {
        await categoryService.updateCategory(initialData.id, payload);
      } else {
        await categoryService.createCategory(payload);
      }
      onSubmit();
      onClose();
    } catch (err) {
      console.error("Lỗi khi lưu role:", err);
      alert("Có lỗi xảy ra khi lưu phân quyền!");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          {initialData ? "✏️ Cập nhật danh mục" : "➕ Thêm danh mục"}
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Tên danh mục"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {initialData ? "Cập nhật" : "Thêm mới"}
            </Button>
            <Button variant="outlined" color="secondary" onClick={onClose}>
              Hủy
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default CategoryModalMui;
