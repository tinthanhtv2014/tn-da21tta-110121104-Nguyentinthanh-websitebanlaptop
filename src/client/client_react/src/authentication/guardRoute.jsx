import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import accountService from "../services/user-service";
import { useDispatch } from "react-redux";
import { login, logout } from "../redux/authSlice";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const GuardRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false); // ✅ Trạng thái kiểm tra quyền truy cập
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAdmin = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        try {
          const decoded = jwtDecode(accessToken);
          const isAdmin = await accountService.verifyAdmin(accessToken);

          if (isAdmin === true) {
            const userInfo = await accountService.getUserById(decoded.id);
            toast.success("bạn đã đăng nhập thành công");
            dispatch(login({ accessToken, userInfo }));
            setHasAccess(true); // ✅ Cho phép vào
          } else {
            toast.error("Bạn không có quyền vào trang quản trị");
            setHasAccess(false); // ❌ Không cho vào
            dispatch(logout());
          }
        } catch (error) {
          console.error("Error verifying admin:", error);
          toast.error("Bạn không có quyền vào trang quản trị");
          setHasAccess(false); // ❌ Không cho vào
          dispatch(logout());
        }
      } else {
        toast.error("Bạn không có quyền vào trang quản trị");
        setHasAccess(false); // ❌ Không cho vào
        dispatch(logout());
      }
      setLoading(false);
    };

    checkAdmin();
  }, [dispatch]);

  // Loading UI
  if (loading) return <div>Loading...</div>;

  // ❌ Không có quyền thì redirect
  if (!hasAccess) return <Navigate to="/login" replace />;

  // ✅ Có quyền thì render
  return children;
};

export default GuardRoute;
