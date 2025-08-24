// src/components/recommendation/RecommendationList.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import ProductCard from "../../share-component/product-card";
import productService from "../../services/product-service"; // bro có sẵn rồi
import cartService from "../../services/cart-service";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import wishlistService from "../../services/wishlist-service";
const API_URL = process.env.REACT_APP_API_BASE_URL_PRODUCTS;

// ví dụ: http://localhost:8000

const RecommendationList = ({ productId, topK = 8 }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedProducts, setLikedProducts] = useState([]);

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

  const handleAddToCart = async (productId) => {
    if (UserId) {
      // Đã đăng nhập → gọi API
      let params = {
        userId: UserId,
        productId: productId,
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
        (item) => item.productId === productId
      );

      if (existingProductIndex !== -1) {
        // Nếu đã có → tăng quantity
        guestCart[existingProductIndex].quantity += 1;
      } else {
        // Nếu chưa có → thêm mới
        guestCart.push({
          productId: productId,
          quantity: 1,
        });
      }

      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      toast.success("Thêm vào giỏ hàng (khách) thành công");
    }
  };
  useEffect(() => {
    if (!productId) return;

    const fetchRecommendations = async () => {
      try {
        setLoading(true);

        // gọi API gợi ý (FastAPI)
        const res = await productService.getProductsRecommend(productId);

        const ids = res.recommendations?.map((r) => r.id) || [];

        if (!ids.length) {
          setRecommendations([]);
          return;
        }

        // gọi productService để lấy chi tiết
        const productRes = await productService.getProducts({
          ids, // tuỳ theo service của bro, có thể là ids hoặc filter khác
          pageCurrent: 1,
          pageSize: ids.length,
        });

        const ProductWithImageUrl = productRes.listData.map((product) => {
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

        setRecommendations(ProductWithImageUrl || []);
      } catch (err) {
        console.error("Lỗi khi fetch recommendations:", err);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [productId, topK]);

  if (loading) {
    return (
      <Typography variant="body1" sx={{ mt: 2 }}>
        ⏳ Đang tải gợi ý sản phẩm...
      </Typography>
    );
  }

  if (!recommendations.length) {
    return (
      <Typography variant="body1" sx={{ mt: 2 }}>
        😶 Không có gợi ý cho sản phẩm này
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 3, mb: 3 }} spacing={2}>
      <Typography variant="h5" gutterBottom>
        🔮 Sản phẩm gợi ý
      </Typography>
      <Grid container spacing={2}>
        {recommendations.map((product) => (
          <Grid item xs={12} sm={6} md={2.4} key={product.product_id}>
            <ProductCard
              product={product}
              liked={likedProducts.includes(product.id)}
              onToggleLike={handleWishlistToggle}
              onAddToCart={handleAddToCart}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RecommendationList;
