import { useRoutes, Navigate } from "react-router-dom";

import DashboardAdmin from "./pages/DashboardAdmin";
import UserComponent from "./pages/user-component";
import RoleComponent from "./pages/role-component";
import CategoryComponent from "./pages/category-component";
import ProductComponent from "./pages/product-component";
import VoucherComponent from "./pages/voucher-component";
import OrderComponent from "./pages/order-component";
import CommentComponent from "./pages/comment-component";
import RevenueComponent from "./pages/revenue-component";
const RouterAdmin = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <Navigate to="dashboard" replace />, // redirect về dashboard
    },
    {
      path: "dashboard",
      element: <DashboardAdmin />,
    },
    /// user service
    {
      path: "role",
      element: <RoleComponent />,
    },
    {
      path: "user",
      element: <UserComponent />,
    },

    /// product service
    {
      path: "san-pham/danh-muc",
      element: <CategoryComponent />,
    },
    {
      path: "san-pham",
      element: <ProductComponent />,
    },
    {
      path: "voucher",
      element: <VoucherComponent />,
    },
    {
      path: "order",
      element: <OrderComponent />,
    },
    {
      path: "binh-luan",
      element: <CommentComponent />,
    },
    {
      path: "revenue",
      element: <RevenueComponent />,
    },
    // Thêm các route khác tại đây
  ]);

  return element;
};

export default RouterAdmin;
