import React, { useEffect, useState } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Divider,
  TableBody,
  TableCell,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import orderService from "../../services/order-service";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  overflowX: "auto",
  overflowY: "auto",
  maxHeight: "90vh",
};

const OrderModalMui = ({
  open,
  onClose,
  onSubmit,
  initialData = null,
  seenUser,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0.0,
    image: [],
    imageFiles: [],
    type: "", // ← thêm dòng này
    brand: "",
    cpu: "",
    ram: "",
    storage: "",
    screen: "",
    graphics: "",
    os: "",
    ports: "",
    battery: "",
    weight: "",
    warranty: "",
    categoryId: 1,
    createdAt: "",
    accessoryType: "",
    connection: "",
    compatibleWith: "",
    importquantity: 0,
    importPrice: 0,
    manufactureYear: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0.0,
        image: "",
        brand: "",
        cpu: "",
        ram: "",
        storage: "",
        screen: "",
        graphics: "",
        os: "",
        ports: "",
        battery: "",
        weight: "",
        warranty: "",
        categoryId: 1,
        createdAt: "",
        accessoryType: "",
        connection: "",
        compatibleWith: "",
        importquantity: 0,
        importPrice: 0,

        manufactureYear: 0,
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
    try {
      if (initialData?.id) {
        await orderService.updateOrder(initialData.id, formData);
      }
      onSubmit(); // Gọi fetchUser() ở ngoài
      onClose(); // Đóng modal sau khi xong
    } catch (err) {
      console.error("Lỗi khi lưu người dùng:", err);
      alert("Đã xảy ra lỗi khi lưu người dùng!");
    }
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" gutterBottom>
          ✏️ Cập nhật đơn hàng
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            borderRadius: 2,
            boxShadow: 1,
            backgroundColor: "#f5f5f5",
            marginBottom: 2,
          }}
        >
          <Avatar sx={{ width: 56, height: 56, bgcolor: "#d32f2f" }}>
            {formData?.userInfor?.fullName || "Khách hàng"}
          </Avatar>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {formData?.userInfor?.fullName || "Khách hàng"}
            </Typography>

            {/* Hàng ngang gồm số điện thoại và email */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 1,
                gap: 2, // hoặc thử 3 nếu muốn rộng hơn
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: "medium", color: "text.primary" }}
              >
                📞 {formData?.userInfor?.phone || "Chưa có số điện thoại"}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: "medium", color: "text.primary" }}
              >
                ✉️ {formData?.userId ? "Khách hàng hệ thống" : "Khách vãng lai"}
              </Typography>
            </Box>

            {/* Địa chỉ nằm dưới */}
            <Typography
              variant="body2"
              sx={{ fontWeight: "medium", color: "text.primary", mt: 1 }}
            >
              🏠 {formData?.userInfor?.Address || "không có"}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2, backgroundColor: "black" }} />{" "}
        <Typography variant="h6" gutterBottom sx={{ p: 2 }}>
          Danh sách sản phẩm
        </Typography>
        <TableContainer
          component={Paper}
          sx={{
            mt: 2,
            maxHeight: 400,
            maxWidth: 1000,
            overflowX: "auto",
            overflowY: "auto",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Hình ảnh</TableCell>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell>Giá gốc (đ)</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Giảm giá (%)</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {initialData ? (
                initialData.listProduct.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product?.imageUrl || ""}
                        alt={product?.name || "Không có tên"}
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                        onError={(e) => (e.target.src = "")}
                      />
                    </TableCell>
                    <TableCell>
                      {product?.title?.trim()
                        ? product?.title
                        : product?.name || "N/A"}
                    </TableCell>
                    <TableCell>
                      {product?.price
                        ? product?.price.toLocaleString() + " đ"
                        : "N/A"}
                    </TableCell>

                    <TableCell>{product?.quantity || "N/A"}</TableCell>
                    <TableCell>
                      {product.sale ? product?.sale + "%" : "0%"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Chưa có sản phẩm nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 0.5, // Khoảng cách giữa các dòng
            padding: 2,
            backgroundColor: "#ffffff", // Nền trắng
            borderRadius: "8px", // Giữ bo góc
          }}
        >
          {/* <Typography
          variant="body2"
          sx={{
            textAlign: "right",
            color: "#1565C0",
            fontWeight: "bold",
          }}
        >
          Giá gốc:{" "}
          {(
            (parseFloat(form?.priceAfterVoucher) -
              (parseFloat(SHIP?.valuechinh) || 0)) /
            (1 + (parseFloat(VAT?.valuephantram) || 0) / 100)
          ).toLocaleString()}{" "}
          ₫
        </Typography>

        <Typography
          variant="body2"
          sx={{
            textAlign: "right",
            color: "#1565C0",
            fontWeight: "bold",
          }}
        >
          Phí VAT:{" "}
          {(
            ((parseFloat(form?.priceAfterVoucher) -
              (parseFloat(SHIP?.valuechinh) || 0)) /
              (1 + (parseFloat(VAT?.valuephantram) || 0) / 100)) *
            ((parseFloat(VAT?.valuephantram) || 0) / 100)
          ).toLocaleString()}{" "}
          ₫
        </Typography>

        <Typography
          variant="body2"
          sx={{
            textAlign: "right",
            color: "#1565C0",
            fontWeight: "bold",
          }}
        >
          Phí vận chuyển:{" "}
          {parseFloat(SHIP?.valuechinh || 30000).toLocaleString()} ₫
        </Typography> */}

          <Typography
            variant="body1"
            sx={{
              textAlign: "right",
              fontWeight: "bold",
              color: "#d32f2f",
            }}
          >
            Tổng tiền: {parseFloat(formData?.totalOrderPrice).toLocaleString()}{" "}
            ₫
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng thái đơn hàng</InputLabel>
              <Select
                name="orderStatus"
                value={formData.orderStatus}
                onChange={handleChange}
                label="Trạng thái đơn hàng"
                disabled={formData.orderStatus === "success"}
              >
                <MenuItem value="pending">Chờ xác nhận</MenuItem>
                <MenuItem value="preparing">Đang soạn hàng</MenuItem>
                <MenuItem value="delivering">Đang giao hàng</MenuItem>
                <MenuItem value="success">Giao thành công</MenuItem>
                <MenuItem value="cancelled">Đã hủy</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng thái thanh toán</InputLabel>
              <Select
                name="paymentStatus"
                label="Trạng thái thanh toán"
                value={formData.paymentStatus} // boolean true/false
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    paymentStatus: e.target.value === "true", // convert lại từ string to boolean
                  }))
                }
              >
                <MenuItem value={"true"}>Đã thanh toán</MenuItem>
                <MenuItem value={"false"}>Chưa thanh toán</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Phương thức thanh toán</InputLabel>
              <Select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                label="Phương thức thanh toán"
              >
                <MenuItem value="home">Thanh toán tiền mặt</MenuItem>
                <MenuItem value="vnpay">VnPay</MenuItem>
                <MenuItem value="momo">MOMO</MenuItem>
                {/* <MenuItem value="">VnPay</MenuItem> */}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Tổng tiền"
              name="totalAmount"
              type="number"
              value={formData.totalOrderPrice}
              onChange={handleChange}
              disabled
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Địa chỉ giao hàng"
              name="shippingAddress"
              value={formData?.userInfor?.Address || "không có"}
              onChange={handleChange}
              disabled
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Ghi chú đơn hàng"
              name="note"
              value={formData.note}
              onChange={handleChange}
              disabled
            />
          </Grid>

          {/* <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Store ID"
            name="storeId"
            type="number"
            value={form.storeName}
            onChange={handleChange}
            disabled
          />
        </Grid> */}

          <Grid item xs={12} display="flex" justifyContent="flex-end">
            {seenUser === false ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                {initialData ? "Cập nhật" : "Thêm mới"}
              </Button>
            ) : null}

            <Button variant="outlined" color="secondary" onClick={onClose}>
              Hủy
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default OrderModalMui;
