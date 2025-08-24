import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Button,
  Box,
  Divider,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import cartService from "../../services/cart-service";
const API_URL = process.env.REACT_APP_API_BASE_URL_PRODUCTS;
console.log("sldkja;đá", API_URL);
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const hasShownEmptyToast = useRef(false); // 👈 để đảm bảo chỉ toast 1 lần
  const [UserId, setUserId] = useState(null);
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
    fetchCartData();
  }, [UserId]);

  const fetchCartData = async () => {
    if (UserId) {
      // Đã đăng nhập → gọi API
      const userId = UserId;
      const response = await cartService.getCartUser({ userId });

      const ProductWithImageUrl = response.products.map((product) => {
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

        return {
          ...product,
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

      if (response) {
        setCartItems(ProductWithImageUrl);
      }
    } else {
      // ❗ Lấy giỏ hàng local khi chưa đăng nhập
      const cartLocal = localStorage.getItem("guestCart");

      if (!cartLocal) {
        if (!hasShownEmptyToast.current) {
          toast.info("Giỏ hàng trống");
          hasShownEmptyToast.current = true;
          setCartItems([]);
        }
        return;
      }

      try {
        const listCart = JSON.parse(cartLocal);

        if (!Array.isArray(listCart) || listCart.length === 0) {
          if (!hasShownEmptyToast.current) {
            setCartItems([]); // ← gọi lại liên tục nếu chưa "shown"
            toast.info("Giỏ hàng trống");
            hasShownEmptyToast.current = true;
          }
          return;
        }

        const response = await cartService.getCartUser({ listCart });

        const productsWithImageUrl = response.map((product) => {
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

          return {
            ...product,
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
        console.log("sdkaproductsWithImageUrljdasdasd", productsWithImageUrl);
        setCartItems(productsWithImageUrl);
      } catch (err) {
        console.error("Lỗi khi xử lý giỏ hàng local:", err);
        toast.error("Đã có lỗi khi tải giỏ hàng từ localStorage");
      }
    }
  };

  const increaseQuantity = async (product) => {
    const newQuantity = product.quantity + 1;

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === product.id ? { ...item, quantity: newQuantity } : item
      )
    );

    if (UserId) {
      try {
        await cartService.updateCart(product.cartId, newQuantity);
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
      }
    } else {
      // 👇 Cập nhật localStorage khi chưa đăng nhập
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const updatedCart = guestCart.map((item) =>
        parseInt(item.productId) === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
    }
  };

  const decreaseQuantity = async (product) => {
    if (product.quantity <= 1) return;

    const newQuantity = product.quantity - 1;

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === product.id ? { ...item, quantity: newQuantity } : item
      )
    );

    if (UserId) {
      try {
        await cartService.updateCart(product.cartId, newQuantity);
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
      }
    } else {
      // 👇 Cập nhật localStorage khi chưa đăng nhập
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const updatedCart = guestCart.map((item) =>
        parseInt(item.productId) === product.id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = async (product) => {
    if (UserId) {
      // 👉 Đã đăng nhập → gọi API
      try {
        const response = await cartService.deleteCart(product.cartId);
        if (response) {
          toast.success("Xoá sản phẩm khỏi giỏ hàng thành công");
          fetchCartData(); // Cập nhật lại giỏ
        }
      } catch (error) {
        toast.error("Lỗi khi xoá sản phẩm");
        console.error(error);
      }
    } else {
      // 👉 Chưa đăng nhập → xoá trong localStorage
      try {
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        const updatedCart = guestCart.filter(
          (item) => parseInt(item.productId) !== product.id
        );
        localStorage.setItem("guestCart", JSON.stringify(updatedCart));

        toast.success("Xoá sản phẩm khỏi giỏ hàng thành công");
        fetchCartData();
      } catch (error) {
        toast.error("Lỗi khi xoá sản phẩm khỏi local");
        console.error(error);
      }
    }
  };

  const calculateTotal = () =>
    cartItems.reduce(
      (total, item) => total + (item.salePrice || item.price) * item.quantity,
      0
    );

  return (
    <Box sx={{ p: 4, maxWidth: "1200px", margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        🛒 Giỏ hàng của bạn
      </Typography>

      <Paper
        elevation={3}
        sx={{
          maxHeight: "800px",
          overflowY: "auto",
          p: 2,
          mb: 3,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        {cartItems.length === 0 ||
        JSON.parse(localStorage.getItem("guestCart") || "[]").length === 0 ? (
          <Typography variant="h6" color="text.secondary" sx={{ my: 4 }}>
            🛒 Bạn chưa có sản phẩm nào trong giỏ hàng.
          </Typography>
        ) : (
          cartItems.map((item) => (
            <Card
              key={item.id}
              sx={{
                display: "flex",
                mb: 2,
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              <CardMedia
                component="img"
                image={item.imageUrl}
                alt={item.name}
                sx={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 2,
                }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>

                <Box
                  sx={{ display: "flex", alignItems: "center", mt: 1, gap: 1 }}
                >
                  {item.salePrice && item.salePrice < item.price ? (
                    <>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ textDecoration: "line-through" }}
                      >
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.price)}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ color: "red", fontWeight: "bold" }}
                      >
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.salePrice)}
                        <Box
                          component="span"
                          sx={{
                            ml: 1,
                            px: 1,
                            py: 0.25,
                            bgcolor: "red",
                            color: "#fff",
                            borderRadius: 1,
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                          }}
                        >
                          -
                          {Math.round(
                            ((item.price - item.salePrice) / item.price) * 100
                          )}
                          %
                        </Box>
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.salePrice || item.price)}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <IconButton
                    onClick={() => decreaseQuantity(item)}
                    size="large"
                    color="primary"
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      minWidth: "36px",
                      height: "36px",
                      backgroundColor: "#f9f9f9",
                      "&:hover": {
                        backgroundColor: "#e0e0e0",
                      },
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>

                  <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>

                  <IconButton
                    onClick={() => increaseQuantity(item)}
                    size="large"
                    color="primary"
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      minWidth: "36px",
                      height: "36px",
                      backgroundColor: "#f9f9f9",
                      "&:hover": {
                        backgroundColor: "#e0e0e0",
                      },
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </CardContent>

              <Box sx={{ display: "flex", alignItems: "center", pr: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={() => removeFromCart(item)}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f44336",
                      transform: "scale(1.1)",
                    },
                    minWidth: "40px",
                    height: "40px",
                    padding: "6px 12px",
                  }}
                >
                  Xóa
                </Button>
              </Box>
            </Card>
          ))
        )}
      </Paper>

      {cartItems.length > 0 && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mb: 1,
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Tổng tiền:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "red" }}>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(calculateTotal())}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />
          <Button
            variant="contained"
            color="success"
            size="large"
            sx={{ mt: 2 }}
            onClick={() =>
              navigate("/checkout", {
                state: { cartItems, total: calculateTotal() },
              })
            }
          >
            Xác nhận thanh toán
          </Button>
        </>
      )}
    </Box>
  );
};

export default Cart;
