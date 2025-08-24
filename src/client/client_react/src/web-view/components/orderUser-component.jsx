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
} from "@mui/icons-material";
import { Dashboard, AccountCircle, ExitToApp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import OrderDetailModal from "../modals/OrderDetail-modal";
import OrderReviewModal from "../modals/feedBack-modal";
import orderService from "../../services/order-service";
import { jwtDecode } from "jwt-decode";
const dummyOrders = [
  {
    id: "DH001",
    date: "2024-05-01",
    total: 450000,
    status: "Giao thành công",
    items: [
      {
        name: "Áo thun đen",
        quantity: 1,
        price: 200000,
        image:
          "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Áo thun trắng",
        quantity: 1,
        price: 300000,
        image:
          "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Quần jean xanh",
        quantity: 1,
        price: 250000,
        image:
          "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Áo thun trắng",
        quantity: 1,
        price: 300000,
        image:
          "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Quần jean xanh",
        quantity: 1,
        price: 250000,
        image:
          "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Quần jean xanh",
        quantity: 1,
        price: 250000,
        image:
          "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Áo thun trắng",
        quantity: 1,
        price: 300000,
        image:
          "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Quần jean xanh",
        quantity: 1,
        price: 250000,
        image:
          "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    id: "DH002",
    date: "2024-04-25",
    total: 320000,
    status: "Đang giao",
    items: [
      {
        name: "Áo sơ mi trắng",
        quantity: 2,
        price: 160000,
        image:
          "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
];
const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewingOrderId, setReviewingOrderId] = useState(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); // decoded chứa fullName, emailAddress, v.v...

        console.log("decoded", decoded);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.id) {
      fetchOrderUser();
    }
  }, [user]);

  const handleNavigate = (route) => navigate(route);

  const orderStatusMap = {
    all: "Tất cả",
    pending: "Chờ xác nhận",
    preparing: "Đang soạn hàng",
    delivering: "Đang giao",
    success: "Giao thành công",
    cancelled: "Đã hủy",
  };
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const fetchOrderUser = async () => {
    const response = await orderService.getOrderbyUserId({ userId: user.id });

    const list = response.listData.map((item) => ({
      ...item,
      orderStatusText: orderStatusMap[item.orderStatus],
      paymentStatusText:
        item.paymentStatus === false ? "Chưa thanh toán" : "Đã thanh toán",
      listProduct: JSON.parse(item.listProducts),
      userInfor: JSON.parse(item.user_info),
    }));

    setOrders(list);
  };

  const handleCancelOrder = async (orderId) => {
    console.log("Huỷ đơn hàng:", orderId);
    const response = await orderService.updateOrderCanceled(orderId);
    if (response) {
      fetchOrderUser();
    }
  };

  const handleOpenCancelDialog = (orderId) => {
    setSelectedOrderId(orderId);
    setOpenCancelDialog(true);
  };

  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
    setSelectedOrderId(null);
  };
  const handleConfirmCancel = async () => {
    await handleCancelOrder(selectedOrderId);
    handleCloseCancelDialog();
  };
  const handleReviewOrder = (orderId) => {
    setReviewingOrderId(orderId);
  };

  const handleSubmitReview = ({ orderId, rating, comment }) => {
    console.log("Đã đánh giá:", { orderId, rating, comment });
  };

  const getStatusProps = (orderStatus) => {
    switch (orderStatus) {
      case "pending":
        return {
          label: "Chờ xác nhận",
          color: "warning",
          icon: <HourglassEmpty fontSize="small" />,
        };
      case "preparing":
        return {
          label: "Đang soạn hàng",
          color: "info",
          icon: <Inventory fontSize="small" />, // 🆕 icon đại diện cho đang chuẩn bị hàng
        };
      case "delivering":
        return {
          label: "Đang giao",
          color: "info",
          icon: <LocalShipping fontSize="small" />,
        };
      case "success":
        return {
          label: "Giao thành công",
          color: "success",
          icon: <DoneAll fontSize="small" />,
        };
      case "cancelled":
        return {
          label: "Đã huỷ",
          color: "error",
          icon: <Cancel fontSize="small" />,
        };
      default:
        return {
          label: orderStatus,
          color: "default",
          icon: <CheckCircle fontSize="small" />,
        };
    }
  };

  const filteredOrders =
    tab === "all"
      ? orders
      : orders.filter((order) => order.orderStatus === tab);

  const orderCountByStatus = orders?.reduce((acc, order) => {
    const status = order.orderStatus;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

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
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            Đơn hàng của bạn
          </Typography>

          <Tabs
            value={tab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 3 }}
          >
            {Object.entries(orderStatusMap).map(([key, label]) => {
              const count =
                key === "all"
                  ? orders.length
                  : orders.filter((o) => o.orderStatus === key).length;

              return (
                <Tab key={key} value={key} label={`${label} (${count})`} />
              );
            })}
          </Tabs>
          <Box sx={{ maxHeight: "80vh", overflowY: "auto", pr: 1 }}>
            {filteredOrders &&
              filteredOrders.map((order) => {
                const statusProps = getStatusProps(order.orderStatus);
                return (
                  <Paper
                    key={order.id}
                    elevation={3}
                    sx={{ p: 3, mb: 3, borderRadius: 3 }}
                  >
                    <Grid
                      container
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="subtitle1">
                        Mã đơn hàng: <strong>{order.orderId}</strong>
                      </Typography>
                      <Chip
                        label={statusProps.label}
                        color={statusProps.color}
                        icon={statusProps.icon}
                      />
                    </Grid>

                    <Typography variant="body2" color="text.secondary">
                      Ngày đặt: {order.createDate}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box
                      sx={{ maxHeight: 150, overflowY: "auto", pr: 1, mb: 2 }}
                    >
                      {order.listProduct?.map((item, index) => (
                        <Grid
                          container
                          key={index}
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mb: 1 }}
                        >
                          <Grid item xs={8}>
                            <Typography>{item.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.quantity} x {item.price.toLocaleString()}đ
                            </Typography>
                          </Grid>
                          <Grid item>
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              style={{ width: 60, height: 60, borderRadius: 4 }}
                            />
                          </Grid>
                        </Grid>
                      ))}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Grid container justifyContent="space-between">
                      <Typography variant="subtitle2">Tổng cộng:</Typography>
                      <Typography variant="subtitle2" color="primary">
                        {order.totalOrderPrice?.toLocaleString()}đ
                      </Typography>
                    </Grid>

                    <Box
                      textAlign="right"
                      mt={2}
                      display="flex"
                      gap={1}
                      justifyContent="flex-end"
                      flexWrap="wrap"
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSelectedOrder(order)}
                      >
                        Xem chi tiết
                      </Button>

                      {order.orderStatus === "pending" && (
                        <Button
                          variant="contained"
                          size="small"
                          color="error"
                          onClick={() => handleOpenCancelDialog(order.id)}
                        >
                          Huỷ đơn hàng
                        </Button>
                      )}

                      {order.orderStatus === "success" && (
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          onClick={() => handleReviewOrder(order.id)}
                        >
                          Đánh giá đơn hàng
                        </Button>
                      )}
                    </Box>
                  </Paper>
                );
              })}
          </Box>
        </Grid>
      </Grid>

      {/* Modal chi tiết đơn hàng */}
      <OrderDetailModal
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />

      {/* Modal đánh giá */}
      <OrderReviewModal
        open={Boolean(reviewingOrderId)}
        onClose={() => setReviewingOrderId(null)}
        orderId={reviewingOrderId}
        onSubmit={handleSubmitReview}
      />
      <Dialog open={openCancelDialog} onClose={handleCloseCancelDialog}>
        <DialogTitle>Xác nhận huỷ đơn hàng</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn huỷ đơn hàng này không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog}>Không</Button>
          <Button color="error" onClick={handleConfirmCancel}>
            Xác nhận huỷ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderList;
