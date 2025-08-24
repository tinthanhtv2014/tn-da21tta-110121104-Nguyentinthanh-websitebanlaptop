import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Grid,
  Divider,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  Stack,
} from "@mui/material";
import {
  CheckCircle,
  HourglassEmpty,
  LocalShipping,
  Cancel,
  DoneAll,
  Inventory,
  Favorite,
  Star,
} from "@mui/icons-material";
import { Dashboard, AccountCircle, ExitToApp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import cartService from "../../services/cart-service";
import productService from "../../services/product-service";
import wishlistService from "../../services/wishlist-service";
const API_URL = process.env.REACT_APP_API_BASE_URL_PRODUCTS;
const WistListProduct = () => {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); // decoded chứa fullName, emailAddress, v.v...
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const fetchWishlist = async () => {
    if (user && user.id) {
      const response = await wishlistService.getWishlistByUser(user.id);

      if (response) {
        if (response) {
          console.log("response", response);

          //   const productData = await productService.getProducts({
          //     sortList: [{ key: "id", value: productId }],
          //   });

          const ProductWithImageUrl = response.map((product) => {
            let imageArray = [];
            const folderName = product.product.createdAt
              ? new Date(product.product.createdAt)
                  .toISOString()
                  .split(".")[0]
                  .replace(/[-:]/g, "")
              : "unknown-date";

            try {
              imageArray = product.product.image
                ? JSON.parse(product.product.image)
                : [];
            } catch (err) {
              console.error("Lỗi parse ảnh:", err);
            }

            // Parse thông tin laptop hoặc accessory
            // let extraData = {};
            // if (product.laptop) {
            //   const { id, ...restLaptop } = product.laptop;
            //   extraData = {
            //     laptopId: id,
            //     ...restLaptop,
            //   };
            // } else if (product.accessory) {
            //   const { id, ...restAccessory } = product.accessory;
            //   extraData = {
            //     accessoryId: id,
            //     ...restAccessory,
            //   };
            // }

            return {
              ...product,
              //   ...extraData,
              imageUrl:
                imageArray.length > 0
                  ? `${API_URL}/uploads/product/${folderName}/${imageArray[0]}`
                  : null,
              image: imageArray.length > 0 ? imageArray : null,
              linkCreate: folderName,
              typeName:
                product?.type === "accessory" ? "Phụ kiện điện tử" : "Laptop",
              priceFormat: product?.price
                ? product.price.toLocaleString("vi-VN")
                : 0,
            };
          });

          console.log("ProductWithImageUrl", ProductWithImageUrl);
          setWishlist(ProductWithImageUrl);
        }
      }
    }
  };

  const handleRemoveFromWishlist = async (id) => {
    console.log("dahdjlasdasd", id);

    if (!id) {
      return;
    }
    const response = await wishlistService.removeWishlistItem(id);
    if (response) {
      toast.success("xóa sản phẩm khỏi yêu thích thành công");
      fetchWishlist();
      return;
    }
  };

  const handleAddProductCart = async (id, userId) => {
    // Đã đăng nhập → gọi API
    let params = {
      userId: userId,
      productId: id,
    };
    const response = await cartService.createCart(params);
    if (response) {
      toast.success("Thêm vào giỏ hàng thành công");
      return;
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const handleNavigate = (route) => navigate(route);

  return (
    <Box sx={{ pt: 6, maxWidth: "1500px", width: "100%", mx: "auto", pb: 6 }}>
      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Menu cá nhân
            </Typography>
            <List>
              <ListItem button onClick={() => handleNavigate("/profile")}>
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText primary="Thông tin cá nhân" />
              </ListItem>
              <ListItem button onClick={() => handleNavigate("/userOrder")}>
                <ListItemIcon>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText primary="Đơn hàng cá nhân" />
              </ListItem>
              <ListItem button onClick={() => handleNavigate("/wishlist")}>
                <ListItemIcon>
                  <Favorite />
                </ListItemIcon>
                <ListItemText primary="Sản phẩm yêu thích" />
              </ListItem>
              <ListItem button onClick={() => handleNavigate("/pointHistory")}>
                <ListItemIcon>
                  <Star />
                </ListItemIcon>
                <ListItemText primary="Điểm tích lũy" />
              </ListItem>
              <ListItem button onClick={() => handleNavigate("/logout")}>
                <ListItemIcon>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText primary="Đăng xuất" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Orders */}
        {/* Wishlist Product List */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            Sản phẩm yêu thích
          </Typography>

          <Box sx={{ maxHeight: "80vh", overflowY: "auto", pr: 1 }}>
            {wishlist && wishlist.length > 0 ? (
              wishlist.map((product) => (
                <Paper
                  key={product.id}
                  elevation={3}
                  sx={{ p: 3, mb: 3, borderRadius: 3 }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ width: 80, height: 80, borderRadius: 8 }}
                      />
                    </Grid>
                    <Grid item xs>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {product?.product?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product?.product?.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product?.product?.price?.toLocaleString()}đ
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            handleAddProductCart(
                              product.productId,
                              product.userId
                            )
                          }
                        >
                          Thêm vào giỏ hàng
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleRemoveFromWishlist(product.id)}
                        >
                          Xoá
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>
              ))
            ) : (
              <Typography color="text.secondary">
                Bạn chưa có sản phẩm yêu thích nào.
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WistListProduct;
