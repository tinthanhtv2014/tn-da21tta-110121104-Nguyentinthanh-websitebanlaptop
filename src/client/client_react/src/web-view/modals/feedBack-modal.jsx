import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Stack,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

const OrderReviewModal = ({ open, onClose, orderId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Bạn cần chọn số sao đánh giá!");
      return;
    }

    // Gọi hàm xử lý submit từ props
    onSubmit({ orderId, rating, comment });
    // Reset và đóng modal
    setRating(0);
    setComment("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Đánh giá đơn hàng: {orderId}
        </Typography>

        <Stack spacing={2}>
          <Rating
            name="order-rating"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />

          <TextField
            label="Nội dung đánh giá"
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
          />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={onClose} variant="outlined">
              Đóng
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Gửi đánh giá
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default OrderReviewModal;
