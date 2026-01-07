import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../api/baseQuery";

export const dropdownApi = createApi({
  reducerPath: "dropdownApi",
  baseQuery: axiosBaseQuery,
  tagTypes: ["Dropdown"],

  endpoints: (builder) => ({

    getCountryCategoryDropdown: builder.query({
      query: () => ({
        url: "dropdown/counter-category",
        method: "GET",
      }),
      providesTags: ["Dropdown"],
    }),

    getLanguageDropdown: builder.query({
      query: () => ({
        url: "dropdown/language",
        method: "GET",
      }),
      providesTags: ["Dropdown"],
    }),
  }),
});

export const {
  useGetCountryCategoryDropdownQuery,
  useGetLanguageDropdownQuery
} = dropdownApi;
