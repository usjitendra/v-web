import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../api/baseQuery";

export const doctorApi = createApi({
  reducerPath: "doctorApi",
  baseQuery: axiosBaseQuery,
  tagTypes: ["Doctor"],

  endpoints: (builder) => ({
    //  ADD DOCTOR
    addDoctor: builder.mutation({
      query: (formData) => ({
        url: "doctor/add",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["Doctor"],
    }),
    getDoctors: builder.query({
      query: (params) => ({
        url: "doctor/list",
        method: "GET",
        params,
      }),
      providesTags: ["Doctor"],
    }),

    //  GET SINGLE DOCTOR
    getDoctorById: builder.query({
      query: (id) => ({
        url: `doctor/${id}`,
        method: "GET",
      }),
      providesTags: ["Doctor"],
    }),

    //  UPDATE DOCTOR
    updateDoctor: builder.mutation({
      query: ({ id, formData }) => ({
        url: `doctor/update/${id}`,
        method: "PUT",
        data: formData,
      }),
      invalidatesTags: ["Doctor"],
    }),

    //  DELETE DOCTOR
    deleteDoctor: builder.mutation({
      query: (id) => ({
        url: `doctor/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Doctor"],
    }),
  }),
});

export const {
  useAddDoctorMutation,
  useGetDoctorsQuery,
  useGetDoctorByIdQuery,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} = doctorApi;

