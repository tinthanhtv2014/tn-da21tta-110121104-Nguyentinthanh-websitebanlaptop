import React, { useRef } from "react";
import { Modal, Box, Typography, Grid, Button, Divider } from "@mui/material";

const OrderDetailModal = ({ open, onClose, order }) => {
  const printRef = useRef();

  if (!order) return null;

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box ref={printRef}>
          {/* Thông tin cửa hàng */}
          <Box textAlign="center" mb={2}>
            <Typography variant="h6">CỬA HÀNG THỜI TRANG ABC</Typography>
            <Typography variant="body2">
              Địa chỉ: 123 Đường XYZ, TP.HCM
            </Typography>
            <Typography variant="body2">SĐT: 0909 123 456</Typography>
            <Divider sx={{ my: 2 }} />
          </Box>

          <Typography variant="h6" gutterBottom>
            Chi tiết đơn hàng: {order.id}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Ngày đặt: {order.date}
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Box sx={{ maxHeight: "25vh", overflowY: "auto", pr: 1 }}>
            {order.listProduct?.map((item, idx) => (
              <Grid
                container
                key={idx}
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
                    src={item.imageUrl || "https://via.placeholder.com/60"}
                    alt={item.name}
                    style={{ width: 60, height: 60, borderRadius: 4 }}
                  />
                </Grid>
              </Grid>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container justifyContent="space-between">
            <Typography variant="subtitle1">Tổng cộng:</Typography>
            <Typography variant="subtitle1" color="primary">
              {order.totalOrderPrice?.toLocaleString()}đ
            </Typography>
          </Grid>
        </Box>

        <Box textAlign="right" mt={3}>
          <Button variant="contained" onClick={onClose} color="primary">
            Đóng
          </Button>
          <Button
            variant="outlined"
            onClick={handlePrint}
            color="secondary"
            sx={{ ml: 2 }}
          >
            In hóa đơn
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default OrderDetailModal;
