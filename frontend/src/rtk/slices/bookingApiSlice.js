import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../api/baseQuery";

export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: axiosBaseQuery,
  tagTypes: ["Booking"],

  endpoints: (builder) => ({
    // CREATE BOOKING (APPOINTMENT OR QUERY)
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: "booking",
        method: "POST",
        data: bookingData,
      }),
      invalidatesTags: ["Booking"],
    }),

    // GET ALL BOOKINGS (ADMIN)
    getBookings: builder.query({
      query: (params) => ({
        url: "booking",
        method: "GET",
        params,
      }),
      providesTags: ["Booking"],
    }),

    // GET BOOKING BY ID (ADMIN)
    getBookingById: builder.query({
      query: (id) => ({
        url: `booking/${id}`,
        method: "GET",
      }),
      providesTags: ["Booking"],
    }),

    // UPDATE BOOKING STATUS (ADMIN)
    updateBookingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `booking/${id}`,
        method: "PUT",
        data: { status },
      }),
      invalidatesTags: ["Booking"],
    }),

    // DELETE BOOKING (ADMIN)
    deleteBooking: builder.mutation({
      query: (id) => ({
        url: `booking/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Booking"],
    }),

    // GET BOOKING STATISTICS (ADMIN)
    getBookingStats: builder.query({
      query: () => ({
        url: "booking/stats",
        method: "GET",
      }),
      providesTags: ["Booking"],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useUpdateBookingStatusMutation,
  useDeleteBookingMutation,
  useGetBookingStatsQuery,
} = bookingApi;
