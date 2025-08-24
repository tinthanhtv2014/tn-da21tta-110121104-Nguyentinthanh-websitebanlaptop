import React, { useState } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  IconButton,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import CloseIcon from "@mui/icons-material/Close";
import { GoogleLogin } from "@react-oauth/google";
import accountService from "../../services/user-service";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const ModalAuth = ({ open, handleClose, setUser }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [agree, setAgree] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async () => {
    if (!agree && isRegistering) {
      setErrorMessage("Vui lòng chấp nhận điều khoản và điều kiện.");
      return;
    }

    if (isRegistering) {
      // Đăng ký tài khoản mới
      try {
        const userData = { emailAddress, password, firstName, lastName };
        const result = await accountService.register(userData);
        if (result.token) {
          // Lưu token vào localStorage
          localStorage.setItem("accessToken", result.token);
          const decoded = jwtDecode(result.token);
          const response = await accountService.getUserById(decoded.id);
          setUser(response); // Cập nhật user trong HeaderUser
          handleClose(); // Đóng modal sau khi đăng ký thành công
          navigate("/");
        } else {
          setErrorMessage("Đăng ký không thành công, vui lòng thử lại.");
        }
      } catch (error) {
        setErrorMessage("Đã xảy ra lỗi trong quá trình đăng ký.");
        console.error("Register error:", error);
      }
    } else {
      // Đăng nhập
      const response = await accountService.login({ emailAddress, password });
      if (response.token) {
        // Lưu token vào localStorage
        localStorage.setItem("accessToken", response.token);
        const decoded = jwtDecode(response.token);
        const responseuser = await accountService.getUserById(decoded.id);
        setUser(responseuser); // Cập nhật user trong HeaderUser
        handleClose(); // Đóng modal sau khi đăng ký thành công
        navigate("/");
        toast.success("Đăng nhập thành công");
      } else {
        setErrorMessage("Đăng ký không thành công, vui lòng thử lại.");
      }
      console.log("Login with:", emailAddress, password);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const ggToken = credentialResponse.credential;
      const provider = "googleLogin";
      localStorage.setItem("googleToken", ggToken);

      const result = await accountService.login({ ggToken, provider });

      if (result.token) {
        localStorage.setItem("accessToken", result.token);
        const decoded = jwtDecode(result.token);
        setUser(decoded); // Cập nhật user
        handleClose(); // Đóng modal sau khi đăng nhập thành công
        navigate("/");
        toast.success("Đăng nhập thành công");
      } else {
        setErrorMessage("Token không hợp lệ, vui lòng thử lại.");
      }
    } catch (error) {
      setErrorMessage("Đăng nhập bằng Google không thành công!");
      console.error("Google login error:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          width: 450,
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          mx: "auto",
          mt: 10,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          position: "relative",
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" gutterBottom align="center">
          {isRegistering ? "Đăng ký tài khoản" : "Đăng nhập tài khoản"}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <IconButton size="large">
            <FacebookIcon color="primary" fontSize="large" />
          </IconButton>
          <IconButton size="large">
            <TwitterIcon color="primary" fontSize="large" />
          </IconButton>
          <IconButton size="large">
            <InstagramIcon sx={{ color: "#E1306C" }} fontSize="large" />
          </IconButton>
          <IconButton size="large">
            <LinkedInIcon sx={{ color: "#0077b5" }} fontSize="large" />
          </IconButton>
          <IconButton size="large">
            <YouTubeIcon sx={{ color: "#FF0000" }} fontSize="large" />
          </IconButton>
          <IconButton size="large">
            <GitHubIcon fontSize="large" />
          </IconButton>
        </Stack>
        {isRegistering && (
          <Stack direction="row" spacing={2}>
            <TextField
              label="Họ"
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              label="Tên"
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Stack>
        )}

        <TextField
          label="Email"
          type="email"
          fullWidth
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Mật khẩu"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 0.5 }}
        />
        {!isRegistering && (
          <Box display="flex" justifyContent="flex-end">
            <Button
              size="small"
              onClick={() => {
                navigate("/forgot-password");
                handleClose();
              }}
              sx={{
                textTransform: "none",
                fontSize: "0.9rem",
                color: "primary.main",
                fontWeight: 500,
                p: 0, // ⬅️ bỏ padding để nó dính hơn
                minWidth: "unset",
              }}
            >
              Quên mật khẩu?
            </Button>
          </Box>
        )}
        {isRegistering && (
          <FormControlLabel
            control={
              <Checkbox
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
            }
            label="Tôi đồng ý với Điều khoản và Chính sách bảo mật."
          />
        )}

        {errorMessage && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {errorMessage}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{ py: 1.5, fontSize: "1rem", fontWeight: 600 }}
        >
          {isRegistering ? "Đăng ký" : "Đăng nhập"}
        </Button>

        <Divider>hoặc</Divider>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setErrorMessage("Đăng nhập Google thất bại.")}
        >
          <Button
            fullWidth
            startIcon={<GoogleIcon />}
            sx={{
              textTransform: "none",
              backgroundColor: "#d84315",
              color: "#fff",
              fontWeight: 600,
              py: 1.5,
              fontSize: "1rem",
              "&:hover": { backgroundColor: "#ffcc80", color: "#000" },
            }}
          >
            Đăng nhập với Google
          </Button>
        </GoogleLogin>

        <Typography
          variant="body1"
          align="center"
          sx={{ mt: 1, fontSize: "16px", fontWeight: 500 }}
        >
          {isRegistering ? "Bạn đã có tài khoản?" : "Bạn chưa có tài khoản?"}{" "}
          <Button
            onClick={() => setIsRegistering(!isRegistering)}
            sx={{
              color: "primary.main",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            {isRegistering ? "Đăng nhập" : "Đăng ký"}
          </Button>
        </Typography>
      </Box>
    </Modal>
  );
};

export default ModalAuth;
