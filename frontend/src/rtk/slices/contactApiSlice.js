import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../api/baseQuery";

export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery: axiosBaseQuery,
  tagTypes: ["Contact"],

  endpoints: (builder) => ({
    // CREATE CONTACT/QUOTE/INQUIRY
    createContact: builder.mutation({
      query: (contactData) => ({
        url: "contact",
        method: "POST",
        data: contactData,
      }),
      invalidatesTags: ["Contact"],
    }),

    // GET ALL CONTACTS (ADMIN)
    getContacts: builder.query({
      query: (params) => ({
        url: "contact",
        method: "GET",
        params,
      }),
      providesTags: ["Contact"],
    }),

    // GET CONTACT BY ID (ADMIN)
    getContactById: builder.query({
      query: (id) => ({
        url: `contact/${id}`,
        method: "GET",
      }),
      providesTags: ["Contact"],
    }),

    // UPDATE CONTACT STATUS (ADMIN)
    updateContactStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `contact/${id}/status`,
        method: "PUT",
        data: { status },
      }),
      invalidatesTags: ["Contact"],
    }),

    // REPLY TO CONTACT (ADMIN)
    replyToContact: builder.mutation({
      query: ({ id, message, adminId }) => ({
        url: `contact/${id}/reply`,
        method: "PUT",
        data: { message, adminId },
      }),
      invalidatesTags: ["Contact"],
    }),

    // DELETE CONTACT (ADMIN)
    deleteContact: builder.mutation({
      query: (id) => ({
        url: `contact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contact"],
    }),

    // GET CONTACT STATISTICS (ADMIN)
    getContactStats: builder.query({
      query: () => ({
        url: "contact/stats",
        method: "GET",
      }),
      providesTags: ["Contact"],
    }),
  }),
});

export const {
  useCreateContactMutation,
  useGetContactsQuery,
  useGetContactByIdQuery,
  useUpdateContactStatusMutation,
  useReplyToContactMutation,
  useDeleteContactMutation,
  useGetContactStatsQuery,
} = contactApi;
