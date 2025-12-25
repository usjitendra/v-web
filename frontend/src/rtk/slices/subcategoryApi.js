import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../api/baseQuery";

export const subcategoryApi = createApi({
  reducerPath: "subcategoryApi",
  baseQuery: axiosBaseQuery,
  tagTypes: ["Subcategory"],

  endpoints: (builder) => ({

    // Add Subcategory
    addSubcategory: builder.mutation({
      query: (formData) => ({
        url: "subcategory/add",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: ["Subcategory"],
    }),

    // Get Subcategories
    getSubcategories: builder.query({
      query: () => ({
        url: "subcategory/list",
        method: "GET",
      }),
      providesTags: ["Subcategory"],
    }),

    // drop down 

    getDropDown: builder.query({
      query: () => ({
        url: "dropdown/category",
        method: "GET",
      }),
      providesTags: ["Subcategory"],
    }),


    getConteryDropDown: builder.query({
      query: () => ({
        url: "dropdown/country",
        method: "GET",
      }),
      providesTags: ["Subcategory"],
    }),

    // Update Subcategory
    updateSubcategory: builder.mutation({
      query: ({ id, formData }) => ({
        url: `subcategory/${id}`,
        method: "PUT",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: ["Subcategory"],
    }),

    // Delete Subcategory
    deleteSubcategory: builder.mutation({
      query: (id) => ({
        url: `subcategory/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subcategory"],
    }),
  }),
});

export const {
  useAddSubcategoryMutation,
  useGetSubcategoriesQuery,
  useGetDropDownQuery,
  useUpdateSubcategoryMutation,
  useDeleteSubcategoryMutation,
  useGetConteryDropDownQuery
} = subcategoryApi;
