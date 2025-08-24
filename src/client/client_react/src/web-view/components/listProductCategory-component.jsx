import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Grid, Pagination } from "@mui/material";
import CategoryListComponent from "./category-component";
import ProductCard from "../../share-component/product-card";
import productService from "../../services/product-service";
import cartService from "../../services/cart-service";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import wishlistService from "../../services/wishlist-service";
const API_URL = process.env.REACT_APP_API_BASE_URL_PRODUCTS;
const categories = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Phụ kiện" },
  { id: 3, name: "Màn hình" },
];

const allProducts = [
  {
    id: 1,
    name: "Laptop Dell XPS",
    price: 25000000,
    categoryId: 1,
    imageUrl: "https://via.placeholder.com/300x200?text=Dell+XPS",
  },
  {
    id: 2,
    name: "Laptop MacBook Pro",
    price: 35000000,
    categoryId: 1,
    imageUrl: "https://via.placeholder.com/300x200?text=MacBook+Pro",
  },
];

const ITEMS_PER_PAGE = 8;

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);
  const [page, setPage] = useState(1);
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
    fetchProduct();
    setPage(1);
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

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentProducts = products.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <Box sx={{ pt: 1, maxWidth: "1500px", width: "100%", margin: "0 auto" }}>
      {/* Danh mục mobile */}
      <Box sx={{ mb: 2, display: { xs: "block", md: "none" } }}>
        <CategoryListComponent categories={categories} />
      </Box>

      {/* Banner */}
      <Box sx={{ mb: 3 }}>
        <img
          src="https://via.placeholder.com/1500x300?text=Banner+Category"
          alt="Banner"
          style={{ width: "100%", borderRadius: 8 }}
        />
      </Box>

      <Grid container spacing={2}>
        {/* Sidebar danh mục desktop */}
        <Grid
          item
          xs={12}
          md={2.4}
          sx={{ display: { xs: "none", md: "block" } }}
        >
          <CategoryListComponent categories={categories} />
        </Grid>

        {/* Danh sách sản phẩm */}
        <Grid item xs={12} md={9.6}>
          <Typography variant="h4" gutterBottom>
            Sản phẩm trong danh mục: {categoryId}
          </Typography>

          <Grid container spacing={2}>
            {currentProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard
                  product={product}
                  liked={likedProducts.includes(product.id)}
                  onToggleLike={handleWishlistToggle}
                  onAddToCart={handleAddToCart}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box mt={4} display="flex" justifyContent="center" mb={4}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CategoryPage;
