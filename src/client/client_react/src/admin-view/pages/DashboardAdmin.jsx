import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SettingsIcon from "@mui/icons-material/Settings";
import orderService from "../../services/order-service";
import accountService from "../../services/user-service";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
} from "@novu/notification-center";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];

const notifications = [
  {
    icon: <PeopleIcon color="primary" />,
    title: "User Notification",
    time: "5 phút trước",
  },
  {
    icon: <ShoppingCartIcon color="secondary" />,
    title: "Order Notification",
    time: "10 phút trước",
  },
  {
    icon: <SettingsIcon color="action" />,
    title: "Product Notification",
    time: "20 phút trước",
  },
];

const socket = io(`${process.env.REACT_APP_API_BASE_URL_ORDER}`);
export default function DashboardContent() {
  const [orderStat, setOrderStat] = useState([]);
  const [topProduct, setTopproduct] = useState([]);
  const [topProductAllTime, setTopproductAllTime] = useState([]);
  const [totalOrderChart, setTotalOrderChart] = useState([]);
  const [revenueTime, setRevenueTime] = useState([]);
  const [UserChartData, setUserChartData] = useState([]);
  useEffect(() => {
    fetchOrderStatusStat();
    fetchProductTop();
    fetchTotalMonth();
    fetchRevenueTime();
    fetchUserMonthlyStats();
    fetchProductTopAlltime();
  }, []);

  // useEffect(() => {
  //   socket.on("newOrder", (data) => {
  //     console.log("📦 Đơn hàng mới:", data);
  //     // Ở đây có thể show notification MUI Snackbar
  //     toast.success(`📦 Đơn hàng mới: ${data || "Chưa có mã"}`);
  //   });

  //   return () => {
  //     socket.off("newOrder");
  //   };
  // }, []);

  const fetchOrderStatusStat = async () => {
    const response = await orderService.getOrderStatusStats();
    if (response) {
      setOrderStat(response);
    }
  };

  const fetchProductTop = async () => {
    const response = await orderService.getTop5Products();
    if (response) {
      setTopproduct(response);
    }
  };
  const fetchProductTopAlltime = async () => {
    const response = await orderService.getTop5ProductsAllTime();
    if (response) {
      setTopproductAllTime(response);
    }
  };
  const fetchTotalMonth = async (year) => {
    const response = await orderService.getMonthlyRevenueStats(2025);
    const chartFormat = response.map((item) => ({
      name: `Tháng ${item.month}`,
      orders: item.totalRevenue,
    }));

    setTotalOrderChart(chartFormat);
  };

  const fetchRevenueTime = async () => {
    // Gọi cả 2 API song song cho nhanh
    const [revenueRes, userRes] = await Promise.all([
      orderService.getRevenueStats(),
      accountService.getUserStats(),
    ]);

    if (revenueRes && userRes) {
      const formattedStats = [
        {
          label: "Doanh thu hôm nay",
          value: revenueRes.daily.value.toLocaleString("vi-VN") + " ₫",
          trend:
            (revenueRes.daily.percent >= 0 ? "▲ " : "▼ ") +
            Math.abs(revenueRes.daily.percent).toFixed(2) +
            "%",
          trendColor: revenueRes.daily.percent >= 0 ? "#00e676" : "#ff5252",
          bgColor: "#1976d2",
        },
        {
          label: "Doanh thu tháng này",
          value: revenueRes.monthly.value.toLocaleString("vi-VN") + " ₫",
          trend:
            (revenueRes.monthly.percent >= 0 ? "▲ " : "▼ ") +
            Math.abs(revenueRes.monthly.percent).toFixed(2) +
            "%",
          trendColor: revenueRes.monthly.percent >= 0 ? "#00e676" : "#ff5252",
          bgColor: "#9c27b0",
        },
        {
          label: "Doanh thu năm nay",
          value: revenueRes.yearly.value.toLocaleString("vi-VN") + " ₫",
          trend:
            (revenueRes.yearly.percent >= 0 ? "▲ " : "▼ ") +
            Math.abs(revenueRes.yearly.percent).toFixed(2) +
            "%",
          trendColor: revenueRes.yearly.percent >= 0 ? "#00e676" : "#ff5252",
          bgColor: "#ff9800",
        },
        {
          label: "Người dùng mới tháng này",
          value: userRes.total.toLocaleString("vi-VN"),
          trend:
            (userRes.percent >= 0 ? "▲ " : "▼ ") +
            Math.abs(userRes.percent).toFixed(2) +
            "%",
          trendColor: userRes.percent >= 0 ? "#00e676" : "#ff5252",
          bgColor: "#4caf50",
        },
      ];

      setRevenueTime(formattedStats);
    }
  };

  const fetchUserMonthlyStats = async (year) => {
    const response = await accountService.getNewUsersByMonth(year);

    const chartFormat = response.map((item, index) => {
      let percentChange = 0;
      if (index > 0 && response[index - 1].count > 0) {
        percentChange =
          ((item.count - response[index - 1].count) /
            response[index - 1].count) *
          100;
      } else if (
        index > 0 &&
        response[index - 1].count === 0 &&
        item.count > 0
      ) {
        percentChange = 100; // từ 0 lên có user
      }
      return {
        name: `Tháng ${item.month}`,
        users: item.count,
        change: parseFloat(percentChange.toFixed(2)),
      };
    });

    setUserChartData(chartFormat);
  };

  return (
    <Box sx={{ mt: 8, p: 3, backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      <Grid container spacing={3}>
        {revenueTime &&
          revenueTime.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  backgroundColor: stat.bgColor,
                  color: "#fff",
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {stat.value}
                  </Typography>
                  {stat.trend && (
                    <Typography
                      variant="body2"
                      sx={{ color: stat.trendColor, fontWeight: "bold" }}
                    >
                      {stat.trend}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        {/* <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#e3f2fd", borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thông báo
              </Typography>
              <List>
                {notifications.map((noti, i) => (
                  <ListItem key={i}>
                    <ListItemIcon>{noti.icon}</ListItemIcon>
                    <ListItemText primary={noti.title} secondary={noti.time} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid> */}
        {/* <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, backgroundColor: "#e8f5e9" }}>
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                color="secondary"
              >
                🔔 Hoạt động người dùng
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PeopleIcon sx={{ color: "#4caf50", fontSize: 28 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography fontWeight={500}>
                        Nguyễn Văn A đăng nhập
                      </Typography>
                    }
                    secondary="⏱️ 2 phút trước"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ShoppingCartIcon sx={{ color: "#ff9800", fontSize: 28 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography fontWeight={500}>
                        Trần Thị B vừa đặt hàng
                      </Typography>
                    }
                    secondary="⏱️ 15 phút trước"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SettingsIcon sx={{ color: "#3f51b5", fontSize: 28 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography fontWeight={500}>
                        Cập nhật sản phẩm
                      </Typography>
                    }
                    secondary="⏱️ 1 giờ trước"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid> */}
        <Grid container spacing={2} mt={2}>
          <Grid item xs={6}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Thống kê tổng đơn hàng
                </Typography>
                <Box component={Paper} sx={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ backgroundColor: "#f0f0f0" }}>
                      <tr>
                        <th style={tableHeaderStyle}>Tổng đơn hàng</th>
                        <th style={tableHeaderStyle}>Trạng thái</th>
                        <th style={tableHeaderStyle}>Tổng tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderStat &&
                        orderStat.length > 0 &&
                        orderStat.map((stat, index) => (
                          <tr key={index}>
                            <td style={tableCellStyle}>{stat.count}</td>

                            <td
                              style={{
                                ...tableCellStyle,
                                fontWeight: "bold",
                                color: getStatusColor(stat.orderStatus),
                              }}
                            >
                              {stat.orderStatus}
                            </td>

                            {/* Total Amount (format tiền) */}
                            <td style={tableCellStyle}>
                              {stat.totalOrderPrice.toLocaleString("vi-VN")} ₫
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6}>
            <Card sx={{ borderRadius: 2, backgroundColor: "#f3e5f5" }}>
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  color="primary"
                >
                  💎 Sản phẩm bán chạy trong tháng
                </Typography>
                <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Sản phẩm</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Số lượng</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topProduct &&
                        topProduct.length > 0 &&
                        topProduct.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  style={{ borderRadius: 4 }}
                                />
                                {product.name}
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              {product.totalQuantity}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={1}>
          {/* Top Products */}

          {/* User Activity */}

          {/* Sales Overview Chart */}
          <Grid item xs={12} md={7}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Doanh số theo tháng
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={totalOrderChart}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#26c6da" name="Doanh số" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top sản phẩm bán chạy nhất
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={topProductAllTime}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {topProductAllTime.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          {/* Performance Summary */}

          <Grid item xs={12} md={12}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Biểu đồ người dùng mới theo tháng
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={UserChartData}>
                    <XAxis dataKey="name" />
                    <YAxis
                      yAxisId="left"
                      label={{
                        value: "User",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      label={{
                        value: "% thay đổi",
                        angle: -90,
                        position: "insideRight",
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="users"
                      fill="#42a5f5"
                      name="Người dùng mới"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="change"
                      stroke="#ff9800"
                      name="% thay đổi"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

// Table cell styles
const tableHeaderStyle = {
  padding: 12,
  textAlign: "left",
  fontWeight: "bold",
};

const tableCellStyle = {
  padding: 12,
  textAlign: "left",
  borderBottom: "1px solid #ddd",
};

// Custom function to color status
function getStatusColor(status) {
  switch (status) {
    case "Approved":
      return "#2e7d32";
    case "Pending":
      return "#f9a825";
    case "Rejected":
      return "#c62828";
    default:
      return "#000";
  }
}
