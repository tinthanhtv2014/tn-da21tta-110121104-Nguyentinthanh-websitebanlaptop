import axios from "axios";
import apiClient from "../authentication/axiosInstance";
const API_URL = process.env.REACT_APP_API_URL_PRODUCTS + "/carts"; // Lấy URL từ biến môi trường

const cartService = {
  // Lấy danh sách người dùng

  getCartUser: async ({ userId, listCart }) => {
    try {
      const response = await apiClient.get(`${API_URL}/user`, {
        params: { userId, listCart },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      throw error;
    }
  },

  // Lấy thông tin người dùng theo ID
  getCategoryById: async (id) => {
    try {
      const response = await apiClient.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      throw error;
    }
  },

  // Tạo người dùng mới
  createCart: async (userData) => {
    try {
      const response = await apiClient.post(API_URL, userData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo người dùng:", error);
      throw error;
    }
  },

  // Cập nhật thông tin người dùng
  updateCart: async (id, quantity) => {
    try {
      const response = await apiClient.put(`${API_URL}/${id}`, { quantity });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      throw error;
    }
  },

  // Xóa người dùng
  deleteCart: async (id) => {
    try {
      const response = await apiClient.delete(`${API_URL}/${id}`);
      return response.data; // Trả về true nếu xóa thành công
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      throw error;
    }
  },
};

export default cartService;
