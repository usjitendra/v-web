// rtk/slices/categoryApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../api/baseQuery";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: axiosBaseQuery,
  tagTypes: ["Category"],

  endpoints: (builder) => ({
    // Add Category
    addCategory: builder.mutation({
      query: (formData) => ({
        url: "category/add",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: ["Category"],
    }),

    // Get Categories
    getCategories: builder.query({
      query: () => ({
        url: "category/list",
        method: "GET",
      }),
      providesTags: ["Category"],
    }),

    // Update Category
    updateCategory: builder.mutation({
      query: ({ id, formData }) => ({
        url: `category/${id}`,
        method: "PUT",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: ["Category"],
    }),

    // Delete Category
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useAddCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
