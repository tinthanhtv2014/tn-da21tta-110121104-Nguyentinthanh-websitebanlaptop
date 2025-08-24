import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  Slide,
  IconButton,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom"; // 👈 thêm dòng này
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Favorite, FavoriteBorder, ShoppingCart } from "@mui/icons-material"; // Import các icon
const promotionProducts = [
  // 👇 Thêm nhiều sản phẩm để test pagination
  {
    id: 1,
    name: "Laptop Gaming Siêu Cấp",
    price: 1500,
    discount: 20,
    imageUrl:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    name: "Chuột Gaming RGB",
    price: 80,
    discount: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    name: "Tai Nghe Chống Ồn",
    price: 120,
    discount: 25,
    imageUrl:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    name: "Bàn Phím Cơ LED",
    price: 100,
    discount: 30,
    imageUrl:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    name: "Màn Hình 4K",
    price: 300,
    discount: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    name: "Ổ Cứng SSD 1TB",
    price: 180,
    discount: 18,
    imageUrl:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 7,
    name: "Loa Bluetooth",
    price: 60,
    discount: 20,
    imageUrl:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 8,
    name: "Laptop Văn Phòng",
    price: 1000,
    discount: 22,
    imageUrl:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 9,
    name: "Balo Laptop",
    price: 40,
    discount: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 10,
    name: "Webcam Full HD",
    price: 70,
    discount: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 11,
    name: "Microphone",
    price: 90,
    discount: 20,
    imageUrl:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 12,
    name: "Bàn Di Chuột XXL",
    price: 25,
    discount: 30,
    imageUrl:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
  },
];

const ITEMS_PER_PAGE = 5;
const ListProductPromotion = () => {
  const [page, setPage] = useState(0);
  const [slideIn, setSlideIn] = useState(true);
  const navigate = useNavigate(); // 👈 hook dùng để điều hướng
  const [currentProducts, setCurrentProducts] = useState(
    promotionProducts.slice(0, ITEMS_PER_PAGE)
  );

  const totalPages = Math.ceil(promotionProducts.length / ITEMS_PER_PAGE);

  const handleChangePage = (next = true) => {
    setSlideIn(false);
    setTimeout(() => {
      setPage((prev) => {
        const newPage = next
          ? (prev + 1) % totalPages
          : (prev - 1 + totalPages) % totalPages;
        setCurrentProducts(
          promotionProducts.slice(
            newPage * ITEMS_PER_PAGE,
            (newPage + 1) * ITEMS_PER_PAGE
          )
        );
        return newPage;
      });
      setSlideIn(true);
    }, 300);
  };

  // ...

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Box
      sx={{
        my: 4,
        p: 3,
        borderRadius: 3,
        backgroundColor: "#f9f9f9",
        boxShadow: "0 0 15px rgba(0,0,0,0.1)",
        position: "relative",
        border: "1px solid #eee",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            fontSize: "1.75rem",
            color: "#e91e63",
            textTransform: "uppercase",
            letterSpacing: 1.5,
            textShadow: "0px 2px 6px rgba(233, 30, 99, 0.2)",
            "&:hover": {
              color: "#f50057",
              textShadow: "0px 2px 10px rgba(233, 30, 99, 0.5)",
            },
          }}
        >
          🔥 Khuyến Mãi Sốc 🔥
        </Typography>

        <Box>
          <IconButton
            color="error"
            onClick={() => handleChangePage(false)}
            sx={{ mr: 1 }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleChangePage(true)}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Box>
      <motion.div
        key={page}
        initial={{ opacity: 0, x: slideIn ? 100 : -100, scale: 0.98 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: slideIn ? -100 : 100, scale: 0.98 }}
        transition={{
          duration: 0.5,
          ease: [0.25, 0.1, 0.25, 1], // cubic-bezier easing
        }}
      >
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={5}
          navigation
          autoplay={{
            delay: 3000, // 👈 chuyển slide sau 3000ms
            disableOnInteraction: false, // vẫn tiếp tục autoplay sau khi user tương tác
          }}
          style={{ padding: "10px" }}
        >
          {currentProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 6px 20px rgba(255,0,0,0.2)",
                  overflow: "hidden",
                  "&:hover": {
                    transform: "scale(1.05)",
                    transition: "all 0.3s",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.imageUrl}
                    alt={product.name}
                    sx={{
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                      "&:hover": { transform: "scale(1.1)" },
                      cursor: "pointer",
                    }}
                    onClick={() => handleProductClick(product.id)}
                  />
                  <Chip
                    label={`-${product.discount}%`}
                    color="error"
                    icon={<LocalFireDepartmentIcon />}
                    sx={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      fontWeight: "bold",
                      fontSize: "1rem",
                      zIndex: 1,
                    }}
                  />
                </Box>
                <CardContent
                  sx={{ textAlign: "center", backgroundColor: "#fff", py: 2 }}
                >
                  <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      textDecoration: "line-through",
                      color: "gray",
                      fontSize: "0.9rem",
                    }}
                  >
                    Giá gốc: ${product.price}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#f50057",
                      fontWeight: "bold",
                      fontSize: "1.25rem",
                      mb: 1,
                    }}
                  >
                    Chỉ còn: $
                    {Math.round(product.price * (1 - product.discount / 100))}{" "}
                    💸
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.85rem", color: "green", mb: 0.5 }}
                  >
                    ✅ Tiết kiệm được: $
                    {Math.round((product.price * product.discount) / 100)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.85rem",
                      color: "#ffa726",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    ⭐ 4.5/5 | Đã bán: 350+
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.85rem", color: "#4caf50", mb: 2 }}
                  >
                    Tình trạng: Còn hàng
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    startIcon={<ShoppingCart />}
                    sx={{
                      padding: "12px",
                      fontWeight: 600,
                      fontSize: "1rem",
                      backgroundColor: "#e91e63",
                      "&:hover": { backgroundColor: "#d32f2f" },
                    }}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </Box>
  );
};

export default ListProductPromotion;
