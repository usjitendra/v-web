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

    // UPDATE FULL BOOKING DETAILS
    updateBooking: builder.mutation({
      query: ({ id, ...bookingData }) => ({
        url: `booking/${id}`,
        method: "PUT",
        data: bookingData,
      }),
      invalidatesTags: ["Booking"],
    }),

    // UPDATE BOOKING STATUS (ADMIN)
    updateBookingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `booking/${id}/status`,
        method: "PUT",
        data: { status },
      }),
      invalidatesTags: ["Booking"],
    }),

    // CANCEL BOOKING
    cancelBooking: builder.mutation({
      query: ({ id, reason }) => ({
        url: `booking/${id}/cancel`,
        method: "PUT",
        data: { reason },
      }),
      invalidatesTags: ["Booking"],
    }),

    // RESCHEDULE BOOKING
    rescheduleBooking: builder.mutation({
      query: ({ id, date, time, reason }) => ({
        url: `booking/${id}/reschedule`,
        method: "PUT",
        data: { date, time, reason },
      }),
      invalidatesTags: ["Booking"],
    }),

    // GET BOOKINGS BY PATIENT
    getBookingsByPatient: builder.query({
      query: ({ patientId, ...params }) => ({
        url: `booking/patient/${patientId}`,
        method: "GET",
        params,
      }),
      providesTags: ["Booking"],
    }),

    // GET BOOKINGS BY DOCTOR
    getBookingsByDoctor: builder.query({
      query: ({ doctorId, ...params }) => ({
        url: `booking/doctor/${doctorId}`,
        method: "GET",
        params,
      }),
      providesTags: ["Booking"],
    }),

    // GET BOOKINGS BY HOSPITAL
    getBookingsByHospital: builder.query({
      query: ({ hospitalId, ...params }) => ({
        url: `booking/hospital/${hospitalId}`,
        method: "GET",
        params,
      }),
      providesTags: ["Booking"],
    }),

    // CHECK DOCTOR AVAILABILITY
    checkDoctorAvailability: builder.query({
      query: ({ doctorId, date, time }) => ({
        url: `booking/doctor/${doctorId}/availability/${date}`,
        method: "GET",
        params: time ? { time } : {},
      }),
      providesTags: ["Booking"],
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
  useUpdateBookingMutation,
  useUpdateBookingStatusMutation,
  useCancelBookingMutation,
  useRescheduleBookingMutation,
  useGetBookingsByPatientQuery,
  useGetBookingsByDoctorQuery,
  useGetBookingsByHospitalQuery,
  useCheckDoctorAvailabilityQuery,
  useDeleteBookingMutation,
  useGetBookingStatsQuery,
} = bookingApi;
