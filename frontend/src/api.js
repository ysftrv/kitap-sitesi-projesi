import axios from "axios";

// Axios instance — tüm istekler buradan geçer
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Request interceptor: localStorage'da token varsa her isteğe ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
