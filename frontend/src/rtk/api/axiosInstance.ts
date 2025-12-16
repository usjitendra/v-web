import axios from "axios";

const system_key = "your_system_key_here";
const URL = "https://api.yourdomain.com";

const axiosInstance = axios.create({
  baseURL: URL,
  headers: {
    "x-system-key": system_key,
  },
  withCredentials: true,
});

export default axiosInstance;
