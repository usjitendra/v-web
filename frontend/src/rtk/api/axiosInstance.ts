import axios from "axios";

const system_key = "key_from_env_or_config";
const URL = "https://api.yourdomain.com";

const axiosInstance = axios.create({
  baseURL: URL,
  headers: {
    "x-system-key": system_key,
  },
  withCredentials: true,
});

export default axiosInstance;
