import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import orderService from "../../services/order-service";
import accountService from "../../services/user-service";
const PaymentThankYouPage = () => {
  const location = useLocation();
  const [paymentResult, setPaymentResult] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const resultCode = queryParams.get("resultCode");

    const storedOrderInfo = localStorage.getItem("orderInfo");
    console.log("sadagsdkjlasdasd", storedOrderInfo);
    if (storedOrderInfo) {
      try {
        const parsedOrderInfo = JSON.parse(storedOrderInfo);

        setOrderInfo(parsedOrderInfo);

        const response = processHomePayment(parsedOrderInfo);
        if (response) {
          setSavingOrder(false);
          //   localStorage.removeItem("orderInfo");
        }
      } catch (error) {
        console.error("Lỗi khi parse orderInfo từ localStorage:", error);
      }
    }

    if (resultCode === "0") {
      setPaymentResult("success");
    } else {
      setPaymentResult("fail");
    }
  }, []);
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

  if (!paymentResult) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
      px={2}
    >
      <Paper elevation={4} sx={{ p: 4, maxWidth: 480, textAlign: "center" }}>
        <>
          <CheckCircleIcon sx={{ fontSize: 64, color: "green" }} />
          <Typography variant="h5" fontWeight="bold" mt={2} color="green">
            Cảm ơn bạn đã mua hàng!
          </Typography>
          {orderInfo && (
            <Typography variant="body1" mt={1}>
              Đơn hàng <strong>{orderInfo.orderId}</strong> của bạn đã được
              thanh toán thành công với số tiền{" "}
              <strong>{orderInfo.totalAmount.toLocaleString()} VND</strong>.
            </Typography>
          )}
          {savingOrder && (
            <Typography mt={2} color="text.secondary">
              Đang lưu đơn hàng...
            </Typography>
          )}

          <Typography variant="body1" mt={1}>
            Chúng tôi sẽ xử lý sớm nhất có thể.
          </Typography>
        </>

        <Button variant="contained" color="primary" sx={{ mt: 3 }} href="/">
          Quay về trang chủ
        </Button>
      </Paper>
    </Box>
  );
};

export default PaymentThankYouPage;
