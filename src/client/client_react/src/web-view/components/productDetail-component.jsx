import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Rating,
  Badge,
  Grid,
  TextField,
  Avatar,
  Pagination,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import SearchIcon from "@mui/icons-material/Search";
import LoopIcon from "@mui/icons-material/Loop";
import { ArrowBack, ShoppingCart } from "@mui/icons-material";
import productService from "../../services/product-service";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import cartService from "../../services/cart-service";
import commentService from "../../services/comment-service";
import accountService from "../../services/user-service";
import RecommendationList from "./productRecommend-component";
const API_URL = process.env.REACT_APP_API_BASE_URL_PRODUCTS;
const promotionProducts = [
  {
    id: 1,
    name: "Laptop Gaming Siêu Cấp",
    price: 1500,
    discount: 20,
    imageUrl: [
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1593642532400-2682810df593?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1587202372775-b54a5c52b909?auto=format&fit=crop&w=1200&q=80",
    ],
    specs: {
      CPU: "Intel Core i7-12700H",
      RAM: "16GB DDR5",
      SSD: "1TB NVMe",
      GPU: "NVIDIA RTX 4070",
      Display: "15.6 inch QHD 165Hz",
      Weight: "2.1kg",
    },
    rating: 4.5,
    ratingCount: 120,
    description: "hdasldhaksdhklahdlkahskdhaldh;alkd",
  },
];
const PAGE_SIZE = 2; // hoặc số bạn muốn
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [UserId, setUserId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [product, setProduct] = useState({});
  const token = localStorage.getItem("accessToken");
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [totalRating, setTotalRating] = useState(0);
  const [commentRating, setCommentRating] = useState(0);
  const [comments, setComments] = useState([]);
  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!UserId) {
      toast.warning("⚠️ Bạn cần phải đăng nhập để thực hiện chức năng này.");
      return;
    }

    const newComment = {
      content: commentText,
      product_id: id || 0,
      rating: commentRating,
      userId: UserId,
      status: "YES",
    };

    const response = await commentService.createComment(newComment);
    if (response && response.id) {
      fetchAllComment();
    }
  };

  const fetchAllComment = async (pageCurrent = 1) => {
    const response = await commentService.getComment({
      sortList: [{ key: "product_id", value: Number(id) }],
      pageSize: PAGE_SIZE,
      pageCurrent,
    });

    if (response) {
      const userId = response.listData.map((item) => item.userId);

      const userData = await accountService.getUsersSortList({
        sortList: [{ key: "id", value: userId }],
      });

      const mappData = response.listData.map((item) => {
        const matchedUser = userData.users.find(
          (user) => user.id === item.userId
        );

        return {
          ...item,
          name: matchedUser.fullName || null,
        };
      });

      const totalRating = response.listData.reduce((sum, item) => {
        return sum + (Number(item.rating) || 0); // ép về số, tránh lỗi NaN
      }, 0);
      const averageRating =
        response.listData.length > 0
          ? totalRating / response.listData.length
          : 0;

      setAverageRating(averageRating);
      setTotalRating(totalRating);
      setComments(mappData);
      setTotal(response.total); // 👈 backend trả về tổng số comment
      setPage(pageCurrent);
    }
  };
  const totalPages = Math.ceil(total / PAGE_SIZE);

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
    if (!product?.imageUrlList || product.imageUrlList.length === 0) return;

    const interval = setInterval(() => {
      setFade(false); // Bắt đầu ẩn

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % product.imageUrlList.length);
        setFade(true); // Hiện lại
      }, 300); // Delay đổi hình cho mượt
    }, 3000);

    return () => clearInterval(interval);
  }, [product?.imageUrlList?.length]);

  useEffect(() => {
    if (id) {
      fetchProductDetail();
      fetchAllComment();
    }
  }, []);

  const fetchProductDetail = async () => {
    if (id) {
      const response = await productService.getProductsById(id);

      if (response) {
        let imageArray = [];
        const folderName = response.createdAt
          ? new Date(response.createdAt)
              .toISOString()
              .split(".")[0]
              .replace(/[-:]/g, "")
          : "unknown-date";

        try {
          imageArray = response.image ? JSON.parse(response.image) : [];
        } catch (err) {
          console.error("Lỗi parse image:", err);
        }

        const imageUrlList = imageArray.map(
          (imgName) => `${API_URL}/uploads/product/${folderName}/${imgName}`
        );

        setProduct({
          ...response,
          imageArray,
          imageUrlList,
        });
      }
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

  if (!product) {
    return (
      <Box p={5}>
        <Typography variant="h4" color="error">
          Không tìm thấy sản phẩm!
        </Typography>
        <Button onClick={() => navigate(-1)} variant="outlined" sx={{ mt: 2 }}>
          Quay lại
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 1, maxWidth: "1500px", width: "100%", margin: "0 auto" }}>
      <Button
        startIcon={<ArrowBack />}
        variant="contained"
        color="secondary"
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Quay lại
      </Button>

      {/* Grid 3 cột */}
      <Grid container spacing={4} sx={{ mb: 5 }}>
        {/* 1.5/4 Hình ảnh */}
        <Grid item xs={12} md={4}>
          {/* Hình ảnh sản phẩm */}
          <Box
            sx={{
              width: "100%",
              height: 400,
              backgroundColor: "#f5f5f5",
              borderRadius: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {product.imageUrlList && product.imageUrlList.length > 0 && (
              <Box
                component="img"
                src={product.imageUrlList[currentIndex]}
                alt={product.name}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  transition: "opacity 0.5s ease",
                  opacity: fade ? 1 : 0,
                }}
              />
            )}
          </Box>

          {/* Thumbnail */}
          <Stack direction="row" spacing={2} mt={2} justifyContent="center">
            {product.imageUrlList &&
              product.imageUrlList.length > 0 &&
              product.imageUrlList.map((img, index) => (
                <Box
                  key={index}
                  component="img"
                  src={img}
                  alt={`Thumbnail ${index}`}
                  sx={{
                    width: 70,
                    height: 70,
                    objectFit: "cover",
                    borderRadius: 2,
                    border:
                      currentIndex === index
                        ? "2px solid #1976d2"
                        : "1px solid #ccc",
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": {
                      border: "2px solid #1976d2",
                    },
                  }}
                  onClick={() => {
                    setFade(false);
                    setTimeout(() => {
                      setCurrentIndex(index);
                      setFade(true);
                    }, 300);
                  }}
                />
              ))}
          </Stack>
        </Grid>

        <Grid item xs={12} md={5.5}>
          <Stack spacing={3}>
            <Typography variant="h3" fontWeight={600} sx={{ fontSize: "2rem" }}>
              {product.name}
            </Typography>
            {/* Giá gốc và Giá KM */}
            <Stack direction="row" spacing={2} alignItems="center">
              {/* Giá gốc nếu có giảm */}
              {product.salePrice && product.salePrice < product.price && (
                <Typography
                  variant="h6"
                  sx={{
                    textDecoration: "line-through",
                    color: "text.secondary",
                  }}
                >
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price)}
                </Typography>
              )}

              {/* Giá giảm / Giá hiện tại */}
              <Typography variant="h5" sx={{ color: "red", fontWeight: 600 }}>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(
                  product.salePrice && product.salePrice < product.price
                    ? product.salePrice
                    : product.price
                )}
              </Typography>

              {/* Badge giảm giá */}
              {product.salePrice && product.salePrice < product.price && (
                <Box
                  sx={{
                    backgroundColor: "red",
                    color: "#fff",
                    borderRadius: 1,
                    px: 1,
                    py: 0.5,
                    fontWeight: "bold",
                    fontSize: "0.75rem",
                  }}
                >
                  -
                  {Math.round(
                    ((product.price - product.salePrice) / product.price) * 100
                  )}
                  %
                </Box>
              )}
            </Stack>
            {/* Lý do mua */}
            <Paper elevation={2} sx={{ p: 2, mt: 3 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Tại sao nên mua sản phẩm này?
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">🔹 Công nghệ hiện đại</Typography>
                <Typography variant="body2">
                  🔹 Chất lượng đảm bảo, bảo hành 24 tháng
                </Typography>
                <Typography variant="body2">
                  🔹 Giá tốt nhất trong phân khúc
                </Typography>
              </Stack>
            </Paper>

            {/* Rating */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Rating value={averageRating} readOnly />
              <Typography variant="body2" color="text.secondary">
                ({totalRating || 0} đánh giá)
              </Typography>
            </Stack>

            {/* Thêm vào giỏ hàng */}
            <Button
              variant="contained"
              color="error"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={() => handleAddCart(product)}
            >
              Thêm vào giỏ hàng
            </Button>

            {/* Thêm vào Wishlist */}
            {/* <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button variant="outlined" color="primary" fullWidth>
                Thêm vào Wishlist
              </Button>
            </Stack> */}
          </Stack>
        </Grid>

        {/* 1/4 Chính sách bảo hành */}
        <Grid item xs={12} md={2.5}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Chính sách bán hàng
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <EmojiEventsIcon color="primary" />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Cam kết 100% chính hãng
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AccessTimeIcon color="primary" />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Hỗ trợ 24/7
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <MoneyOffIcon color="primary" />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Hoàn tiền 111% nếu hàng giả
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <SearchIcon color="primary" />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Mở hộp kiểm tra nhận hàng
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LoopIcon color="primary" />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Đổi trả trong 7 ngày
                </Typography>
              </Stack>
            </Stack>
          </Paper>
          <Box
            sx={{
              position: "relative",
              mt: 2,
              height: "150px", // Chỉnh chiều cao của banner
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80"
              alt="Banner giảm giá"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                color: "#fff",
              }}
            ></Box>
          </Box>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: 3, mb: 5 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Mô tả sản phẩm
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ lineHeight: 1.8 }}
        >
          {product.description || "Chưa có mô tả cho sản phẩm này."}
        </Typography>
      </Paper>

      {/* Thông tin chi tiết sản phẩm */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Cấu hình chi tiết
        </Typography>
        <Table>
          <TableBody>
            {product.laptop || product.accessory ? (
              Object.entries(product.laptop || product.accessory).map(
                ([key, value]) => (
                  <TableRow key={key}>
                    <TableCell sx={{ fontWeight: 600 }}>{key}</TableCell>
                    <TableCell>
                      {typeof value === "object"
                        ? Object.entries(value)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(", ")
                        : value}
                    </TableCell>
                  </TableRow>
                )
              )
            ) : (
              <TableRow>
                <TableCell colSpan={2}>Không có thông số kỹ thuật.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
      <Paper elevation={3} sx={{ p: 3, mt: 5 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Bình luận sản phẩm
        </Typography>

        {/* Form bình luận */}
        <Box component="form" onSubmit={handleSubmitComment}>
          <Stack spacing={2}>
            {/* <TextField
              label="Tên của bạn"
              variant="outlined"
              fullWidth
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              required
            /> */}
            <TextField
              label="Nội dung bình luận"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            />
            <Box>
              <Typography variant="body1" fontWeight={600} gutterBottom>
                Đánh giá sản phẩm:
              </Typography>
              <Rating
                value={commentRating}
                onChange={(e, newValue) => setCommentRating(newValue)}
              />
            </Box>
            <Button type="submit" variant="contained" color="primary">
              Gửi bình luận
            </Button>
          </Stack>
        </Box>

        {/* Danh sách bình luận */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            {total > 0 ? "Các bình luận gần đây" : "Chưa có bình luận nào"}
          </Typography>

          <Stack spacing={3}>
            {comments.map((cmt) => (
              <Paper key={cmt.id} sx={{ p: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar>{cmt.content.charAt(0).toUpperCase()}</Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {cmt.name ?? cmt.userId}
                    </Typography>
                    <Rating value={cmt.rating} readOnly size="small" />
                  </Box>
                </Stack>
                <Typography variant="body2" mt={1}>
                  {cmt.text}
                </Typography>
              </Paper>
            ))}
          </Stack>

          {totalPages > 1 && (
            <Box mt={3} display="flex" justifyContent="center">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_e, value) => fetchAllComment(value)}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </Box>
      </Paper>
      <Grid item xs={12} sm={6} md={4} lg={3} spacing={2}>
        <RecommendationList productId={id}></RecommendationList>
      </Grid>
    </Box>
  );
};

export default ProductDetail;
