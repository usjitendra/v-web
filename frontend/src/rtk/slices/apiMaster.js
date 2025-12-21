import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../api/baseQuery";

export const apiMaster = createApi({
  reducerPath: "apiMaster",
  baseQuery: axiosBaseQuery,

  // IMPORTANT
  tagTypes: ["Country", "Language"],

  endpoints: (builder) => ({
    // -------- User --------
    getLaungae: builder.query({
      query: () => ({ url: "/user/all-user" }),
    }),

    // ================= COUNTRY =================

    addCountery: builder.mutation({
      query: (payload) => ({
        url: "country/add",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Country"],
    }),

    getCountries: builder.query({
      query: () => ({
        url: "country/list",
        method: "GET",
      }),
      providesTags: ["Country"],
    }),

    getCountryById: builder.query({
      query: (id) => ({
        url: `country/${id}`,
        method: "GET",
      }),
    }),

    updateCountry: builder.mutation({
      query: ({ id, payload }) => ({
        url: `country/${id}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: ["Country"],
    }),

    deleteCountry: builder.mutation({
      query: (id) => ({
        url: `country/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Country"],
    }),

    // ================= LANGUAGE =================

    addLanguage: builder.mutation({
      query: (payload) => ({
        url: "language/add",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Language"],
    }),

    getLanguages: builder.query({
      query: () => ({
        url: "language/list",
        method: "GET",
      }),
      providesTags: ["Language"],
    }),

    getLanguageById: builder.query({
      query: (id) => ({
        url: `language/${id}`,
        method: "GET",
      }),
    }),

    updateLanguage: builder.mutation({
      query: ({ id, payload }) => ({
        url: `language/${id}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: ["Language"],
    }),

    deleteLanguage: builder.mutation({
      query: (id) => ({
        url: `language/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Language"],
    }),
  }),
});

// -------------------- Hooks --------------------
export const {
  // Country
  useAddCounteryMutation,
  useGetCountriesQuery,
  useGetCountryByIdQuery,
  useUpdateCountryMutation,
  useDeleteCountryMutation,

  // Language
  useAddLanguageMutation,
  useGetLanguagesQuery,
  useGetLanguageByIdQuery,
  useUpdateLanguageMutation,
  useDeleteLanguageMutation,

  // User
  useGetLaungaeQuery,
} = apiMaster;
