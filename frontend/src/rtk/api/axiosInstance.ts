import axios from "axios";

const system_key = "key_from_env_or_config";
// const URL = "http://localhost:5000/api/v1/";

const URL = "https://bc860d0bc571.ngrok-free.app/api/v1/";

const axiosInstance = axios.create({
  baseURL: URL,
  headers: {
    "x-system-key": system_key,
  },
  withCredentials: true,
});

export default axiosInstance;
