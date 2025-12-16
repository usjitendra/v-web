import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../api/baseQuery";

// -------------------- Interfaces --------------------
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  company: string;
  role: "buyer" | "seller";
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
}

export interface VerifyResponse {
  success: boolean;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export interface Category {
  term_id: number;
  name: string;
  slug: string;
  description: string;
  thumbnail_id: string;
}

// -------------------- OTP / Forgot Password Interfaces --------------------
export interface SendOtpRequest {
  email: string;
}

export interface SendOtpResponse {
  message: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  verified: boolean;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface UpdateUserSettingsRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  currentPassword?: string;
  newPassword?: string;
  language?: string;
  timezone?: string;
  currency?: string;
  userId?: string;
}

export interface UpdateUserSettingsResponse {
  success: boolean;
  message: string;
}

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

const getTokens = () => {
  const accessToken = localStorage.getItem("accessToken") || "";
  const refreshToken = localStorage.getItem("refreshToken") || "";
  return { accessToken, refreshToken };
};

// API Slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    //  User / Auth
    getUsers: builder.query<any[], void>({
      query: () => ({ url: "/user/all-user" }),
    }),
    getUserById: builder.query<any, string>({
      query: (id) => ({ url: `/users/${id}` }),
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "user/login",
        method: "POST",
        data: credentials,
      }),
    }),
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (userData) => ({
        url: "/user/signup",
        method: "POST",
        data: userData,
      }),
    }),
    verifyUser: builder.query<VerifyResponse, void>({
      query: () => {
        const { accessToken, refreshToken } = getTokens();
        

        return {
          url: "/user/verify-user",
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`, // access token
            "x-refresh-token": refreshToken, // optional header for refresh token
          },
        };
      },
    }),

    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
    }),

    // -------------------- Categories --------------------
    getCategories: builder.query<Category[], string | void>({
      query: (lang = "en") => ({
        url: `/product/category?lang=${lang}`,
        method: "GET",
      }),
    }),

    // -------------------- OTP / Forgot Password --------------------
    sendOtp: builder.mutation<SendOtpResponse, SendOtpRequest>({
      query: (body) => ({
        url: "/user/forgot-password/send-otp",
        method: "POST",
        data: body,
      }),
    }),
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (body) => ({
        url: "/user/forgot-password/verify-otp",
        method: "POST",
        data: body,
      }),
    }),
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: (body) => ({
        url: "/user/forgot-password/reset",
        method: "POST",
        data: body,
      }),
    }),

    updateUserSettings: builder.mutation<
      UpdateUserSettingsResponse,
      UpdateUserSettingsRequest
    >({
      query: (payload) => ({
        url: `/user/settings${
          payload?.userId ? `?userId=${payload.userId}` : ""
        }`,
        method: "PUT",
        data: payload,
      }),
    }),

    getUserProfile: builder.query<any, string>({
      query: (userId) => ({
        url: `/user/profile?userId=${userId}`,
        method: "GET",
      }),
    }),
  }),
});

//   Hooks
export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useLoginMutation,
  useSignupMutation,
  useVerifyUserQuery,
  useLogoutMutation,
  useGetCategoriesQuery,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useUpdateUserSettingsMutation,
  useGetUserProfileQuery,
} = apiSlice;
