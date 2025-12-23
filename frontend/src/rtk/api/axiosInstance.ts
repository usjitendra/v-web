import axios from "axios";

const system_key = "key_from_env_or_config";
// const URL = "http://localhost:5000/api/v1/";
const URL = "https://1030e685fe9e.ngrok-free.app/api/v1/";

const axiosInstance = axios.create({
  baseURL: URL,
  headers: {
    "x-system-key": system_key,
  },
  withCredentials: true,
});

export default axiosInstance;
