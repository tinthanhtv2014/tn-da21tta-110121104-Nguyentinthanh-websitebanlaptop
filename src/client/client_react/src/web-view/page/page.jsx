import React from "react";
import Slider from "react-slick";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category"; // Import icon danh mục
import ListProductPromotion from "../../share-component/listProductPromotion-component";
import { ListItemIcon } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ProductCategoryComponent from "../../share-component/ProductCategory-component";
import CategoryListComponent from "../components/category-component";
import { useNavigate } from "react-router-dom";
import categoryService from "../../services/category-service";
import banner1 from "../../image/lp_gaming.png";
import banner2 from "../../image/chu_t.png";
import slider1 from "../../image/gearvn-laptop-gigabyte-rtx-50-series-slider-t7.jpg";
import slider2 from "../../image/man_hinh_thang_04_banner_web_slider_800x400.jpg";
import slider3 from "../../image/thang_06_laptop_gaming_800x400_-_web_slider.jpg";
const banners = [
  {
    id: 1,
    title: "Deal Sốc Mỗi Ngày!",
    imageUrl: banner1,
  },
  {
    id: 2,
    title: "Laptop Cấu Hình Cao!",
    imageUrl: banner2,
  },
];
const products = [
  {
    id: 1,
    name: "Product 1",
    price: 100,
    discount: 20, // giảm giá 20%
    imageUrl:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    name: "Product 2",
    price: 200,
    discount: 15, // giảm giá 15%
    imageUrl:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    name: "Product 3",
    price: 150,
    discount: 0, // không giảm giá
    imageUrl:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    name: "Product 4",
    price: 250,
    discount: 30, // giảm giá 30%
    imageUrl:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    name: "Product 5",
    price: 300,
    discount: 10, // giảm giá 10%
    imageUrl:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
  },
];

// Dữ liệu giả cho slide
const slides = [
  {
    id: 1,
    title: "Siêu Sale Mùa Hè",
    description: "Giảm giá đến 50% cho các sản phẩm công nghệ!",
    imageUrl: slider1,
  },
  {
    id: 2,
    title: "Laptop Thế Hệ Mới",
    description: "Hiệu năng vượt trội, thiết kế đẳng cấp.",
    imageUrl: slider2,
  },
  {
    id: 3,
    title: "Phụ Kiện Chất Lừ",
    description: "Tai nghe, chuột, bàn phím – deal ngon mỗi ngày!",
    imageUrl: slider3,
  },
];

const MainPage = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetchCategory();
  }, []);
  const fetchCategory = async () => {
    const response = await categoryService.getCategory();
    if (response) {
      setCategories(response);
    }
  };
  return (
    <Box sx={{ pt: 1, maxWidth: "1500px", width: "100%", margin: "0 auto" }}>
      {/* Grid tổng (Danh mục - Slider - Banner) */}
      {/* Grid tổng (Danh mục - Slider - Banner) */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {/* Danh mục - 1/5 */}
        <Grid item xs={12} md={2.4}>
          <CategoryListComponent />
        </Grid>

        {/* Slider - 2.5/5 */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              width: "100%",
              maxWidth: "100%",
              overflow: "hidden", // Ngăn ảnh tràn
              borderRadius: 2,
            }}
          >
            <Slider {...settings}>
              {slides.map((slide) => (
                <Box
                  key={slide.id}
                  sx={{
                    position: "relative",
                    height: { xs: 300, sm: 400, md: 450 },
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    component="img"
                    src={slide.imageUrl}
                    alt={slide.title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain", // hoặc "contain" nếu bạn muốn hiển thị toàn bộ ảnh
                      display: "block",
                    }}
                  />
                </Box>
              ))}
            </Slider>
          </Box>
        </Grid>

        {/* Banner - 1.5/5 */}
        <Grid item xs={12} md={3.6} container direction="column" spacing={2}>
          {banners.map((banner, index) => (
            <Grid item key={banner.id}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 2,
                  overflow: "hidden",
                  height: { xs: 145, sm: 200, md: 222 }, // tổng xấp xỉ 450
                }}
              >
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    bgcolor: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    p: 1,
                  }}
                ></Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Grid>
      {/* Banner hàng ngang bên dưới */}
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 2,
                  overflow: "hidden",
                  height: 150,
                }}
              >
                <img
                  src={`https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80`}
                  alt={`Banner ${i}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    bgcolor: "rgba(0,0,0,0.5)",
                    color: "#fff",
                    textAlign: "center",
                    p: 1,
                  }}
                >
                  <Typography variant="subtitle1">Banner {i}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* <ListProductPromotion /> */}

      {/* Product List */}
      {categories &&
        categories.map((category) => (
          <ProductCategoryComponent
            key={category.id}
            categoryId={category.id}
            categoryName={category.name} // 👈 thêm dòng này
          />
        ))}
    </Box>
  );
};

export default MainPage;
