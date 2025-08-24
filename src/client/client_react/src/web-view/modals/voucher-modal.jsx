import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import voucherService from "../../services/voucher-service"; // chỉnh path nếu cần
import { jwtDecode } from "jwt-decode";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 3,
  maxHeight: "80vh",
  overflowY: "auto",
};

const VoucherSelectModal = ({ open, onClose, onSelect }) => {
  const [voucherList, setVoucherList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVouchers, setSelectedVouchers] = useState([]);
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

  useEffect(() => {
    if (open) {
      fetchVoucherList();
    }
  }, [open]);

  const fetchVoucherList = async () => {
    try {
      setLoading(true);
      // 👉 Mock dữ liệu mẫu
      const res = {
        listData: [
          {
            id: "vch001",
            code: "SALE50K",
            discountAmount: 50000,
            expiryDate: "2025-12-31",
            type: "order",
          },
          {
            id: "vch002",
            code: "FREESHIP",
            discountAmount: 30000,
            expiryDate: "2025-08-30",
            type: "shipping",
          },
          {
            id: "vch003",
            code: "NEWUSER10",
            discountAmount: 10000,
            expiryDate: "2025-09-15",
            type: "order",
          },
        ],
      };
      const response = await voucherService.getVouchersUser({
        optionExtend: [{ key: "userId", value: user.id }],
      });
      setVoucherList(response.listData);
    } catch (err) {
      toast.error("Không thể tải voucher");
    } finally {
      setLoading(false);
    }
  };
  const toggleVoucher = (voucher) => {
    const updatedVouchers = selectedVouchers.filter(
      (v) => v.type !== voucher.type // Loại bỏ voucher cùng loại trước đó
    );

    const isAlreadySelected = selectedVouchers.find((v) => v.id === voucher.id);
    if (!isAlreadySelected) {
      updatedVouchers.push(voucher);
    }

    setSelectedVouchers(updatedVouchers);
  };

  const handleSelect = (voucher) => {
    onSelect(voucher);
    onClose();
    toast.success(`Đã chọn mã: ${voucher.code}`);
  };
  const groupedVouchers = voucherList.reduce((acc, v) => {
    acc[v.type] = acc[v.type] || [];
    acc[v.type].push(v);
    return acc;
  }, {});

  const renderGroupTitle = (type) => {
    switch (type) {
      case "discount":
        return "Giảm đơn hàng";
      case "ship":
        return "Giảm phí vận chuyển";
      case "gift":
        return "Giảm giá sản phẩm";
      default:
        return "Khác";
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Chọn mã giảm giá</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={3}>
            <CircularProgress />
          </Box>
        ) : voucherList.length > 0 ? (
          Object.entries(groupedVouchers).map(([type, list]) => (
            <Box key={type} mb={3}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="primary"
                gutterBottom
              >
                {renderGroupTitle(type)}
              </Typography>

              {list.map((voucher) => {
                const isSelected = selectedVouchers.find(
                  (v) => v.id === voucher.id
                );
                return (
                  <Paper
                    key={voucher.id}
                    sx={{
                      p: 2,
                      mb: 1,
                      cursor: "pointer",
                      border: isSelected
                        ? "2px solid #1976d2"
                        : "1px solid #ccc",
                      backgroundColor: isSelected ? "#e3f2fd" : "white",
                      transition: "0.2s",
                    }}
                    onClick={() => toggleVoucher(voucher)}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      {voucher.code}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Giảm {voucher.discountAmount.toLocaleString("vi-VN")}đ —
                      HSD: {voucher.expiryDate}
                    </Typography>
                  </Paper>
                );
              })}
            </Box>
          ))
        ) : (
          <Typography color="text.secondary">
            Không có mã giảm giá khả dụng
          </Typography>
        )}

        <Box mt={3}>
          {selectedVouchers.length > 0 && (
            <Typography variant="body2" mb={1}>
              Đã chọn {selectedVouchers.length} mã
            </Typography>
          )}

          <button
            style={{
              padding: "10px 16px",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              width: "100%",
            }}
            onClick={() => {
              onSelect(selectedVouchers); // Truy về cha kể cả rỗng
              onClose();
              toast.success(
                selectedVouchers.length > 0
                  ? `Đã áp dụng ${selectedVouchers.length} mã`
                  : "Không áp dụng mã giảm giá nào"
              );
            }}
          >
            Áp dụng
          </button>
        </Box>
      </Box>
    </Modal>
  );
};

export default VoucherSelectModal;
