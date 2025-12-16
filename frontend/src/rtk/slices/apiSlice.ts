import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../api/baseQuery";

// -------------------- Helpers --------------------
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

const getTokens = () => {
  const accessToken = localStorage.getItem("accessToken") || "";
  const refreshToken = localStorage.getItem("refreshToken") || "";
  return { accessToken, refreshToken };
};

// -------------------- API Slice --------------------
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    // -------- User / Auth --------
    getUsers: builder.query({
      query: () => ({ url: "/user/all-user" }),
    }),

    getUserById: builder.query({
      query: (id) => ({ url: `/users/${id}` }),
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "user/login",
        method: "POST",
        data: credentials,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
    }),
  }),
});

// -------------------- Hooks --------------------
export const { useGetUsersQuery, useGetUserByIdQuery, useLoginMutation } =
  apiSlice;
