import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  IconButton,
  Stack,
} from "@mui/material";
import { Favorite, FavoriteBorder, ShoppingCart } from "@mui/icons-material"; // Import các icon
import productService from "../services/product-service";
import cartService from "../services/cart-service";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import wishlistService from "../services/wishlist-service";
import { useNavigate } from "react-router-dom"; // 👈 thêm dòng này
const API_URL = process.env.REACT_APP_API_BASE_URL_PRODUCTS;
const ProductCategoryComponent = ({ categoryId, categoryName }) => {
  const [likedProducts, setLikedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [UserId, setUserId] = useState(null);
  const navigate = useNavigate(); // 👈 hook dùng để điều hướng
  const token = localStorage.getItem("accessToken");
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      console.log(decoded); // xem payload bên trong
      setUserId(decoded.id);
    } else {
      console.log("No access token found");
    }
  }, [token]);

  useEffect(() => {
    fetchProduct();
  }, [categoryId]);

  const handleWishlistToggle = async (productId) => {
    try {
      if (UserId) {
        const params = {
          userId: UserId,
          productId,
        };

        const response = await wishlistService.addToWishlist(params);
        // Cập nhật UI sau khi gọi API thành công
        setLikedProducts((prevLikedProducts) =>
          prevLikedProducts.includes(productId)
            ? prevLikedProducts.filter((id) => id !== productId)
            : [...prevLikedProducts, productId]
        );
      }
    } catch (error) {
      console.error(
        "Failed to toggle wishlist:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await wishlistService.getWishlistByUser(UserId);
        console.log("sdlahdl;ádas", res);
        const productIds = res.map((item) => item.productId);
        setLikedProducts(productIds);
      } catch (err) {
        console.error("Error fetching wishlist", err);
      }
    };

    if (UserId) fetchWishlist();
  }, [UserId]);

  const fetchProduct = async () => {
    const response = await productService.getProductsBycategoryId(categoryId);
    if (response) {
      const ProductWithImageUrl = response.listData.map((product) => {
        let imageArray = [];
        const folderName = product.createdAt
          ? new Date(product.createdAt)
              .toISOString()
              .split(".")[0]
              .replace(/[-:]/g, "")
          : "unknown-date";

        try {
          imageArray = product.image ? JSON.parse(product.image) : [];
        } catch (err) {
          console.error("Lỗi parse ảnh:", err);
        }

        // Parse thông tin laptop hoặc accessory
        let extraData = {};
        if (product.laptop) {
          const { id, ...restLaptop } = product.laptop;
          extraData = {
            laptopId: id,
            ...restLaptop,
          };
        } else if (product.accessory) {
          const { id, ...restAccessory } = product.accessory;
          extraData = {
            accessoryId: id,
            ...restAccessory,
          };
        }

        return {
          ...product,
          ...extraData,
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
      setProducts(ProductWithImageUrl);
    }
  };

  const handleAddCart = async (product) => {
    if (UserId) {
      // Đã đăng nhập → gọi API
      let params = {
        userId: UserId,
        productId: product.id,
      };
      const response = await cartService.createCart(params);
      if (response) {
        toast.success("Thêm vào giỏ hàng thành công");
      }
    } else {
      // Chưa đăng nhập → lưu vào localStorage
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

      // Kiểm tra sản phẩm đã có trong local chưa
      const existingProductIndex = guestCart.findIndex(
        (item) => item.productId === product.id
      );

      if (existingProductIndex !== -1) {
        // Nếu đã có → tăng quantity
        guestCart[existingProductIndex].quantity += 1;
      } else {
        // Nếu chưa có → thêm mới
        guestCart.push({
          productId: product.id,
          quantity: 1,
        });
      }

      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      toast.success("Thêm vào giỏ hàng (khách) thành công");
    }
  };
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Box sx={{ padding: "20px" }}>
      {products && products.length > 0 && (
        <Box sx={{ display: "flex", alignItems: "center", my: 4 }}>
          {/* Line bên trái */}
          <Box sx={{ flex: 1, height: "4px", backgroundColor: "#FF5733" }} />

          {/* Khung chữ + 2 tam giác */}
          <Box
            sx={{
              position: "relative",
              border: "2px solid #FF5733",
              borderRadius: "8px",
              px: 4,
              py: 1.5,
              mx: 2,
              backgroundColor: "#fff",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Tam giác bên trái */}
            <Box
              sx={{
                position: "absolute",
                left: "-12px",
                top: "50%",
                transform: "translateY(-50%)",
                width: 0,
                height: 0,
                borderTop: "12px solid transparent",
                borderBottom: "12px solid transparent",
                borderRight: "12px solid #FF5733",
              }}
            />

            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#FF5733",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {categoryName}
            </Typography>

            {/* Tam giác bên phải */}
            <Box
              sx={{
                position: "absolute",
                right: "-12px",
                top: "50%",
                transform: "translateY(-50%)",
                width: 0,
                height: 0,
                borderTop: "12px solid transparent",
                borderBottom: "12px solid transparent",
                borderLeft: "12px solid #FF5733",
              }}
            />
          </Box>

          {/* Line bên phải */}
          <Box sx={{ flex: 1, height: "4px", backgroundColor: "#FF5733" }} />
        </Box>
      )}

      <Grid container spacing={3}>
        {products &&
          products.map((product) => {
            // Tính giá giảm nếu có
            const discount =
              product.price > 0
                ? Math.round(
                    ((product.price - product.salePrice) / product.price) * 100
                  )
                : 0;

            const discountedPrice = product.salePrice;
            const discountAmount = product.price - product.salePrice;
            return (
              <Grid item xs={12} sm={6} md={2.4} key={product.id}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "340px",
                    borderRadius: "12px", // Rounded corners
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Shadow
                    transition: "transform 0.3s ease, box-shadow 0.3s ease", // Smooth transition for hover
                    "&:hover": {
                      // transform: "scale(1.05)", // Scale effect on hover
                      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)", // Bigger shadow on hover
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    alt={product.name}
                    height="140"
                    image={product.imageUrl}
                    onClick={() => handleProductClick(product.id)}
                    sx={{
                      borderTopLeftRadius: "12px", // Rounded corners for top
                      borderTopRightRadius: "12px", // Rounded corners for top
                      transition: "transform 0.3s ease", // Smooth transition for image on hover
                      "&:hover": {
                        transform: "scale(1.1)", // Slight zoom effect on hover
                      },
                    }}
                  />
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      padding: "16px", // Adding some padding
                    }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          color: "#FF5733",
                          flex: 1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {product.name}
                      </Typography>

                      <IconButton
                        onClick={() => handleWishlistToggle(product.id)}
                        sx={{
                          color:
                            likedProducts && likedProducts.includes(product.id)
                              ? "orange"
                              : "gray",
                          transition: "color 0.3s ease", // Smooth color transition
                          "&:hover": {
                            color: "orange", // Change color on hover
                          },
                        }}
                      >
                        {likedProducts && likedProducts.includes(product.id) ? (
                          <Favorite sx={{ color: "orange" }} />
                        ) : (
                          <FavoriteBorder sx={{ color: "gray" }} />
                        )}
                      </IconButton>
                    </Box>

                    {/* Hiển thị giá và giảm giá */}
                    {discount > 0 ? (
                      <Stack spacing={0.5}>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="error.main"
                        >
                          {discountedPrice.toLocaleString("vi-VN")}₫
                          {discount > 0 && (
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{
                                  backgroundColor: "error.main",
                                  color: "white",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  marginLeft: 1,
                                  fontWeight: "bold",
                                  display: "inline-block",
                                }}
                              >
                                -{discount}%
                              </Typography>
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{
                                  textDecoration: "line-through",
                                  color: "text.secondary",
                                  marginLeft: 1,
                                  display: "inline-block",
                                }}
                              >
                                {product.price?.toLocaleString("vi-VN")}₫
                              </Typography>
                            </>
                          )}
                        </Typography>
                        {/* 
                        {discount > 0 && (
                          <Typography
                            variant="body2"
                            sx={{
                              textDecoration: "line-through",
                              color: "text.secondary",
                            }}
                          >
                            {product.price?.toLocaleString("vi-VN")}₫
                          </Typography>
                        )} */}

                        {discount > 0 && (
                          <Typography
                            variant="body2"
                            color="success.main"
                            fontWeight="bold"
                          >
                            Tiết kiệm:{" "}
                            {(product.price - discountedPrice)?.toLocaleString(
                              "vi-VN"
                            )}
                            ₫
                          </Typography>
                        )}
                        {/* {discount > 0 && (
                          <Typography
                            variant="body2"
                            color="success.main"
                            fontWeight="bold"
                          >
                            Tiết kiệm:{" "}
                            {(product.price - discountedPrice)?.toLocaleString(
                              "vi-VN"
                            )}
                            ₫
                          </Typography>
                        )} */}
                      </Stack>
                    ) : (
                      <Typography variant="h6">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.price)}
                      </Typography>
                    )}
                  </CardContent>

                  {/* Nút thêm vào giỏ hàng với icon */}
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleAddCart(product)}
                    startIcon={<ShoppingCart />}
                    sx={{
                      alignSelf: "flex-end",
                      marginTop: "auto", // Đảm bảo nút luôn ở dưới cùng
                      borderRadius: "8px", // Rounded corners for button
                      background: "linear-gradient(90deg, #FF5733, #FF8C00)", // Gradient màu nóng
                      transition: "all 0.3s ease", // Smooth transition for background and color
                      "&:hover": {
                        backgroundPosition: "right", // Hiệu ứng chuyển màu từ trái sang phải khi hover
                        transform: "scale(1.05)", // Zoom effect on hover
                      },
                    }}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                </Card>
              </Grid>
            );
          })}
      </Grid>
      {products && products.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            onClick={() => navigate(`/category/${categoryId}`)}
            sx={{
              width: "60%", // nút dài ngang
              maxWidth: "400px",
              borderRadius: "30px",
              textTransform: "none",
              fontWeight: "bold",
              px: 5,
              py: 1.5,
              fontSize: "1.2rem",
              background: "linear-gradient(to right, #FF5733 50%, #ffffff 50%)",
              backgroundSize: "200% 100%",
              backgroundPosition: "right bottom",
              color: "#FF5733",
              border: "2px solid #FF5733",
              transition: "all 0.4s ease",
              "&:hover": {
                backgroundPosition: "left bottom", // hiệu ứng quét từ trái sang phải
                color: "#fff",
                borderColor: "#FF5733",
                transform: "translateY(-3px)",
                boxShadow: "0px 6px 20px rgba(255,87,51,0.4)", // bóng cam
              },
            }}
          >
            🚀 Xem thêm
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ProductCategoryComponent;
