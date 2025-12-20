// src/rtk/slices/adminApiSlice.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../api/baseQuery";

/* ---------- SELLER TYPES ---------- */
export interface SellerItem {
  seller_id: number;
  company_name: string;
  email: string;
  phone: string | null;
  total_listings: number;
  total_sold: number;
  total_live: number;
  total_inactive: number;
  total_sales: number;
  total_sales_amount: string;
  currency: string;
}

export interface SellerStats {
  total_sellers: number;
  new_this_month: number;
  total_listings: number;
}

export interface SellerResponse {
  success: boolean;
  message: string;
  stats: SellerStats;
  data: SellerItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/* ---------- BUYER TYPES ---------- */
export interface BuyerItem {
  buyer_id: number;
  company_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  total_bids: number;
  pending_bids: number;
  accepted_bids: number;
  rejected_bids: number;
  total_purchases: number;
  total_amount_purchases: string;
  currency: string;
}

export interface BuyerStats {
  total_buyers: number;
  new_this_month: number;
  total_purchases: number;
}

export interface BuyerResponse {
  success: boolean;
  message: string;
  stats: BuyerStats;
  data: BuyerItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/* ---------- BATCH TYPES ---------- */

export interface BatchProduct {
  title: string;
  images: string[];
  category: string;
}

export interface BatchSellerMeta {
  role: string;
  company: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  company_name: string;
  member_id: string;
}

export interface BatchSeller {
  ID: number;
  user_login: string;
  user_email: string;
  user_nicename: string;
  display_name: string;
  meta: BatchSellerMeta;
}

export interface BatchBid {
  bid_id: number;
  currency: string;
  end_date: string;
  start_date: string;
  status: string;
  target_price: string;
  type: string;
}

export interface BatchItem {
  batch_id: number;
  batch_number: number;
  seller_id: number;
  seller: BatchSeller;
  status: string;
  step: number;
  products: BatchProduct[];
  total_products: number;
  bid: BatchBid | null;
  total_bids: number;
}

export interface BatchStats {
  total_listings: number;
  sold: number;
  published: number;
  live_for_bids: number;
  inspection_schedule: number;
}

export interface AdminBatchResponse {
  success: boolean;
  message: string;
  stats: BatchStats;
  data: BatchItem[];
  pagination: {
    total_batches: number;
    total_pages: number;
    current_page: number;
    limit: number;
  };
}

export interface DeleteBatchResponse {
  success: boolean;
  message: string;
}

/* ---------- BATCH DETAILS TYPES ---------- */

export interface BatchDetailsBatch {
  batch_id: number;
  status: string;
  seller_id: number;
  product_ids: number[];
}

export interface BatchDetailsSeller {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  country: string | null;
}

export interface BatchDetailsProductImage {
  url: string;
  type: string;
}

export interface BatchDetailsProduct {
  product_id: number;
  title: string;
  description: string;
  images: BatchDetailsProductImage[];
  category: string;
}

export interface InspectionScheduleSlot {
  time: string;
}

export interface InspectionSchedule {
  date: string;
  slots: InspectionScheduleSlot[];
}

export interface InspectionRegistrationBuyer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
}

export interface InspectionRegistration {
  registration_id: number;
  company_name: string;
  date: string;
  slot: string;
  selected: boolean;
  skipped: boolean;
  buyer: InspectionRegistrationBuyer;
}

export interface BatchDetailsInspection {
  schedule: InspectionSchedule[];
  inspectionRegistration: InspectionRegistration[];
}

export interface BuyerBidBuyer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
}

export interface BuyerBidPayment {
  amount: string;
  status: string;
}

export interface BuyerBid {
  amount: string;
  status: string;
  submitted_at: string;
  notes: string;
  buyer: BuyerBidBuyer;
  payment: BuyerBidPayment | null;
}

export interface BatchDetailsBidding {
  type: string;
  start_date: string;
  end_date: string;
  current_price: string;
  target_price: string;
  location: string;
  status: string;
  currency: string;
  buyer_bids: BuyerBid[];
  total_biddings: number;
}

export interface WinnerBuyer {
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
}

export interface BatchDetailsWinner {
  amount: string;
  buyer: WinnerBuyer;
  payment_status: string;
}

export interface PaymentDetailBuyer {
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
}

export interface PaymentDetail {
  amount: string;
  payment_method: string;
  transaction_number: string;
  paid_at: string;
  pickup_date: string | null;
  pickup_time: string | null;
  is_delivery: boolean;
  buyer: PaymentDetailBuyer;
  payment_status: string;
}

export interface BatchDetailsData {
  batch: BatchDetailsBatch;
  seller: BatchDetailsSeller;
  products: BatchDetailsProduct[];
  products_total: number;
  inspection: BatchDetailsInspection;
  bidding: BatchDetailsBidding;
  winners: BatchDetailsWinner;
  total_biddings: number;
  paymentDetail: PaymentDetail | null;
}

export interface BatchDetailsResponse {
  success: boolean;
  message: string;
  data: BatchDetailsData;
}

/* ---------------- EMAIL SEND TYPES ---------------- */
/* ---------------- EMAIL SEND TYPES ---------------- */
export interface EmailTypeItem {
  id: number;
  type_name: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  users?: EmailUserItem[];
  subjects?: EmailSubjectItem[];
  messages?: EmailMessageItem[];
}

export interface EmailUserItem {
  id: number;
  email: string;
  is_active: boolean;
  type_id: number;
  createdAt: string;
  updatedAt: string;
  messages?: EmailMessageItem[];
}

