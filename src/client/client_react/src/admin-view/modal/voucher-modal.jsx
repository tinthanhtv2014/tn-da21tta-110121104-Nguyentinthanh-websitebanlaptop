import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
} from "@mui/material";
import voucherService from "../../services/voucher-service";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
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
  maxHeight: "90vh",
  overflowY: "auto",
};

const VoucherModalMui = ({
  open,
  onClose,
  onSubmit,
  initialData = null,
  seenUser,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "",
    discountAmount: 0,
    discountPercent: 0,
    maxDiscountValue: 0,
    minOrderValue: 0,
    startDate: "",
    expiryDate: "",
    isPublic: true,
    isFreeShipping: false,
    status: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        startDate: initialData.startDate?.slice(0, 10) || "", // chuyển về YYYY-MM-DD
        expiryDate: initialData.expiryDate?.slice(0, 10) || "",
      });
    } else {
      setFormData({
        name: "",
        code: "",
        type: "",
        discountAmount: 0,
        discountPercent: 0,
        maxDiscountValue: 0,
        minOrderValue: 0,
        startDate: "",
        expiryDate: "",
        isPublic: true,
        isFreeShipping: false,
        status: "",
      });
    }
  }, [initialData]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.code ||
      !formData.startDate ||
      !formData.expiryDate
    ) {
      toast.error("Thiếu giá trị");
      return;
    }
    if (new Date(formData.expiryDate) < new Date(formData.startDate)) {
      toast.error("Ngày hết hạn không được nhỏ hơn ngày bắt đầu!");
      return;
    }
    const payload = {
      name: formData.name,
      code: formData.code,
      type: formData.type || "DISCOUNT",
      startDate: formData.startDate,
      expiryDate: formData.expiryDate,
      minOrderValue: formData.minOrderValue || 0,
      discountAmount: formData.discountAmount || 0,
      discountPercent: formData.discountPercent || 0,
      maxDiscountValue: formData.maxDiscountValue || 0,
      status: formData.status || "PENDING",
      number1: formData.number1 || 0,
    };

    try {
      if (initialData?.id) {
        await voucherService.updateVouchers(initialData.id, payload);
      } else {
        await voucherService.createVouchers(payload);
      }

      toast.success(
        initialData ? "Cập nhật thành công!" : "Tạo voucher thành công!"
      );
      onSubmit();
      onClose();
    } catch (err) {
      console.error("Lỗi khi lưu voucher:", err);
      toast.error("Có lỗi xảy ra khi lưu voucher!");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...style, width: 600 }}>
        <Typography variant="h6" mb={2}>
          {initialData ? "✏️ Cập nhật Voucher" : "➕ Thêm Voucher"}
        </Typography>
        <Stack spacing={2}>
          {/* Hàng 1: Tên + Mã */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Tên voucher"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Mã voucher"
              name="code"
              value={formData.code}
              onChange={handleChange}
              fullWidth
              disabled
            />
          </Stack>

          {/* Hàng 2: Loại + Trạng thái */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Loại voucher"
              name="type"
              select
              value={formData.type}
              onChange={(e) => {
                const value = e.target.value;
                const randomCode = `${value.toUpperCase()}-${Math.random()
                  .toString(36)
                  .substring(2, 8)
                  .toUpperCase()}`;
                setFormData({ ...formData, type: value, code: randomCode });
              }}
              fullWidth
            >
              <MenuItem value="discount">Giảm giá</MenuItem>
              <MenuItem value="ship">Miễn phí ship</MenuItem>
              <MenuItem value="gift">Quà tặng</MenuItem>
            </TextField>

            <TextField
              label="Trạng thái"
              name="status"
              select
              value={formData.status}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="active">Đang hoạt động</MenuItem>
              <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
            </TextField>
          </Stack>

          {/* Hàng 3: Theo loại voucher */}
          {formData.type === "gift" || formData.type === "ship" ? (
            <TextField
              label="Giá trị giảm giá (VNĐ)"
              name="discountAmount"
              type="number"
              value={formData.discountAmount}
              onChange={handleChange}
              fullWidth
            />
          ) : formData.type === "discount" ? (
            <Stack direction="row" spacing={2}>
              <TextField
                label="Phần trăm giảm"
                name="discountPercent"
                type="number"
                value={formData.discountPercent}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Giá trị giảm tối đa"
                name="maxDiscountValue"
                type="number"
                value={formData.maxDiscountValue}
                onChange={handleChange}
                fullWidth
              />
            </Stack>
          ) : null}

          {/* Hàng 4: minOrder + number1 */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Giá trị đơn hàng tối thiểu"
              name="minOrderValue"
              type="number"
              value={formData.minOrderValue}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Điểm quy đổi"
              name="number1"
              type="number"
              value={formData.number1}
              onChange={handleChange}
              fullWidth
            />
          </Stack>

          {/* Hàng 5: startDate + expiryDate */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Ngày bắt đầu"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Ngày hết hạn"
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Stack>

          {/* Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" onClick={handleSubmit}>
              {initialData ? "Cập nhật" : "Thêm mới"}
            </Button>
            <Button variant="outlined" onClick={onClose}>
              Hủy
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default VoucherModalMui;
