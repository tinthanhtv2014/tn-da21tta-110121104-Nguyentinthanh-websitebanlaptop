import axios from "axios";
import apiClient from "../authentication/axiosInstance";
const API_URL = process.env.REACT_APP_API_URL_ORDER + "/uservouchers"; // Lấy URL từ biến môi trường

const uservoucherService = {
  // Lấy danh sách người dùng

  getuserVouchers: async ({
    search = "",
    pageCurrent = 1,
    pageSize = 10,
    sortList = [],
  } = {}) => {
    try {
      const params = {
        pageCurrent,
        pageSize,
      };

      if (search) {
        params.search = search;
      }

      if (sortList && sortList.length > 0) {
        // Nếu sortList là array thì stringify để truyền qua query
        params.sortList = JSON.stringify(sortList);
      }

      const response = await apiClient.get(`${API_URL}`, { params }); // 👈 truyền vào query
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      throw error;
    }
  },

  // Lấy thông tin người dùng theo ID

  // Tạo người dùng mới
  createuserVouchers: async (userData) => {
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
  deleteuserVouchers: async (userId, voucherId) => {
    try {
      const response = await apiClient.delete(
        `${API_URL}?userId=${userId}&voucherId=${voucherId}`
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi xóa userVoucher:", error);
      throw error;
    }
  },
};

export default uservoucherService;
