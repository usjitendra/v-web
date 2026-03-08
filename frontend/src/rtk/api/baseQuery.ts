import axiosInstance from "./axiosInstance";

const axiosBaseQuery = async ({
  url,
  method = "GET",
  data = null,
  params = null,
  headers = {},
}) => {
  try {
    const result = await axiosInstance({
      url,
      method,
      data,
      params,
      headers: {
        // Use the system key from axiosInstance, don't override
        ...headers,
      },
      withCredentials: true,
    });

    return { data: result.data };
  } catch (error) {
    return {
      error: {
        status: error?.response?.status,
        data: error?.response?.data || error?.message || "Unknown error",
      },
    };
  }
};

export default axiosBaseQuery;
