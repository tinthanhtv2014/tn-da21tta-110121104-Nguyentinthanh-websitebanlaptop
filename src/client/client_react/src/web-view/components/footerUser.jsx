import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  IconButton,
  Link,
} from "@mui/material";
import logo from "../../public/logobct.png";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import GoogleIcon from "@mui/icons-material/Google";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports"; // dùng icon này tạm cho Twitch (MUI chưa có TwitchIcon chính thức)
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

const FooterUser = () => {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor:
          theme.palette.mode === "dark"
            ? "#000"
            : theme.palette.background.paper,
        color:
          theme.palette.mode === "dark" ? "#fff" : theme.palette.text.primary,
        py: 4,
        borderTop: `1px solid ${theme.palette.divider}`,
        maxWidth: "1500px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      <Grid container spacing={4} justifyContent="center">
        {/* Cột 1: Về chúng tôi */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            Về chúng tôi
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Chúng tôi là cửa hàng chuyên cung cấp các sản phẩm chất lượng với
            dịch vụ uy tín, tận tâm.
          </Typography>

          {/* Icon Bộ Công Thương */}
          <Box sx={{ mb: 2 }}>
            <img
              src={logo}
              alt="Bộ Công Thương"
              width="120"
              style={{
                backgroundColor: "#f4f4f4",
                padding: "4px",
                borderRadius: 4,
              }}
            />
          </Box>

          {/* Mạng xã hội */}
          <Box>
            {[
              {
                icon: <FacebookIcon />,
                color: "#3b5998",
                link: "https://facebook.com",
              },
              {
                icon: <InstagramIcon />,
                color: "#e4405f",
                link: "https://instagram.com",
              },
              {
                icon: <YouTubeIcon />,
                color: "#ff0000",
                link: "https://youtube.com",
              },
              {
                icon: <GoogleIcon />,
                color: "#db4437",
                link: "https://google.com",
              },
              {
                icon: <SportsEsportsIcon />,
                color: "#6441a5",
                link: "https://twitch.tv",
              }, // Twitch
            ].map((item, index) => (
              <IconButton
                key={index}
                href={item.link}
                target="_blank"
                sx={{
                  color: item.color,
                  opacity: 0.7,
                  transition: "all 0.3s",
                  "&:hover": {
                    opacity: 1,
                    transform: "scale(1.1)",
                  },
                }}
              >
                {item.icon}
              </IconButton>
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            Chính sách bảo mật
          </Typography>
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            <li style={{ marginBottom: "8px" }}>
              <Link href="/privacy-policy" underline="hover" color="inherit">
                Bảo mật thông tin
              </Link>
            </li>
            <li style={{ marginBottom: "8px" }}>
              <Link href="/data-security" underline="hover" color="inherit">
                Bảo mật dữ liệu
              </Link>
            </li>
            <li style={{ marginBottom: "8px" }}>
              <Link href="/data-security" underline="hover" color="inherit">
                Bảo mật người dùng
              </Link>
            </li>
          </ul>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            Thông tin liên hệ
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <LocationOnIcon sx={{ mr: 1, color: "#333" }} />
            <Typography variant="body2">
              123 Đường Mậu Thân, phường 9, TP.Trà Vinh
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <PhoneIcon sx={{ mr: 1, color: "#333" }} />
            <Typography variant="body2">(+84) 912 345 678</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <EmailIcon sx={{ mr: 1, color: "#333" }} />
            <Typography variant="body2">tinthanhtv2014@gmail.com</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            Điều khoản & Chính sách
          </Typography>
          <ul style={{ listStyleType: "none", padding: 2, margin: 0 }}>
            <li style={{ marginBottom: "8px" }}>
              <Link href="/terms" underline="hover" color="inherit">
                Điều khoản sử dụng
              </Link>
            </li>
            <li style={{ marginBottom: "8px" }}>
              <Link href="/policies" underline="hover" color="inherit">
                Chính sách hoàn trả
              </Link>
            </li>
            <li style={{ marginBottom: "8px" }}>
              <Link href="/policies" underline="hover" color="inherit">
                Chính sách vận chuyển
              </Link>
            </li>
            <li>
              <Link href="/policies" underline="hover" color="inherit">
                Chính sách bảo mật thông tin
              </Link>
            </li>
          </ul>
        </Grid>
      </Grid>

      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mt: 4 }}
      >
        © {new Date().getFullYear()} YourCompany. All rights reserved.
      </Typography>
    </Box>
  );
};

export default FooterUser;
