import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Grid,
  Divider,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  Stack,
  Pagination,
  Card,
  CardContent,
  CardMedia,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  CheckCircle,
  HourglassEmpty,
  LocalShipping,
  Cancel,
  DoneAll,
  Inventory,
  Favorite,
  Star,
  Redeem,
  Discount,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { Dashboard, AccountCircle, ExitToApp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import cartService from "../../services/cart-service";
import productService from "../../services/product-service";
import wishlistService from "../../services/wishlist-service";
import orderService from "../../services/order-service";
import voucherService from "../../services/voucher-service";
import { useThemeMode } from "../../context/ThemeContext";
import uservoucherService from "../../services/userVoucher-service";
import accountService from "../../services/user-service";
const mockPointHistory = [
  {
    id: 1,
    reason: "Mua Laptop Acer Aspire",
    value: +100,
    date: "2025-07-01",
    image:
      "https://cdn.tgdd.vn/Products/Images/44/315579/acer-aspire-7-gaming-a715-76g-59mw-i5-nhqmesv006-thumb-600x600.jpg",
  },
  {
    id: 2,
    reason: "Đổi voucher giảm giá",
    value: -50,
    date: "2025-07-05",
    image: "https://cdn-icons-png.flaticon.com/512/929/929564.png",
  },
  {
    id: 3,
    reason: "Thưởng sự kiện hè",
    value: +200,
    date: "2025-07-08",
    image: "https://cdn-icons-png.flaticon.com/512/3771/3771572.png",
  },
];

const mockVouchers = [
  {
    id: "v1",
    code: "SALE10",
    discount: 10000,
    condition: "Đơn từ 200k",
    image: "https://cdn-icons-png.flaticon.com/512/1048/1048953.png",
  },
  {
    id: "v2",
    code: "FREESHIP",
    discount: 15000,
    condition: "Miễn phí vận chuyển",
    image: "https://cdn-icons-png.flaticon.com/512/891/891419.png",
  },
  {
    id: "v3",
    code: "WELCOME",
    discount: 20000,
    condition: "Chào mừng khách mới",
    image: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
  },
  {
    id: "v4",
    code: "WELCOME",
    discount: 20000,
    condition: "Chào mừng khách mới",
    image: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
  },
];

const voucherTypeIcons = {
  gift: <Redeem fontSize="large" color="secondary" />,
  ship: <LocalShipping fontSize="large" color="primary" />,
  discount: <Discount fontSize="large" color="success" />,
};

const PointHistory = () => {
  const navigate = useNavigate();
  const [totalPoint, setTotalPoint] = useState(0);
  const [page, setPage] = useState(1);
  const [pointHistory, setPointHistory] = useState([]);
  const [vouchers, setVoucher] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState("all"); // all | mine
  const isMineTab = selectedTab === "mine";
  const perPage = 4;
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); // decoded chứa fullName, emailAddress, v.v...
        getUserData(decoded.id);

        console.log("decoded", decoded);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const getUserData = async (id) => {
    const response = await accountService.getUserById(id);
    setTotalPoint(response.points);
  };

  useEffect(() => {
    if (user && user.id) {
      fetchPointHistory();
      fetchVoucher();
    }
  }, [user]);
  useEffect(() => {
    if (user && user.id) {
      fetchVoucher();
    }
  }, [user, selectedTab]);

  const fetchPointHistory = async () => {
    if (user && user.id) {
      const response = await orderService.getOrderbyUserId({
        userId: user.id,
        sortList: [{ key: "orderStatus", value: "success" }],
      });

      const total = response.listData.reduce(
        (acc, item) => acc + item.plusPoint,
        0
      );
      setTotalPoint((prev) => prev + total);
      setPointHistory(response.listData);
    }
  };

  const fetchVoucher = async () => {
    if (selectedTab === "all") {
      const respone = await voucherService.getVouchers({
        optionExtend: [{ key: "userId", value: user.id }],
      });
      if (respone) {
        setVoucher(respone.listData);
      }
    } else {
      const respone = await voucherService.getVouchersUser({
        optionExtend: [{ key: "userId", value: user.id }],
      });
      if (respone) {
        setVoucher(respone.listData);
      }
    }
  };

  const paginatedHistory = pointHistory.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const handleExchangeVoucher = async (id, point) => {
    if (user && user.id) {
      const data = {
        voucherId: id,
        userId: user.id,
      };
      const response = await uservoucherService.createuserVouchers(data);

      console.log("respone", response);
      if (response) {
        toast.success("đổi voucher thành công");
        fetchVoucher();
        const data = await accountService.updatePointUser(
          user.id,
          point,
          "subtract"
        );
        const targetPoint = data.points;
        const step = 1;
        const interval = 20; // ms mỗi bước
        const timer = setInterval(() => {
          setTotalPoint((prev) => {
            if (prev <= targetPoint) {
              clearInterval(timer);
              return targetPoint;
            }
            return prev - step;
          });
        }, interval);
      }
    }
  };

  const handleNavigate = (route) => navigate(route);

  return (
    <Box sx={{ pt: 6, maxWidth: "1500px", width: "100%", mx: "auto", pb: 6 }}>
      <Grid container spacing={3}>
        {/* Sidebar */}
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

        {/* Orders */}
        {/* Wishlist Product List */}
        <Grid item xs={12} md={8}>
          <Box sx={{ maxHeight: "80vh", overflowY: "auto", pr: 1 }}>
            <Typography variant="h5" gutterBottom fontWeight={700}>
              Điểm tích lũy
            </Typography>

            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 4,
              }}
            >
              <Star color="error" sx={{ fontSize: 48, mr: 2 }} />
              <Box textAlign="center">
                <Typography variant="h6" align="center">
                  Tổng điểm hiện tại
                </Typography>
                <Typography
                  variant="h4"
                  color="error"
                  fontWeight={700}
                  align="center"
                >
                  {totalPoint} điểm
                </Typography>
              </Box>
            </Paper>

            <Paper elevation={3} sx={{ p: 3, borderRadius: 4, mb: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Lịch sử giao dịch điểm
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {paginatedHistory.map((item) => (
                  <Grid item xs={12} key={item.id}>
                    <Card
                      variant="outlined"
                      sx={{ display: "flex", borderRadius: 3 }}
                    >
                      <CardMedia
                        component="img"
                        sx={{ width: 60, objectFit: "contain", p: 1 }}
                        image={
                          "https://cdn-icons-png.flaticon.com/512/3771/3771572.png"
                        }
                        alt={item.reason}
                      />
                      <CardContent sx={{ flex: 1 }}>
                        <Typography fontWeight={600}>
                          Cộng điểm khi mua hàng
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.updateDate}
                        </Typography>
                      </CardContent>
                      <Box
                        sx={{
                          pr: 2,
                          display: "flex",
                          alignItems: "center",
                          fontWeight: 700,
                        }}
                        color={item.plusPoint > 0 ? "green" : "error"}
                      >
                        {item.plusPoint > 0 ? "+" : ""}
                        {item.plusPoint} điểm
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Box mt={2} display="flex" justifyContent="center">
                <Pagination
                  count={Math.ceil(pointHistory.length / perPage)}
                  page={page}
                  onChange={(_, val) => setPage(val)}
                  color="primary"
                />
              </Box>
            </Paper>

            <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Voucher có thể đổi
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mb: 2,
                  gap: 1,
                }}
              >
                <Button
                  variant={selectedTab === "all" ? "contained" : "outlined"}
                  onClick={() => setSelectedTab("all")}
                >
                  Tất cả voucher
                </Button>
                <Button
                  variant={selectedTab === "mine" ? "contained" : "outlined"}
                  onClick={() => setSelectedTab("mine")}
                >
                  Voucher của tôi
                </Button>
              </Box>

              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {vouchers && vouchers.length > 0 ? (
                  vouchers.map((voucher) => {
                    const disabled = totalPoint < voucher.number1;
                    const icon = <Redeem fontSize="large" />;

                    return (
                      <Grid item xs={12} sm={6} md={4} key={voucher.id}>
                        <Card
                          sx={{
                            p: 2,
                            display: "flex",
                            alignItems: "center",
                            borderRadius: 3,
                          }}
                          variant="outlined"
                        >
                          <Box sx={{ mr: 2 }}>{icon}</Box>
                          <CardContent sx={{ flex: 1 }}>
                            <Typography fontWeight={700}>
                              {voucher.code}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Giảm {voucher.discountAmount?.toLocaleString()}đ
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Đơn tối thiểu{" "}
                              {voucher.minOrderValue?.toLocaleString()}đ
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              HSD:{" "}
                              {new Date(voucher.expiryDate).toLocaleDateString(
                                "vi-VN"
                              )}
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              sx={{ mt: 0.5 }}
                              color={
                                disabled ? "text.secondary" : "success.main"
                              }
                            >
                              Cần {voucher.number1} điểm để đổi
                            </Typography>
                            <Button
                              variant="contained"
                              size="small"
                              fullWidth
                              sx={{ mt: 1 }}
                              disabled={disabled || isMineTab}
                              onClick={() =>
                                handleExchangeVoucher(
                                  voucher.id,
                                  voucher.number1
                                )
                              }
                            >
                              {isMineTab ? "Đã sở hữu" : "Đổi ngay"}
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })
                ) : (
                  <Grid item xs={12}>
                    <Typography
                      variant="body1"
                      align="center"
                      color="text.secondary"
                    >
                      Bạn chưa đổi voucher nào
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PointHistory;
