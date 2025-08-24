import axios from "axios";
import apiClient from "../authentication/axiosInstance";
const API_URL = process.env.REACT_APP_API_URL_ADDRESS + "/address"; // Lấy URL từ biến môi trường

const addressService = {
  // Lấy danh sách người dùng

  getProvince: async ({
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

      const response = await apiClient.get(`${API_URL}/province`, { params }); // 👈 truyền vào query
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      throw error;
    }
  },

  // Lấy thông tin người dùng theo ID
  getDistrict: async ({
    search = "",
    pageCurrent = 1,
    pageSize = 100,
    sortList = [],
    code,
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

      const response = await apiClient.get(`${API_URL}/district/${code}`, {
        params,
      }); // 👈 truyền vào query
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      throw error;
    }
  },

  getWards: async ({
    search = "",
    pageCurrent = 1,
    pageSize = 100,
    sortList = [],
    code,
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

      const response = await apiClient.get(`${API_URL}/wards/${code}`, {
        params,
      }); // 👈 truyền vào query
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      throw error;
    }
  },
};

export default addressService;
