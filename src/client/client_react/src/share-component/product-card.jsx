import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  IconButton,
  Stack,
} from "@mui/material";
import { ShoppingCart, Favorite, FavoriteBorder } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // 👈 thêm dòng này
const ProductCard = ({ product, liked, onToggleLike, onAddToCart }) => {
  const navigate = useNavigate(); // 👈 hook dùng để điều hướng
  const discountedPrice = product.salePrice || product.price; // Giá đang bán
  const discountAmount =
    product.price > discountedPrice ? product.price - discountedPrice : 0;
  const discount =
    product.price > discountedPrice
      ? Math.round(((product.price - discountedPrice) / product.price) * 100)
      : 0;
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "340px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
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
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
      />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          padding: "16px",
        }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#FF5733", flex: 1 }}
          >
            {product.name}
          </Typography>
          <IconButton
            onClick={() => onToggleLike(product.id)}
            sx={{
              color: liked ? "orange" : "gray",
              transition: "color 0.3s ease",
              "&:hover": {
                color: "orange",
              },
            }}
          >
            {liked ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Stack>

        {discount > 0 ? (
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight="bold" color="error.main">
              {discountedPrice.toLocaleString("vi-VN")}₫
              {discount > 0 && (
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
                  }}
                >
                  -{discount}%
                </Typography>
              )}
            </Typography>

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
            )}

            {discount > 0 && (
              <Typography
                variant="body2"
                color="success.main"
                fontWeight="bold"
              >
                Tiết kiệm:{" "}
                {(product.price - discountedPrice)?.toLocaleString("vi-VN")}₫
              </Typography>
            )}
            {discount > 0 && (
              <Typography
                variant="body2"
                color="success.main"
                fontWeight="bold"
              >
                Tiết kiệm:{" "}
                {(product.price - discountedPrice)?.toLocaleString("vi-VN")}₫
              </Typography>
            )}
          </Stack>
        ) : (
          <Typography variant="h6">
            {product.price.toLocaleString()}₫
          </Typography>
        )}
      </CardContent>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        startIcon={<ShoppingCart />}
        onClick={() => onAddToCart(product.id)}
        sx={{
          alignSelf: "flex-end",
          marginTop: "auto",
          borderRadius: "8px",
          background: "linear-gradient(90deg, #FF5733, #FF8C00)",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundPosition: "right",
            transform: "scale(1.05)",
          },
        }}
      >
        Thêm vào giỏ hàng
      </Button>
    </Card>
  );
};

export default ProductCard;
