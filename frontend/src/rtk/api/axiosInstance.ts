import axios from 'axios';

const system_key = import.meta.env.VITE_X_SYSTEM_KEY;
const URL = import.meta.env.VITE_PRODUCTION_URL;

const axiosInstance = axios.create({
  baseURL: URL,
  // baseURL: 'http://localhost:4000/api/v1/', 
  headers: {
    // 'Content-Type': 'application/json',
    'x-system-key': system_key,
  },
  withCredentials: true,

});

export default axiosInstance;
