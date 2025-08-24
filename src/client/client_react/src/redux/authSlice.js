import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("accessToken");

const initialState = {
  isAuthenticated: !!token,
  accessToken: token || null,
  userInfo: token ? jwtDecode(token) : null,
  totalCart: 0,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.userInfo = action.payload.userInfo;

      localStorage.setItem("accessToken", action.payload.accessToken);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.userInfo = null;
      state.itemCart = [];

      localStorage.removeItem("accessToken");
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setTotalCart: (state, action) => {
      state.totalCart = action.payload; // Cập nhật tổng tiền giỏ hàng
    },
  },
});

export const { login, logout, setUserInfo, setTotalCart } = authSlice.actions;
export default authSlice.reducer;
