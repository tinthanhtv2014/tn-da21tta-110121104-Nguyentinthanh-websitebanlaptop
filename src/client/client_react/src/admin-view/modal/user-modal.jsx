import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
} from "@mui/material";
import accountService from "../../services/user-service";
import roleService from "../../services/role-service";
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
  maxHeight: "90vh",
};

const UserModalMui = ({ open, onClose, onSubmit, initialData = null }) => {
  const [role, setRole] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    address: "",
    points: 0,
    status: "Active",
    role: 0,
    password: "",
    avatar: null, // Thêm dòng này
  });
  useEffect(() => {
    fetchDataRole(); // Gọi API lấy role
  }, []);
  useEffect(() => {
    if (initialData) {
      const [first, ...rest] = initialData.fullName?.split(" ") || ["", ""];
      const last = rest.join(" ");
      setFormData({
        firstName: first || "",
        lastName: last || "",
        emailAddress: initialData.emailAddress || "",
        phoneNumber: initialData.phoneNumber || "",
        address: initialData.address || "",
        points: initialData.points || 0,
        status: initialData.status || "Active",
        role: initialData.role ?? 0,
        password: "", // Không hiển thị mật khẩu cũ khi chỉnh sửa
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        emailAddress: "",
        phoneNumber: "",
        address: "",
        points: 0,
        status: "Active",
        role: 0,
        password: "", // Khi thêm mới thì mật khẩu là rỗng
      });
    }
  }, [initialData]);

  const fetchDataRole = async () => {
    try {
      const response = await roleService.getRoles();
      if (response && response.listData) {
        setRole(response.listData);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách role:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "points" || name === "role" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.emailAddress) {
      toast.error("Email là bắt buộc khi thêm mới người dùng.");

      return;
    }

    if (!initialData && !formData.password) {
      toast.error("Mật khẩu là bắt buộc khi thêm mới người dùng.");

      return;
    }
    console.log("sdahsdljahsdfasf", initialData);

    const formPayload = new FormData();
    formPayload.append("firstName", formData.firstName);
    formPayload.append("lastName", formData.lastName);
    formPayload.append("emailAddress", formData.emailAddress);
    formPayload.append("phoneNumber", formData.phoneNumber);
    formPayload.append("address", formData.address);
    formPayload.append("points", formData.points);
    formPayload.append("status", formData.status);
    formPayload.append("role", formData.role);
    formPayload.append("password", formData.password);
    if (formData.avatar) {
      formPayload.append("avatar", formData.avatar);
    } else if (initialData?.avatar && typeof initialData.avatar === "string") {
      formPayload.append("avatar", initialData.avatar);
    }

    try {
      if (initialData?.id) {
        await accountService.updateUser(initialData.id, formPayload);
      } else {
        await accountService.createUser(formPayload);
      }
      onSubmit(); // Gọi fetchUser() ở ngoài
      onClose(); // Đóng modal sau khi xong
    } catch (err) {
      console.error("Lỗi khi lưu người dùng:", err);
      alert("Đã xảy ra lỗi khi lưu người dùng!");
    }
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          {initialData ? "✏️ Cập nhật người dùng" : "➕ Thêm người dùng"}
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Họ (First Name)"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Tên (Last Name)"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Email"
            name="emailAddress"
            type="email"
            value={formData.emailAddress}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Số điện thoại"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Địa chỉ"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Điểm tích lũy"
            name="points"
            type="number"
            value={formData.points}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Trạng thái"
            name="status"
            value={formData.status}
            onChange={handleChange}
            select
            fullWidth
          >
            <MenuItem value="Active">Hoạt động</MenuItem>
            <MenuItem value="Inactive">Ngưng hoạt động</MenuItem>
          </TextField>
          <TextField
            label="Quyền"
            name="role"
            value={formData.role}
            onChange={handleChange}
            select
            fullWidth
          >
            {role.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.roleName}
              </MenuItem>
            ))}
          </TextField>
          <input
            accept="image/*"
            type="file"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                avatar: e.target.files[0], // Lưu file vào state
              }))
            }
          />

          {initialData?.avatar && !formData.avatar && (
            <img
              src={initialData.avatar}
              alt="Avatar"
              style={{ width: 80, height: 80, borderRadius: "50%" }}
            />
          )}

          {formData.avatar && (
            <img
              src={URL.createObjectURL(formData.avatar)}
              alt="Preview"
              style={{ width: 80, height: 80, borderRadius: "50%" }}
            />
          )}

          {/* Thêm trường mật khẩu */}
          <TextField
            label="Mật khẩu"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required={initialData ? false : true} // Mật khẩu không bắt buộc khi chỉnh sửa
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

export default UserModalMui;
