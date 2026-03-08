import axios from "axios";

const system_key = "medicway_system_key_2024"; // System key for API authentication
const URL = "http://localhost:5000/api/v1/";


// const URL="https://api.medicwaycare.co.in/api/v1/";

// const URL = "https://bc860d0bc571.ngrok-free.app/api/v1/";

const axiosInstance = axios.create({
  baseURL: URL,
  headers: {
    "x-system-key": system_key,
  },
  withCredentials: true,
});

export default axiosInstance;
