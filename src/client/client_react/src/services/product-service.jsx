import axios from "axios";
import apiClient from "../authentication/axiosInstance";
const API_URL = process.env.REACT_APP_API_URL_PRODUCTS + "/products"; // Lấy URL từ biến môi trường
const API_URL_RECOMMEND = process.env.REACT_APP_API_BASE_URL_PRODUCTS_RECOMMEND;
const productService = {
  // Lấy danh sách người dùng

  getProducts: async ({
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

  // Lấy thông tin người dùng theo ID
  getProductsById: async (id) => {
    try {
      const response = await apiClient.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      throw error;
    }
  },

  getProductsBycategoryId: async (id) => {
    try {
      const response = await apiClient.get(`${API_URL}/categoryId/${id}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      throw error;
    }
  },

  // Tạo người dùng mới
  createProducts: async (userData) => {
    try {
      const response = await apiClient.post(API_URL, userData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo người dùng:", error);
      throw error;
    }
  },

  // Cập nhật thông tin người dùng
  updateProducts: async (id, userData) => {
    try {
      const response = await apiClient.put(`${API_URL}/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      throw error;
    }
  },

  TruSoluong: async (listProduct) => {
    try {
      const response = await apiClient.put(
        `${API_URL}/TruSoluong/trusoluong`,
        listProduct
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      throw error;
    }
  },

  // Xóa người dùng
  deleteProducts: async (id) => {
    try {
      const response = await apiClient.delete(`${API_URL}/${id}`);
      return response.data; // Trả về true nếu xóa thành công
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      throw error;
    }
  },

  getProductsRecommend: async (id) => {
    try {
      const response = await apiClient.get(
        `${API_URL_RECOMMEND}/recommend?product_id=${id}&top_k=10`
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      throw error;
    }
  },
};

export default productService;
