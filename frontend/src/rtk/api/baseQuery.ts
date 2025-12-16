import { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios, { AxiosRequestConfig } from 'axios';
import axiosInstance from './axiosInstance';

interface AxiosBaseQueryArgs {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: any;
  params?: any;
    headers?: Record<string, string>; 
}




const axiosBaseQuery: BaseQueryFn<AxiosBaseQueryArgs, unknown, unknown> = async ({
  url,
  method = 'GET',
  data,
  params,
  headers
}) => {
  try {
    const result = await axiosInstance({
      url,
      method,
      data,
      params,
      withCredentials: true,
      headers: {
        'x-system-key': import.meta.env.VITE_X_SYSTEM_KEY, // always include
        ...headers, // ← merge headers from query
      },
    });

    return { data: result.data };
  } catch (axiosError: any) {
    return {
      error: {
        status: axiosError.response?.status,
        data: axiosError.response?.data || axiosError.message,
      },
    };
  }
};



export default axiosBaseQuery;
