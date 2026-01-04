import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../api/baseQuery";

export const commanApiSlice = createApi({
  reducerPath: "commanApi",
  baseQuery: axiosBaseQuery,
  tagTypes: ["Comman"],

  endpoints: (builder) => ({

    // COUNTRY LIST
    getCountryList: builder.query({
      query: () => ({
        url: "country/list",
        method: "GET",
      }),
      providesTags: ["Comman"],
    }),

    //  LANGUAGE LIST
    getLanguageList: builder.query({
      query: () => ({
        url: "language/list",
        method: "GET",
      }),
      providesTags: ["Comman"],
    }),

    //  CATEGORY LIST
    getCategoryList: builder.query({
      query: () => ({
        url: "category/list",
        method: "GET",
      }),
      providesTags: ["Comman"],
    }),

    //  SUBCATEGORY LIST
    getSubCategoryList: builder.query({
      query: () => ({
        url: "subcategory/list",
        method: "GET",
      }),
      providesTags: ["Comman"],
    }),

    // DOCTOR LIST
    getDoctorList: builder.query({
      query: () => ({
        url: "doctor/list",
        method: "GET",
      }),
      providesTags: ["Comman"],
    }),

    // HOSPITAL LIST
    getHospitalList: builder.query({
      query: () => ({
        url: "hospital/list",
        method: "GET",
      }),
      providesTags: ["Comman"],
    }),

  }),
});

export const {
  useGetCountryListQuery,
  useGetLanguageListQuery,
  useGetCategoryListQuery,
  useGetSubCategoryListQuery,
  useGetDoctorListQuery,
  useGetHospitalListQuery,
} = commanApiSlice;
