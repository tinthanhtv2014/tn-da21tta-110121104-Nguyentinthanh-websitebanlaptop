import axios from "axios";
import apiClient from "../authentication/axiosInstance";
const API_URL = process.env.REACT_APP_API_URL_ORDER + "/orders"; // Lấy URL từ biến môi trường

const orderService = {
  // Lấy danh sách người dùng

  getOrder: async ({
    search = "",
    pageCurrent = 1,
    pageSize = 1000,
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
  getOrderbyUserId: async ({
    search = "",
    pageCurrent = 1,
    pageSize = 1000,
    sortList = [],
    userId,
  } = {}) => {
    try {
      const params = {
        pageCurrent,
        pageSize,
        userId,
      };

      if (search) {
        params.search = search;
      }

      if (sortList && sortList.length > 0) {
        // Nếu sortList là array thì stringify để truyền qua query
        params.sortList = JSON.stringify(sortList);
      }

      const response = await apiClient.get(
        `${API_URL}/getAllOrderbyUserId/getData`,
        { params }
      ); // 👈 truyền vào query
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
  createOrder: async (userData) => {
    try {
      console.log("lsdhakldsada", userData);
      const response = await apiClient.post(API_URL, userData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo người dùng:", error);
      throw error;
    }
  },

  // Cập nhật thông tin người dùng
  updateOrder: async (id, userData) => {
    try {
      const response = await apiClient.put(`${API_URL}/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      throw error;
    }
  },

  updateOrderCanceled: async (id) => {
    try {
      const response = await apiClient.put(
        `${API_URL}/updateOrderCanceled/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      throw error;
    }
  },

  // Xóa người dùng
  deleteOrder: async (id) => {
    try {
      const response = await apiClient.delete(`${API_URL}/${id}`);
      return response.data; // Trả về true nếu xóa thành công
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      throw error;
    }
  },
  paymentMomo: async ({ amount, orderInfo, redirectUrl, ipnUrl }) => {
    try {
      const response = await apiClient.post(`${API_URL}/payment/momo`, {
        amount,
        orderInfo,
        redirectUrl,
        ipnUrl,
      });
      return response.data; // Trả về true nếu xóa thành công
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      throw error;
    }
  },
  paymentVnpay: async ({ amount, orderInfo }) => {
    try {
      const response = await apiClient.post(`${API_URL}/payment/vnpay`, {
        amount,
        orderInfo,
      });
      return response.data; // Trả về true nếu xóa thành công
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      throw error;
    }
  },

  getOrderStatusStats: async () => {
    try {
      const response = await apiClient.get(
        `${API_URL}/getOrderStatusStats/getData/data`
      ); // 👈 truyền vào query
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      throw error;
    }
  },
  getTop5Products: async () => {
    try {
      const response = await apiClient.get(
        `${API_URL}/getTop5Products/getTop5Products/data`
      ); // 👈 truyền vào query
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      throw error;
    }
  },

  getTop5ProductsAllTime: async () => {
    try {
      const response = await apiClient.get(
        `${API_URL}/getTop5ProductsAllTime/getTop5ProductsAllTime/data`
      ); // 👈 truyền vào query
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      throw error;
    }
  },

  getMonthlyRevenueStats: async (year) => {
    try {
      const response = await apiClient.get(
        `${API_URL}/getMonthlyRevenueStats/getMonthlyRevenueStats/data/${year}`
      ); // 👈 truyền vào query
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      throw error;
    }
  },

  getRevenueStats: async () => {
    try {
      const response = await apiClient.get(
        `${API_URL}/getRevenueStats/getRevenueStats/data/`
      ); // 👈 truyền vào query
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      throw error;
    }
  },

  getRevenueStatsData: async (startDate, endDate, groupBy) => {
    try {
      const response = await apiClient.get(
        `${API_URL}/getRevenueStatsData/getRevenueStatsData/data`,
        {
          params: {
            startDate,
            endDate,
            groupBy,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thống kê doanh thu:", error);
      throw error;
    }
  },
};

export default orderService;
