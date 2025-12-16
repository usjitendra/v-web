import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../api/baseQuery";

// ---------- Types ----------
export interface Batch {
  batchId: number;
  batchNumber: number;
  category: string;
  batchDate: string;
  inspectionBidDate: string | null;
  itemsCount: number;
  value: number;
  bids: number;
  status: string;
  bid_start_date: string;
  bid_end_date: string;
}

export interface FetchBatchesResponse {
  success: boolean;
  message: string;
  data: Batch[];
}

export interface ProductMeta {
  meta_id: number;
  post_id: number;
  meta_key: string;
  meta_value: string;
}

export interface ProductCategory {
  object_id: number;
  term_taxonomy_id: number;
  term_order: number;
}

export interface Product {
  product_id: number;
  title: string;
  description: string;
  status: string;
  meta: ProductMeta[];
  attachments: {
    id: number;
    url: string;
    type: string;
  }[];
  categories: {
    term_taxonomy_id: number;
    taxonomy: string;
    term: string;
    term_id: number;
    term_slug: string;
  }[];
}

export interface FetchBatchByIdResponse {
  success: boolean;
  data: Product[];
}

export interface SellerBidResponse {
  success: boolean;
  batches: {
    batch_id: number;
    status: string;
    products: {
      product_id: number;
      title: string;
      description: string;
      images: string[];
    }[];
    bidding?: {
      start_date: string;
      end_date: string;
    };
  }[];
}

// ---------- API Slice ----------
export const batchApiSlice = createApi({
  reducerPath: "batchApi",
  baseQuery: axiosBaseQuery,
  tagTypes: ["Batches", "Dashboard"],

  endpoints: (builder) => ({
    // Get all batches
    getBatches: builder.query<FetchBatchesResponse, void>({
      query: () => ({
        url: "/batch/fetch",
        method: "GET",
      }),
      providesTags: ["Batches"],
    }),

    // Get a single batch by ID
    getBatchById: builder.query<FetchBatchByIdResponse, number>({
      query: (batchId) => ({
        url: `/batch/${batchId}/products`,
        method: "GET",
      }),
      providesTags: (_result, _error, batchId) => [
        { type: "Batches", id: batchId },
      ],
    }),

    skipInspectionForCompany: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (batchId) => ({
        url: `/inspection/company/${batchId}/skip`,
        method: "PUT",
      }),
      invalidatesTags: (_result, _error, batchId) => [
        { type: "Batches", id: batchId },
        "Batches",
      ],
    }),

        skipFullInspectionForCompany: builder.mutation<
      { success: boolean; message: string },
      { batchId: number; inspection: boolean }
    >({
      query: ({ batchId, inspection }) => ({
        url: `/inspection/company/${batchId}/skip?inspection=${inspection}`,
        method: "PUT",
      }),
      invalidatesTags: (_result, _error, { batchId }) => [
        { type: "Batches", id: batchId },
        "Batches",
      ],
    }),

    getSellerBids: builder.query<
      SellerBidResponse,
      { userId: number | string; page: number; limit: number }
    >({
      query: ({ userId, page, limit }) => ({
        url: `/buyer/bid/seller/${userId}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: (_result, _error, params) => [
        { type: "Batches", id: params.userId },
      ],
    }),

    getSellerDashboard: builder.query<any, number>({
      query: (sellerId) => ({
        url: `/dashboard/${sellerId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, sellerId) => [
        { type: "Dashboard", id: sellerId },
      ],
    }),

    getSellerReport: builder.query<
      { success: boolean; message: string; data: any[] },
      {
        page: number;
        limit: number;
        status?: string;
        sellerId?: number | string;
      }
    >({
      query: ({ page, limit, status, sellerId }) => {
        let queryParams = `?page=${page}&limit=${limit}`;
        if (status) queryParams += `&status=${status}`;
        if (sellerId) queryParams += `&sellerId=${sellerId}`;
        return {
          url: `/admin/batches${queryParams}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, _arg) => ["Batches"],
    }),
  }),
});

export const {
  useGetBatchesQuery,
  useGetBatchByIdQuery,
  useSkipInspectionForCompanyMutation,
  useSkipFullInspectionForCompanyMutation,
  useGetSellerDashboardQuery,
  useGetSellerBidsQuery,
  useGetSellerReportQuery
} = batchApiSlice;
