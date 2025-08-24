import axios from "axios";
import apiClient from "../authentication/axiosInstance";

const API_URL = process.env.REACT_APP_API_URL + "/users"; // Lấy URL từ biến môi trường
const AUTH_URL = process.env.REACT_APP_API_URL + "/auths"; // Lấy URL từ biến môi trường
const accountService = {
  // Lấy danh sách người dùng

  getUsers: async ({
    search = "",
    pageCurrent = 1,
    pageSize = 1600,
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

  getUsersSortList: async ({
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

      const response = await apiClient.get(
        `${API_URL}/getUsersSortList/getData`,
        {
          params,
        }
      ); // 👈 truyền vào query
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      throw error;
    }
  },

  // Lấy thông tin người dùng theo ID
  getUserById: async (id) => {
    try {
      const response = await apiClient.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      throw error;
    }
  },

  // Tạo người dùng mới
  createUser: async (userData) => {
    try {
      const response = await apiClient.post(API_URL, userData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo người dùng:", error);
      throw error;
    }
  },

  // Cập nhật thông tin người dùng
  updateUser: async (id, userData) => {
    try {
      const response = await apiClient.put(`${API_URL}/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      throw error;
    }
  },
  // Cập nhật thông tin người dùng
  updateUserTenant: async (id, userData) => {
    try {
      const response = await apiClient.post(
        `${API_URL}/updateTenant`,
        userData
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      throw error;
    }
  },
  // Xóa người dùng
  deleteUser: async (id) => {
    try {
      const response = await apiClient.delete(`${API_URL}/${id}`);
      return response.data; // Trả về true nếu xóa thành công
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      throw error;
    }
  },

  // Đăng ký người dùng
  register: async (userData) => {
    try {
      const response = await apiClient.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi đăng ký người dùng:", error);
      throw error;
    }
  },

  // Đăng nhập người dùng
  // login: async (emailAddress, password) => {
  //   try {
  //     const response = await axios.post(`${API_URL}/login`, {
  //       emailAddress,
  //       password,
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error("Lỗi khi đăng nhập người dùng:", error);
  //     throw error;
  //   }
  // },

  login: async (login) => {
    try {
      const response = await axios.post(`${API_URL}/login`, login);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi đăng nhập người dùng:", error);
      throw error;
    }
  },

  verifyGoogleToken: async (token) => {
    // fetching userinfo can be done on the client or the server
    const userInfo = await axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data);

    try {
      const response = await axios.post(`${API_URL}/verify-google-token`, {
        token,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateDynamicUser: async (id, userData) => {
    try {
      const response = await apiClient.put(
        `${API_URL}/updateDynamicUser/${id}`,
        userData
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      throw error;
    }
  },
  updateAvatarUser: async (id, userData) => {
    try {
      const response = await apiClient.put(
        `${API_URL}//updateImage/Image/${id}`,
        userData
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      throw error;
    }
  },

  updatePasswordUser: async (id, newPassword) => {
    try {
      const response = await apiClient.put(
        `${API_URL}/updatePasswordUser/password/data/${id}`,
        { newPassword }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      throw error;
    }
  },

  updatePointUser: async (id, point, key) => {
    try {
      const response = await apiClient.put(
        `${API_URL}/updatePointUser/point/data/${id}`,
        { point, key }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      throw error;
    }
  },

  sendEmail: async (sendTo, subject, content, htmlTemplate) => {
    const data = {
      sendTo,
      subject,
      content,
      htmlTemplate,
    };
    try {
      const response = await apiClient.post(`${AUTH_URL}/sendMail`, data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      throw error;
    }
  },
  verifyAdmin: async (accessToken) => {
    try {
      const response = await apiClient.post(`${API_URL}/verifyAdmin`, {
        accessToken: accessToken,
      });
      return response.data.check;
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      throw error;
    }
  },

  getUserStats: async () => {
    try {
      const response = await apiClient.get(
        `${API_URL}/getUserStats/getUserStats/data`
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      throw error;
    }
  },
  getNewUsersByMonth: async () => {
    try {
      const response = await apiClient.get(
        `${API_URL}/getNewUsersByMonth/getNewUsersByMonth/data`
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      throw error;
    }
  },

  sendOtp: async (email) => {
    try {
      const response = await apiClient.post(`${API_URL}/sendOtp`, {
        email: email,
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      throw error;
    }
  },

  sendSms: async (phone) => {
    try {
      const response = await apiClient.post(`${API_URL}/sendSms`, {
        phone: phone,
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      throw error;
    }
  },

  sendOrderConfirmationEmail: async (order) => {
    try {
      const response = await apiClient.post(
        `${API_URL}/sendOrderConfirmationEmail`,
        order
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      throw error;
    }
  },

  updatePasswordUserWithEmail: async (id, newPassword) => {
    try {
      const response = await apiClient.put(
        `${API_URL}/updatePasswordUserWithEmail/updatePasswordUserWithEmail/data/${id}`,
        { newPassword }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      throw error;
    }
  },
};

export default accountService;