export interface EmailMessageItem {
  id: number;
  subject: string;
  body: string;
  is_active: boolean;
  user_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmailSubjectItem {
  id: number;
  subject: string;
  is_active: boolean;
  type_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmailTypeResponse {
  success: boolean;
  message: string;
  data: EmailTypeItem[];
}

export interface EmailUserResponse {
  success: boolean;
  message: string;
  data: EmailUserItem[];
}

export interface EmailMessageResponse {
  success: boolean;
  message: string;
  data: EmailMessageItem[];
}

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: axiosBaseQuery,
  tagTypes: [
    "Sellers",
    "Buyers",
    "Batches",
    "EmailTypes",
    "EmailUsers",
    "EmailMessages",
  ],

  endpoints: (builder) => ({
    /* ---------------- GET SELLERS ---------------- */
    getSellers: builder.query<
      SellerResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        return {
          url: `/admin/seller?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Sellers"],
    }),

    /* ---------------- GET BUYERS ---------------- */
    getBuyers: builder.query<BuyerResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        return {
          url: `/admin/buyer?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Buyers"],
    }),

    /* ---------------- GET ADMIN BATCHES ---------------- */
    getAdminBatches: builder.query<
      AdminBatchResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        return {
          url: `/admin/batches?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Batches"],
    }),

    /* ---------------- DELETE BATCH ---------------- */
    deleteBatch: builder.mutation<DeleteBatchResponse, number>({
      query: (batchId) => ({
        url: `/admin/batches/${batchId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Batches"],
    }),

    /* ---------------- GET BATCH DETAILS ---------------- */
    getBatchDetails: builder.query<BatchDetailsResponse, number>({
      query: (batchId) => ({
        url: `/admin/batch/${batchId}/details`,
        method: "GET",
      }),
      providesTags: (_result, _error, batchId) => [
        { type: "Batches", id: batchId },
      ],
    }),

    /* ---------------- EMAIL ENDPOINTS ---------------- */
    getEmailTypes: builder.query<EmailTypeResponse, void>({
      query: () => ({ url: `/email/types`, method: "GET" }),
      providesTags: ["EmailTypes"],
    }),

    createEmailType: builder.mutation<
      EmailTypeItem,
      { type_name: string; is_active?: boolean }
    >({
      query: (body) => ({ url: `/email/types`, method: "POST", data: body }),
      invalidatesTags: ["EmailTypes"],
    }),

    updateEmailType: builder.mutation<
      EmailTypeItem,
      { id: number; data: Partial<EmailTypeItem> }
    >({
      query: ({ id, data }) => ({
        url: `/email/types/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["EmailTypes"],
    }),

    deleteEmailType: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({ url: `/email/types/${id}`, method: "DELETE" }),
      invalidatesTags: ["EmailTypes"],
    }),

    /* ---------- EMAIL USERS ---------- */
    getEmailUsers: builder.query<EmailUserResponse, number>({
      query: (typeId) => ({
        url: `/email/types/${typeId}/users`,
        method: "GET",
      }),
      providesTags: ["EmailUsers"],
    }),

    createEmailUser: builder.mutation<
      EmailUserItem,
      { typeId: number; email: string; is_active?: boolean }
    >({
      query: ({ typeId, ...body }) => ({
        url: `/email/types/${typeId}/users`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["EmailUsers"],
    }),

    updateEmailUser: builder.mutation<
      EmailUserItem,
      { userId: number; data: Partial<EmailUserItem> }
    >({
      query: ({ userId, data }) => ({
        url: `/email/users/${userId}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["EmailUsers"],
    }),

    deleteEmailUser: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (userId) => ({ url: `/email/users/${userId}`, method: "DELETE" }),
      invalidatesTags: ["EmailUsers"],
    }),

    /* ---------- EMAIL MESSAGES ---------- */
    getEmailMessages: builder.query<EmailMessageResponse, number>({
      query: (userId) => ({
        url: `/email/users/${userId}/messages`,
        method: "GET",
      }),
      providesTags: ["EmailMessages"],
    }),

    createEmailMessage: builder.mutation<
      EmailMessageItem,
      { userId: number; subject: string; body: string; is_active?: boolean }
    >({
      query: ({ userId, ...body }) => ({
        url: `/email/users/${userId}/messages`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["EmailMessages"],
    }),

    updateEmailMessage: builder.mutation<
      EmailMessageItem,
      { msgId: number; data: Partial<EmailMessageItem> }
    >({
      query: ({ msgId, data }) => ({
        url: `/email/messages/${msgId}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["EmailMessages"],
    }),

    deleteEmailMessage: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (msgId) => ({ url: `/email/messages/${msgId}`, method: "DELETE" }),
      invalidatesTags: ["EmailMessages"],
    }),
  }),
});

export const {
  useGetSellersQuery,
  useGetBuyersQuery,
  useGetAdminBatchesQuery,
  useDeleteBatchMutation,
  useGetBatchDetailsQuery,

  useGetEmailTypesQuery,
  useCreateEmailTypeMutation,
  useUpdateEmailTypeMutation,
  useDeleteEmailTypeMutation,

  /* ---------- EMAIL USERS ---------- */
  useGetEmailUsersQuery,
  useCreateEmailUserMutation,
  useUpdateEmailUserMutation,
  useDeleteEmailUserMutation,

  /* ---------- EMAIL MESSAGES ---------- */
  useGetEmailMessagesQuery,
  useCreateEmailMessageMutation,
  useUpdateEmailMessageMutation,
  useDeleteEmailMessageMutation,
} = adminApi;
