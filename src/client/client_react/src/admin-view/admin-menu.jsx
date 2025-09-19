// src/config/adminMenu.js
import BarChartIcon from "@mui/icons-material/BarChart";
import PersonIcon from "@mui/icons-material/Person";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import DiscountIcon from "@mui/icons-material/Discount";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import CommentIcon from "@mui/icons-material/Comment";
import StarRateIcon from "@mui/icons-material/StarRate";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
export const adminMenu = [
  {
    title: "Thống kê cơ bản",
    path: "/admin",
    icon: <BarChartIcon />,
  },
  {
    title: "Quản lý phân quyền",
    path: "/admin/role",
    icon: <BarChartIcon />,
  },
  {
    title: "Quản lý người dùng",
    path: "/admin/user",
    icon: <PersonIcon />,
  },
  {
    title: "Quản lý sản phẩm",
    icon: <InventoryIcon />,
    children: [
      {
        title: "Danh mục sản phẩm",
        path: "/admin/san-pham/danh-muc",
      },
      {
        title: "Thêm sản phẩm",
        path: "/admin/san-pham",
      },
    ],
  },

  // {
  //   title: "Quản lý slider",
  //   path: "/admin/slider",
  //   icon: <SlideshowIcon />,
  // },
  {
    title: "Quản lý bình luận",
    path: "/admin/binh-luan",
    icon: <CommentIcon />,
  },
  // {
  //   title: "Quản lý đánh giá",
  //   path: "/admin/danh-gia",
  //   icon: <StarRateIcon />,
  // },
  {
    title: "Quản lý voucher",
    path: "/admin/voucher",
    icon: <LocalOfferIcon />,
  },
  {
    title: "Quản lý đơn hàng",
    path: "/admin/order",
    icon: <Inventory2Icon />,
  },
  {
    title: "Thống kê doanh thu",
    path: "/admin/revenue",
    icon: <Inventory2Icon />,
  },
];
