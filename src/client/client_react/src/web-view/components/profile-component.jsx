import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  Box,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Edit,
  PhotoCamera,
  Save,
  Dashboard,
  AccountCircle,
  ExitToApp,
  Lock,
  Favorite,
  Star,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import accountService from "../../services/user-service";
import { toast } from "react-toastify";
const API_URL = process.env.REACT_APP_API_BASE_URL;
const Profile = () => {
  const [userData, setUserData] = useState();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(userData?.avatar || "");
  const [changePassword, setChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); // decoded chứa fullName, emailAddress, v.v...
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    if (user && user.id) {
      const response = await accountService.getUserById(user.id);
      if (response) {
        setUserData(response);
      }
    }
  };

  const handleEditToggle = () => setEditMode(!editMode);
  const handlePasswordToggle = () => setChangePassword(!changePassword);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file)); // Preview ảnh mới
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    try {
      if (user && user.id) {
        const response = await accountService.updateAvatarUser(
          user.id,
          formData
        );
        if (response) {
          toast.success("Cập nhật ảnh đại diện thành công!");
        }
      }
    } catch (error) {
      console.error("Upload avatar error:", error);
      toast.error("Lỗi khi cập nhật ảnh đại diện");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const updatedData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        emailAddress: userData.emailAddress,
        phoneNumber: userData.phoneNumber,
        address: userData.address,
      };

      const response = await accountService.updateDynamicUser(
        user.id,
        updatedData
      ); // Gọi API update

      if (response) {
        setEditMode(false);
        fetchUserData();
        toast.success("Cập nhật thông tin thành công!");
      } else {
        toast.error("không thể cập nhật lúc này!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      alert("Đã xảy ra lỗi khi cập nhật.");
    }
  };

  const handleSavePassword = async () => {
    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu mới và xác nhận không khớp.");
      return;
    }
    const newPassword = passwordData.confirmPassword;
    console.log("newPassword;đâsdad", newPassword);
    try {
      const dataUpdate = await accountService.updatePasswordUser(
        user.id,
        newPassword
      );
      if (dataUpdate) {
        toast.success("Cập nhật mật khẩu thành công!");
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setChangePassword(false);
      } else {
        toast.error("thất bại");
      }
    } catch (error) {
      console.error("Lỗi cập nhật mật khẩu:", error);
      alert("Có lỗi xảy ra khi cập nhật mật khẩu.");
    }
  };

  const handleNavigate = (route) => {
    navigate(route);
  };

  return (
    <Box
      sx={{
        pt: 6,
        maxWidth: "1500px",
        width: "100%",
        margin: "0 auto",
        pb: 6,
      }}
    >
      <Grid container spacing={3}>
        {/* Mini Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Menu cá nhân
            </Typography>
            <List>
              <ListItem button onClick={() => handleNavigate("/profile")}>
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText primary="Thông tin cá nhân" />
              </ListItem>
              <ListItem button onClick={() => handleNavigate("/userOrder")}>
                <ListItemIcon>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText primary="Đơn hàng cá nhân" />
              </ListItem>
              <ListItem button onClick={() => handleNavigate("/wishlist")}>
                <ListItemIcon>
                  <Favorite />
                </ListItemIcon>
                <ListItemText primary="Sản phẩm yêu thích" />
              </ListItem>
              <ListItem button onClick={() => handleNavigate("/pointHistory")}>
                <ListItemIcon>
                  <Star />
                </ListItemIcon>
                <ListItemText primary="Điểm tích lũy" />
              </ListItem>
              <ListItem button onClick={() => handleNavigate("/logout")}>
                <ListItemIcon>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText primary="Đăng xuất" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Profile Info */}
        {!userData ? (
          <Typography>Đang tải thông tin người dùng...</Typography> // hoặc Skeleton
        ) : (
          <Grid item xs={12} md={8}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
                  <Box sx={{ position: "relative", display: "inline-block" }}>
                    <Avatar
                      alt="User Avatar"
                      src={
                        avatarPreview || `${API_URL}${userData.avatar}` || ""
                      }
                      sx={{
                        width: 120,
                        height: 120,
                        mx: "auto",
                        mb: 1,
                        border: "2px solid #ccc",
                      }}
                    />
                    <IconButton
                      component="label"
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        right: 8,
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        "&:hover": { backgroundColor: "#f0f0f0" },
                      }}
                    >
                      <PhotoCamera fontSize="small" />
                      <input type="file" hidden onChange={handleAvatarChange} />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Đổi ảnh đại diện
                  </Typography>

                  {/* Hiện nút "Lưu ảnh" nếu có file avatar mới */}
                  {avatarFile && (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={handleUploadAvatar}
                    >
                      Lưu ảnh
                    </Button>
                  )}
                </Grid>

                <Grid item xs={12} sm={8}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h5">Thông tin cá nhân</Typography>
                    {!editMode && (
                      <Tooltip title="Chỉnh sửa">
                        <IconButton color="primary" onClick={handleEditToggle}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>

                  <TextField
                    label="firstName"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    fullWidth
                    margin="normal"
                  />

                  <TextField
                    label="lastName"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    fullWidth
                    margin="normal"
                  />

                  <TextField
                    label="địa chỉ Emal"
                    name="emailAddress"
                    value={userData.emailAddress}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    fullWidth
                    margin="normal"
                  />

                  <TextField
                    label="Số điện thoại"
                    name="phoneNumber"
                    value={userData.phoneNumber}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    fullWidth
                    margin="normal"
                  />

                  <TextField
                    label="Địa chỉ"
                    name="address"
                    value={userData.address}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />

                  <Box sx={{ mt: 4 }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<Lock />}
                      onClick={handlePasswordToggle}
                    >
                      Đổi mật khẩu
                    </Button>

                    {changePassword && (
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <TextField
                          label="Mật khẩu hiện tại"
                          type="password"
                          name="oldPassword"
                          value={passwordData.oldPassword}
                          onChange={handleChange}
                          fullWidth
                        />
                        <TextField
                          label="Mật khẩu mới"
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handleChange}
                          fullWidth
                        />
                        <TextField
                          label="Xác nhận mật khẩu mới"
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handleChange}
                          fullWidth
                        />

                        {/* ✅ Nút cập nhật mật khẩu */}
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleSavePassword}
                          sx={{ alignSelf: "flex-start" }}
                        >
                          Cập nhật mật khẩu
                        </Button>
                      </Box>
                    )}
                  </Box>
                  {editMode && (
                    <Box sx={{ textAlign: "right", mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Save />}
                        onClick={handleSaveChanges} // Hàm xử lý lưu thay đổi
                      >
                        Cập nhật
                      </Button>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Profile;
