import { useRoutes, Navigate } from "react-router-dom";

import MainPage from "./page/page";
import Cart from "./components/cart-component";
import Profile from "./components/profile-component";
import Login from "./page/login";
import ProductDetail from "./components/productDetail-component";
import OrderList from "./components/orderUser-component";
import CheckoutPage from "./components/orderInfomation-component";
import CategoryPage from "./components/listProductCategory-component";
import PaymentThankYouPage from "./components/paymentThanks-component";
import WistListProduct from "./components/wishlist-component";
import PointHistory from "./components/pointHistory-component";
import ForgotPassword from "./components/forgotPassword-component";
const RouterView = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <MainPage />,
    },
    {
      path: "/cart",
      element: <Cart />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/product/:id",
      element: <ProductDetail />,
    },
    {
      path: "/userOrder",
      element: <OrderList />,
    },
    {
      path: "/checkout",
      element: <CheckoutPage />,
    },
    {
      path: "/category/:categoryId",
      element: <CategoryPage />,
    },
    {
      path: "/thankpage",
      element: <PaymentThankYouPage />,
    },
    {
      path: "/wishlist",
      element: <WistListProduct />,
    },
    {
      path: "/pointHistory",
      element: <PointHistory />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);

  return <div> {element} </div>;
};

export default RouterView;
