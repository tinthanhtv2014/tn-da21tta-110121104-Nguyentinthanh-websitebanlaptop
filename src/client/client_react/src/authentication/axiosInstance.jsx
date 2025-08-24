import axios from "axios";
import { toast } from "react-toastify";
const API_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
});

export const setupInterceptors = (setLoading) => {
  apiClient.interceptors.request.use(
    (config) => {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
      } else {
        config.headers["Content-Type"] = "application/json";
      }

      return config;
    },
    (error) => {
      setLoading(false);
      return Promise.reject(error);
    }
  );

  apiClient.interceptors.response.use(
    (response) => {
      setTimeout(() => {
        setLoading(false);
      }, 300);
      return response;
    },
    (error) => {
      setLoading(false);
      if (error.response?.status === 401) {
        toast.error("Đang nhập hết hạn !");
        console.error("Unauthorized! Redirecting to login...");
      }
      return Promise.reject(error);
    }
  );
};

export default apiClient;
