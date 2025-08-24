import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import Cookies from "js-cookie";
import axios from "axios";
import accountService from "../../services/user-service";
import { jwtDecode } from "jwt-decode";
const HeaderAdmin = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const api = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [localUser, setLocalUser] = useState(null); // Thông tin user lấy từ API
  const [timeLeft, setTimeLeft] = useState(null); // thời gian còn lại (s)
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        const decoded = jwtDecode(accessToken);
        if (decoded && decoded.id) {
          try {
            const res = await accountService.getUserById(decoded.id);
            console.log("check data", res);
            setLocalUser(res);
          } catch (error) {
            console.error("Lỗi khi lấy thông tin user:", error);
          }

          // Tính thời gian còn lại (đơn vị: giây)
          const now = Date.now() / 1000; // tính theo giây
          const remaining = Math.floor(decoded.exp - now);
          setTimeLeft(remaining > 0 ? remaining : 0);
        }
      }
    };

    fetchUser();
    setAnchorEl(null);
    setIsOpen(false);
  }, [isAuthenticated]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (!timeLeft) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);
  const handleMenuOpen = (event) => {
    if (!isAuthenticated) return;
    setAnchorEl(event.currentTarget);
    setIsOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("accessToken");
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const displayUser =
    localUser?.fullName || localUser?.fullName || "Người dùng";
  const avatarSrc = localUser?.avatar || localUser?.avatar;
  const formattedTime = currentTime.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const hDisplay = h > 0 ? `${h} giờ ` : "";
    const mDisplay = `${m} phút `;
    const sDisplay = `${s < 10 ? "0" : ""}${s} giây`;

    return `${hDisplay}${mDisplay}${sDisplay}`;
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#8aad51" }}>
      <Toolbar>
        <Box sx={{ color: "white", mr: 3, fontWeight: "bold" }}>
          🕒 {formattedTime}
        </Box>
        {timeLeft !== null && (
          <Box sx={{ color: "white", mr: 3 }}>
            Phiên đăng nhập sẽ hết hạn sau: {formatTime(timeLeft)}
          </Box>
        )}
        <Box sx={{ display: "flex", flexGrow: 1, alignItems: "center" }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              fontWeight: "bold",
              fontSize: "1.5rem",
              marginRight: 2,
              color: "white",
              textDecoration: "none",
            }}
          >
            <img
              src={`https://image.cocoonvietnam.com/uploads/vegan_society_41cc2b390a.svg`}
              alt=""
              style={{ width: "40px", marginTop: "10px" }}
            />
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isAuthenticated ? (
            <>
              <Button
                variant="text"
                sx={{ padding: 2, color: "#fff" }}
                onClick={handleMenuOpen}
              >
                {avatarSrc ? (
                  <Avatar src={`${api}/${avatarSrc}`} alt="avatar" />
                ) : (
                  <AccountCircle />
                )}
                <Typography variant="body2" sx={{ ml: 2, color: "white" }}>
                  {displayUser}
                </Typography>
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={isOpen}
                onClose={handleMenuClose}
                sx={{ mt: 1 }}
              >
                <MenuItem component={Link} to="/profile">
                  Thông tin cá nhân
                </MenuItem>
                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
              </Menu>
            </>
          ) : (
            <IconButton
              component={Link}
              to="/login"
              sx={{ color: "white", textDecoration: "none" }}
            >
              <AccountCircle />
              <Typography variant="body2" sx={{ marginLeft: 1 }}>
                Đăng nhập
              </Typography>
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderAdmin;
