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
import roleService from "../../services/role-service";

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
  maxHeight: "90vh",
};
const basePermissions = [
  "view_user",
  "create_user",
  "edit_user",
  "delete_user",
  "view_role",
  "create_role",
  "edit_role",
  "delete_role",
];

const RoleModalMui = ({ open, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    roleName: "",
    listPermision: [],
  });
  const [permissionInput, setPermissionInput] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        roleName: initialData.roleName || "",
        listPermision:
          typeof initialData.listPermision === "string"
            ? initialData.listPermision.split(",").map((p) => p.trim())
            : initialData.listPermision || [],
      });
    } else {
      setFormData({
        roleName: "",
        listPermision: [],
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

  const handleAddPermission = () => {
    const perm = permissionInput.trim();
    if (perm && !formData.listPermision.includes(perm)) {
      setFormData((prev) => ({
        ...prev,
        listPermision: [...prev.listPermision, perm],
      }));
    }
    setPermissionInput("");
  };

  const handleRemovePermission = (permToRemove) => {
    setFormData((prev) => ({
      ...prev,
      listPermision: prev.listPermision.filter((p) => p !== permToRemove),
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      roleName: formData.roleName,
      listPermision: formData.listPermision.join(","),
    };

    try {
      if (initialData?.id) {
        await roleService.updateRole(initialData.id, payload);
      } else {
        await roleService.createRole(payload);
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
          {initialData ? "✏️ Cập nhật phân quyền" : "➕ Thêm phân quyền"}
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Tên phân quyền"
            name="roleName"
            value={formData.roleName}
            onChange={handleChange}
            fullWidth
            required
          />

          <Autocomplete
            multiple
            options={basePermissions}
            value={formData.listPermision}
            onChange={(e, newValue) =>
              setFormData((prev) => ({
                ...prev,
                listPermision: newValue,
              }))
            }
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="Danh sách quyền" />
            )}
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

export default RoleModalMui;
