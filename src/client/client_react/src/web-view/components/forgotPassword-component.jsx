import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Link,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import accountService from "../../services/user-service";
import { useNavigate } from "react-router-dom";
export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [input, setInput] = useState("");
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Countdown resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = async () => {
    try {
      setLoading(true);

      // Regex kiểm tra email
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

      let code;
      if (isEmail) {
        // Nếu là email
        code = await accountService.sendOtp(input);
      } else {
        // Nếu là phone (BE đã lo format)
        code = await accountService.sendSms(input);
      }

      if (code === 404) {
        toast.error("Người dùng này chưa tồn tại trong hệ thống");
        return;
      }

      setServerOtp(code);
      setStep(2);
      setCountdown(60);

      // Hiển thị OTP demo (chỉ để dev/test)
      toast.info(`OTP demo: ${code}`, { autoClose: 5000 });
    } catch (error) {
      console.error(error);
      toast.error("Không gửi được OTP, thử lại!");
      return;
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyOtp = () => {
    if (otp === serverOtp) {
      toast.success("Xác minh OTP thành công!");
      setStep(3);
    } else {
      toast.error("OTP không đúng, thử lại!");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu nhập lại không khớp!");
      return;
    }
    const response = await accountService.updatePasswordUserWithEmail(
      input,
      newPassword
    );
    if (response) {
      toast.success("Đổi mật khẩu thành công!");
      navigate("/");
    }

    // Gọi API đổi mật khẩu ở đây
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="#f5f5f5"
      >
        <Card sx={{ width: 400, p: 3, boxShadow: 4, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              {step === 1 && "Quên mật khẩu"}
              {step === 2 && "Xác minh OTP"}
              {step === 3 && "Đặt lại mật khẩu"}
            </Typography>

            {/* Bước 1: Nhập email/phone */}
            {step === 1 && (
              <>
                <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                  Nhập email hoặc số điện thoại để nhận mã xác minh.
                </Typography>
                <TextField
                  label="Email hoặc SĐT"
                  fullWidth
                  size="small"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSendOtp}
                  disabled={loading || !input}
                >
                  {loading ? <CircularProgress size={24} /> : "Gửi mã OTP"}
                </Button>
              </>
            )}

            {/* Bước 2: Nhập OTP */}
            {step === 2 && (
              <>
                <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                  Nhập mã OTP đã được gửi đến <b>{input}</b>
                </Typography>
                <TextField
                  label="Mã OTP"
                  fullWidth
                  size="small"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleVerifyOtp}
                  disabled={!otp}
                >
                  Xác minh
                </Button>

                <Box mt={2} textAlign="center">
                  {countdown > 0 ? (
                    <Typography variant="caption" color="textSecondary">
                      Gửi lại mã sau {countdown}s
                    </Typography>
                  ) : (
                    <Link component="button" onClick={handleSendOtp}>
                      Gửi lại mã OTP
                    </Link>
                  )}
                </Box>
              </>
            )}

            {/* Bước 3: Đặt lại mật khẩu */}
            {step === 3 && (
              <>
                <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                  Vui lòng nhập mật khẩu mới để hoàn tất.
                </Typography>
                <TextField
                  label="Mật khẩu mới"
                  type="password"
                  fullWidth
                  size="small"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Xác nhận mật khẩu"
                  type="password"
                  fullWidth
                  size="small"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleChangePassword}
                  disabled={!newPassword || !confirmPassword}
                >
                  Đặt lại mật khẩu
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Toast hiển thị thông báo */}
    </>
  );
}
