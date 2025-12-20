import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../api/baseQuery";


export const apiMaster = createApi({
  reducerPath: "apiMaster",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    // -------- User / Auth --------
    getLaungae: builder.query({
      query: () => ({ url: "/user/all-user" }),
    }),


    addCountery: builder.mutation({
      query: (payload) => ({
        url: "country/add",
        method: "POST",
        data: payload,
      }),
    }),
  }),
});

// -------------------- Hooks --------------------
export const { useAddCounteryMutation, useGetLaungaeQuery } =
  apiMaster;
