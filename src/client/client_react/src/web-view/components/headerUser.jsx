import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Menu,
  MenuItem,
  TextField,
  IconButton,
  Box,
  InputAdornment,
  Snackbar,
  Alert,
  Tooltip,
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
  Redeem,
  Discount,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ModalLogin from "../modals/Login-modal";
import { jwtDecode } from "jwt-decode";
import accountService from "../../services/user-service";
import productService from "../../services/product-service";
import { useThemeMode } from "../../context/ThemeContext";
import { toast } from "react-toastify";
const API_URL = process.env.REACT_APP_API_BASE_URL_PRODUCTS;
const HeaderUser = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLogin, setOpenLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [searchText, setSearchText] = useState("");
  const [productSearch, setProductSearch] = useState([]);
  const { toggleMode, mode } = useThemeMode();
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

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    if (user && user.id) {
      const response = await accountService.getUserById(user.id);
      if (response) {
        setUserData(response);
      }
    }
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchText(value);

    // Gọi API tìm kiếm sản phẩm nếu có input
    if (value.trim().length > 0) {
      try {
        const response = await productService.getProducts({ search: value });
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
        setProductSearch(ProductWithImageUrl);
        console.log("Kết quả tìm kiếm:", ProductWithImageUrl);
        // setProducts(result.products); // nếu cần set lại danh sách sản phẩm
      } catch (error) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      }
    }
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLoginOpen = () => {
    setOpenLogin(true);
    handleMenuClose();
  };
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { latitude, longitude };

          // Lưu vị trí vào localStorage
          localStorage.setItem("location", JSON.stringify(location));
          setLocation(location); // lưu vào state để hiện toast

          // Gọi OpenCage API để lấy địa chỉ
          fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=956f30be66104341b604d59fd94758dc`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.results && data.results[0]) {
                const fullAddress = data.results[0].formatted;
                setAddress(fullAddress);
                localStorage.setItem("userAddress", fullAddress);
                setSnackbarOpen(true); // Hiện toast
              } else {
                console.error("Không tìm thấy địa chỉ.");
              }
            })
            .catch((error) => {
              console.error("Error fetching geocoding data:", error);
            });
        },
        (error) => {
          console.error("Error getting location:", error);
          setSnackbarOpen(true);
        }
      );
    } else {
      alert("Geolocation không được hỗ trợ trong trình duyệt này.");
    }
  };

  return (
    <AppBar
      position="sticky"
      sx={(theme) => ({
        backgroundColor: theme.palette.mode === "dark" ? "#000" : "#fff", // đen ở dark, trắng ở light
        color: theme.palette.mode === "dark" ? "#fff" : "#000",
        boxShadow: "none",
        borderBottom: `1px solid ${theme.palette.divider}`,
      })}
    >
      <Toolbar>
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <Typography variant="h6">
            <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
              Logo
            </Link>
          </Typography>

          {/* Tìm kiếm + Info */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              flexGrow: 1,
              justifyContent: "center",
              position: "relative",
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Tìm kiếm sản phẩm..."
              size="small"
              value={searchText}
              onChange={handleSearchChange}
              sx={{ width: 350, backgroundColor: "white" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            {searchText.trim() !== "" && productSearch.length > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: "40px", // tùy chỉnh khoảng cách dưới TextField
                  left: "24px",
                  zIndex: 10,
                  width: 350,
                  backgroundColor: "inherit",
                  boxShadow: 3,
                  borderRadius: 1,
                  maxHeight: 300,
                  overflowY: "auto",
                }}
              >
                {productSearch.map((product) => (
                  <Box
                    key={product.id}
                    component={Link}
                    to={`/product/${product.id}`} // hoặc id nếu không có slug
                    onClick={() => setSearchText("")}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      padding: 1,
                      borderBottom: "1px solid #eee",
                      textDecoration: "none",
                      color: "inherit",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                  >
                    <img
                      src={product.imageUrl || "/default-image.jpg"}
                      alt={product.name}
                      width={40}
                      height={40}
                      style={{ objectFit: "cover", borderRadius: 4 }}
                    />
                    <Box>
                      <Typography variant="body2" noWrap>
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {product.price?.toLocaleString("vi-VN")}₫
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PhoneIcon fontSize="small" />
              <Typography variant="body2">Hotline: 1900 123 456</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOnIcon fontSize="small" />
              <Typography variant="body2">HCM, Việt Nam</Typography>
            </Box>
          </Box>

          {/* Login + Cart */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {userData ? (
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton onClick={handleMenuOpen}>
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      userData.fullName || userData.firstName
                    )}`}
                    alt="avatar"
                    width={32}
                    height={32}
                    style={{ borderRadius: "50%" }}
                  />
                </IconButton>
                <Typography variant="body2" fontWeight={500}>
                  {userData.fullName}
                </Typography>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleMenuClose}
                  >
                    Thông tin cá nhân
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      localStorage.removeItem("accessToken");
                      setUser(null);
                      handleMenuClose();

                      window.location.reload(); // reload lại để reset UI
                      toast.success("Đăng xuất thành công");
                    }}
                  >
                    Đăng xuất
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box>
                {" "}
                <Button onClick={handleLoginOpen} sx={{ color: "black" }}>
                  Login / Sign Up
                </Button>
              </Box>
            )}
            <IconButton component={Link} to="/cart">
              <ShoppingCartIcon sx={{ color: "inherit" }} />
            </IconButton>

            {/* Nút lấy vị trí */}
            <Button
              onClick={(e) => handleGetLocation(e)}
              sx={{ color: "inherit" }}
            >
              Lấy Vị Trí
            </Button>
          </Box>
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center" // đúng key nè
            mb={2}
          >
            <Tooltip
              title={`Chuyển sang chế độ ${mode === "light" ? "tối" : "sáng"}`}
            >
              <IconButton onClick={toggleMode}>
                {mode === "light" ? <DarkMode /> : <LightMode />}
              </IconButton>
            </Tooltip>
          </Box>
        </Container>
      </Toolbar>

      <ModalLogin
        open={openLogin}
        handleClose={() => setOpenLogin(false)}
        setUser={setUser}
      />

      {/* Snackbar thông báo vị trí */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={address ? "success" : "error"}
          onClose={() => setSnackbarOpen(false)}
        >
          {address
            ? `📍 Vị trí hiện tại: ${address}`
            : "❌ Không thể lấy vị trí!"}
        </Alert>
      </Snackbar>
    </AppBar>
  );
};

export default HeaderUser;
