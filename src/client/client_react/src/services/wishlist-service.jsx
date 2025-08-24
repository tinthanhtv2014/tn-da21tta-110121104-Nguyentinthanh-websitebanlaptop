import axios from "axios";
import apiClient from "../authentication/axiosInstance";
const API_URL = process.env.REACT_APP_API_URL_PRODUCTS + "/wishlist"; // Lấy URL từ biến môi trường

const wishlistService = {
  // Lấy danh sách người dùng

  // Lấy thông tin người dùng theo ID
  getWishlistByUser: async (userId) => {
    try {
      const response = await apiClient.get(`${API_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      throw error;
    }
  },

  // Tạo người dùng mới
  addToWishlist: async (userData) => {
    try {
      const response = await apiClient.post(API_URL, userData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo người dùng:", error);
      throw error;
    }
  },

  // Cập nhật thông tin người dùng

  // Xóa người dùng
  removeWishlistItem: async (wishlistId) => {
    try {
      const response = await apiClient.delete(`${API_URL}/${wishlistId}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo người dùng:", error);
      throw error;
    }
  },
};

export default wishlistService;
