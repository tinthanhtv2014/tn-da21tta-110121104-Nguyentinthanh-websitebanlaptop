import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  Grid,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import orderService from "../../services/order-service";
import { toast } from "react-toastify";
import productService from "../../services/product-service";
import addressService from "../../services/address-service";
import VoucherSelectModal from "../modals/voucher-modal";
import accountService from "../../services/user-service";
import uservoucherService from "../../services/userVoucher-service";
const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, total } = location.state || {};
  const [UserId, setUserId] = useState(null);
  const token = localStorage.getItem("accessToken");
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      console.log(decoded); // xem payload bên trong
      setUserId(decoded.id);
    } else {
      console.log("No access token found");
    }
  }, [token]);

  console.log("cartItems", cartItems);

  // State quản lý thông tin người dùng, phương thức thanh toán, và địa chỉ giao hàng
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("creditCard"); // phương thức thanh toán
  const [deliveryAddress, setDeliveryAddress] = useState("currentLocation"); // Địa chỉ giao hàng mặc định là vị trí hiện tại
  const [customAddress, setCustomAddress] = useState(""); // Địa chỉ tự nhập
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [openVoucherModal, setOpenVoucherModal] = useState(false);
  const [appliedVouchers, setAppliedVouchers] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");

  const [selectedWard, setSelectedWard] = useState("");
  const [nowAddress, setNowAddress] = useState("");
  const [note, setNote] = useState("");
  // Giả lập dữ liệu tỉnh, huyện, xã

  useEffect(() => {
    fetchProvince();
  }, []);
  // useEffect(() => {
  //   fetchDistrict();
  // }, []);
  // useEffect(() => {
  //   fetchProvince();
  // }, []);
  // Xử lý khi người dùng chọn phương thức thanh toán
  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const fetchProvince = async () => {
    const response = await addressService.getProvince();
    setProvinces(response.data || []);
  };

  const fetchWard = async (provinceCode) => {
    const response = await addressService.getWards({ code: provinceCode });
    setWards(response.listData || []);
  };
  // Xử lý khi người dùng chọn địa chỉ giao hàng
  const handleDeliveryAddressChange = (event) => {
    setDeliveryAddress(event.target.value);
  };

  // Xử lý khi người dùng thay đổi Tỉnh
  const handleProvinceChange = (event) => {
    const code = event.target.value;
    setSelectedProvince(code);
    setSelectedWard("");
    setWards([]); // clear xã cũ

    fetchWard(code); // load danh sách huyện mới
  };

  const handleApplyVouchers = (vouchers) => {
    setAppliedVouchers(vouchers);
    console.log("📦 Voucher đã chọn:", vouchers); // Xử lý tại đây
  };

  useEffect(() => {
    const userAddressRaw = localStorage.getItem("userAddress");
    console.log("Địa chỉ raw từ localStorage:", userAddressRaw);

    if (userAddressRaw) {
      setNowAddress(userAddressRaw);
    }
  }, []);

  // Xử lý xác nhận thanh toán
  const handleConfirm = async () => {
    if (!cartItems || cartItems.length === 0) {
      toast.error("ko có sản phẩm để thanh toán");
      return;
    }
    if (!fullName || !email || !phone) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Email không hợp lệ!");
      return;
    }
    let Address = "";

    if (deliveryAddress === "customAddress") {
      const provinceName =
        provinces.find((p) => p.id === selectedProvince)?.fullName || "";
      const wardName = wards.find((w) => w.id === selectedWard)?.fullName || "";

      Address = `${customAddress}, ${wardName}, ${provinceName}`;
    } else if (deliveryAddress === "userAddress") {
      Address = "Địa chỉ đã lưu của người dùng";
    } else {
      Address = nowAddress; // giữ nguyên nếu là địa chỉ hiện tại
    }
    // Tạo đối tượng thông tin thanh toán
    if (appliedVouchers && appliedVouchers.length > 0) {
      for (const voucher of appliedVouchers) {
        await uservoucherService.deleteuserVouchers(UserId, voucher.id);
      }
    }
    const orderInfo = {
      userInfo: {
        fullName,
        email,
        phone,
        Address,
      },
      paymentMethod,
      deliveryAddress:
        deliveryAddress === "customAddress"
          ? {
              selectedProvince,
              selectedWard,
              customAddress,
            }
          : deliveryAddress === "userAddress"
          ? "Địa chỉ đã lưu của người dùng"
          : { nowAddress },
      cartItems: cartItems,
      totalAmount: finalTotal || 0,
      plusPoint: Math.round(total / 1000000),
      orderId: `ORDER_${fullName}_${Date.now()}`,
      userId: UserId ? UserId : null,
      note: note ? note : "",
    };
    if (paymentMethod === "momo") {
      localStorage.setItem("orderInfo", JSON.stringify(orderInfo));
      const response = processMomoPayment(orderInfo);
      return response;
    }
    if (paymentMethod === "home") {
      const response = processHomePayment(orderInfo);

      if (response) {
        const orderData = {
          orderId: orderInfo.orderId,
          customerName: orderInfo.userInfo.fullName,
          email: orderInfo.userInfo.email,
          total: orderInfo.totalAmount,
          items: orderInfo.cartItems,
        };
        const sendOrder = await accountService.sendOrderConfirmationEmail(
          orderData
        );
        const res = await productService.TruSoluong(cartItems);
        toast.success("đặt hàng thành công");
        navigate("/");
      }
    }
    if (paymentMethod === "vnpay") {
      localStorage.setItem("orderInfo", JSON.stringify(orderInfo));
      const response = processVnpayPayment(orderInfo);
      return response;
    }
  };

  const processHomePayment = async (orderInfo) => {
    const response = await orderService.createOrder(orderInfo);
    if (response && orderInfo.userId) {
      const pointRes = await accountService.updatePointUser(
        orderInfo.userId,
        orderInfo.plusPoint || 0,
        "add"
      );
    }
    return response;
  };
  const processMomoPayment = async (orderInfo) => {
    try {
      const response = await orderService.paymentMomo({
        amount: orderInfo.totalAmount,
        orderInfo: orderInfo.orderId,
        redirectUrl: "http://localhost:3000/thankpage",
        ipnUrl: "http://localhost:5003/api/orders/payment/momo-ipn",
      });

      if (response && response.payUrl) {
        // Chuyển người dùng sang MoMo để thanh toán
        setTimeout(() => {
          window.location.href = response.payUrl;
        }, 500);
      } else {
        alert("Không lấy được đường dẫn thanh toán MoMo");
      }
    } catch (error) {
      console.error("Lỗi khi gọi MoMo payment:", error);
      alert("Thanh toán MoMo thất bại!");
    }
  };

  const processVnpayPayment = async (orderInfo) => {
    try {
      const response = await orderService.paymentVnpay({
        amount: orderInfo.totalAmount,
        orderInfo: orderInfo.orderId,
      });

      if (response && response.data) {
        // Lưu orderInfo để dùng lại sau redirect

        localStorage.setItem("orderInfo", JSON.stringify(orderInfo));

        // Chuyển người dùng sang trang VNPAY
        window.location.href = response.data;
      } else {
        alert("Không lấy được đường dẫn thanh toán VNPAY");
      }
    } catch (error) {
      console.error("Lỗi khi gọi VNPAY payment:", error);
      alert("Thanh toán VNPAY thất bại!");
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <Typography sx={{ p: 4 }}>
        Không có sản phẩm nào để thanh toán.
      </Typography>
    );
  }
  const totalDiscount = appliedVouchers.reduce(
    (sum, v) => sum + (v.discountAmount || 0),
    0
  );
  const finalTotal = Math.max(0, total - totalDiscount);
  return (
    <Box sx={{ maxWidth: "1000px", mx: "auto", p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Xác nhận thanh toán
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Thông tin người nhận
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Họ và tên"
              fullWidth
              variant="outlined"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Số điện thoại"
              fullWidth
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Ghi chú"
              fullWidth
              variant="outlined"
              multiline
              rows={4} // bạn có thể chỉnh số dòng hiển thị ở đây
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Chọn phương thức thanh toán
        </Typography>
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <RadioGroup row value={paymentMethod} onChange={handlePaymentChange}>
            <FormControlLabel
              value="vnpay"
              control={<Radio />}
              label="Thanh toán vnpay"
            />
            <FormControlLabel
              value="momo"
              control={<Radio />}
              label="thanh toán momo"
            />
            <FormControlLabel
              value="home"
              control={<Radio />}
              label="Thanh toán khi nhận hàng"
            />
          </RadioGroup>
        </FormControl>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Chọn địa chỉ giao hàng
        </Typography>
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <RadioGroup
            row
            value={deliveryAddress}
            onChange={handleDeliveryAddressChange}
          >
            <FormControlLabel
              value="currentLocation"
              control={<Radio />}
              label="Sử dụng vị trí hiện tại"
            />
            <FormControlLabel
              value="userAddress"
              control={<Radio />}
              label="Sử dụng địa chỉ đã lưu"
            />
            <FormControlLabel
              value="customAddress"
              control={<Radio />}
              label="Nhập địa chỉ mới"
            />
          </RadioGroup>
        </FormControl>

        {deliveryAddress === "currentLocation" && (
          <Typography variant="body2" color="text.secondary">
            {nowAddress ? nowAddress : "bạn chưa lấy địa chỉ hiện tại"}
          </Typography>
        )}

        {deliveryAddress === "userAddress" && (
          <Typography variant="body2" color="text.secondary">
            Địa chỉ của bạn: Hà Nội, Việt Nam
          </Typography>
        )}

        {deliveryAddress === "customAddress" && (
          <Box>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Tỉnh/Thành phố</InputLabel>
              <Select
                value={selectedProvince}
                onChange={handleProvinceChange}
                label="Tỉnh/Thành phố"
              >
                {provinces.map((province) => (
                  <MenuItem key={province.id} value={province.id}>
                    {province.fullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedProvince && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Xã/Phường</InputLabel>
                <Select
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  label="Xã/Phường"
                >
                  {wards.map((ward) => (
                    <MenuItem key={ward.id} value={ward.id}>
                      {ward.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <TextField
              label="Địa chỉ chi tiết"
              fullWidth
              variant="outlined"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Thông tin đơn hàng
        </Typography>
        {cartItems.map((item) => (
          <Grid
            key={item.id}
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Grid item xs={8}>
              <Typography>
                {item.name} x {item.quantity}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Giá: {(item.salePrice || item.price).toLocaleString()}đ
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

        <Divider sx={{ my: 2 }} />

        {UserId && (
          <Box textAlign="right" mt={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setOpenVoucherModal(true)}
            >
              + Thêm voucher
            </Button>
          </Box>
        )}
        <Box mt={2}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Tạm tính:
            </Typography>
            <Typography variant="body2">{total.toLocaleString()}đ</Typography>
          </Box>

          {appliedVouchers.length > 0 && (
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Giảm giá ({appliedVouchers.length} mã):
              </Typography>
              <Typography variant="body2" color="error">
                -{totalDiscount.toLocaleString()}đ
              </Typography>
            </Box>
          )}

          <Box display="flex" justifyContent="space-between" mt={1}>
            <Typography variant="h6">Tổng cộng:</Typography>
            <Typography variant="h6" color="primary">
              {finalTotal.toLocaleString()}đ
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
        <Button variant="contained" color="success" onClick={handleConfirm}>
          Xác nhận thanh toán
        </Button>
      </Box>
      <VoucherSelectModal
        open={openVoucherModal}
        onClose={() => setOpenVoucherModal(false)}
        onSelect={handleApplyVouchers}
      />
    </Box>
  );
};

export default CheckoutPage;
