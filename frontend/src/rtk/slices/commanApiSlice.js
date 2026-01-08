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

    // LANGUAGE LIST
    getLanguageList: builder.query({
      query: () => ({
        url: "language/list",
        method: "GET",
      }),
      providesTags: ["Comman"],
    }),

    // CATEGORY LIST
    getCategoryList: builder.query({
      query: () => ({
        url: "category/list",
        method: "GET",
      }),
      providesTags: ["Comman"],
    }),

    // SUBCATEGORY LIST
    getSubCategoryList: builder.query({
      query: () => ({
        url: "subcategory/list",
        method: "GET",
      }),
      providesTags: ["Comman"],
    }),

    // DOCTOR LIST (OLD)
    getDoctorList: builder.query({
      query: () => ({
        url: "doctor/list",
        method: "GET",
      }),
      providesTags: ["Comman"],
    }),

    // HOSPITAL LIST (OLD)
    getHospitalList: builder.query({
      query: () => ({
        url: "hospital/list",
        method: "GET",
      }),
      providesTags: ["Comman"],
    }),


    getAllDoctors: builder.query({
      query: ({
        city,
        state,
        country,
        category,
        page = 1,
        limit = 10,
      }) => ({
        url: "doctor/get-all",
        method: "GET",
        params: {
          city,
          state,
          country,
          category,
          page,
          limit,
        },
      }),
      providesTags: ["Comman"],
    }),


    // DOCTOR DETAIL
    getDoctorsDetail: builder.query({
      query: ({ slug }) => ({
        url: `doctor/get-by-slug/${slug}`,
        method: "GET",
      }),
      providesTags: ["Comman"],
    }),
    // HOSPITAL GET ALL (WITH FILTERS)
    getAllHospitals: builder.query({
      query: ({
        city,
        state,
        country,
        category,
        page = 1,
        limit = 10,
      }) => ({
        url: "hospital/get-all",
        method: "GET",
        params: {
          city,
          state,
          country,
          category,
          page,
          limit,
        },
      }),
      providesTags: ["Comman"],
    }),


    getHospitalDetail: builder.query({
      query: ({ slug }) => ({
        url: `hospital/get-by-slug/${slug}`,
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
  useGetAllDoctorsQuery,
  useGetAllHospitalsQuery,
  useGetDoctorsDetailQuery,
  useGetHospitalDetailQuery
} = commanApiSlice;
