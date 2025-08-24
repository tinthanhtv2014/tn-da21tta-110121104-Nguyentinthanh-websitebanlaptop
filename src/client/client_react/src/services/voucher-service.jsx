import axios from "axios";
import apiClient from "../authentication/axiosInstance";
const API_URL = process.env.REACT_APP_API_URL_ORDER + "/vouchers"; // Lấy URL từ biến môi trường

const voucherService = {
  // Lấy danh sách người dùng

  getVouchers: async ({
    search = "",
    pageCurrent = 1,
    pageSize = 1000,
    sortList = [],
    optionExtend = [],
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
      if (optionExtend && optionExtend.length > 0) {
        // Nếu sortList là array thì stringify để truyền qua query
        params.optionExtend = JSON.stringify(optionExtend);
      }
      const response = await apiClient.get(`${API_URL}`, { params }); // 👈 truyền vào query
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      throw error;
    }
  },

  getVouchersUser: async ({
    search = "",
    pageCurrent = 1,
    pageSize = 10,
    sortList = [],
    optionExtend = [],
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
      if (optionExtend && optionExtend.length > 0) {
        // Nếu sortList là array thì stringify để truyền qua query
        params.optionExtend = JSON.stringify(optionExtend);
      }
      const response = await apiClient.get(`${API_URL}/userVoucher/data`, {
        params,
      }); // 👈 truyền vào query
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      throw error;
    }
  },

  // Lấy thông tin người dùng theo ID
  getVouchersById: async (id) => {
    try {
      const response = await apiClient.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      throw error;
    }
  },

  // Tạo người dùng mới
  createVouchers: async (userData) => {
    try {
      const response = await apiClient.post(API_URL, userData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo người dùng:", error);
      throw error;
    }
  },

  // Cập nhật thông tin người dùng
  updateVouchers: async (id, userData) => {
    try {
      const response = await apiClient.put(`${API_URL}/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      throw error;
    }
  },

  // Xóa người dùng
  deleteVouchers: async (id) => {
    try {
      const response = await apiClient.delete(`${API_URL}/hard/${id}`);
      return response.data; // Trả về true nếu xóa thành công
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      throw error;
    }
  },
};

export default voucherService;
