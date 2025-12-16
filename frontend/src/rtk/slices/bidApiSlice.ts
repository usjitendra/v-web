// bidApiSlice.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../api/baseQuery";

// --- Types ---
export interface StartBidRequest {
  batch_id: number;
  type: "make_offer" | "fixed_price";
  start_date: string;
  end_date: string;
  target_price: number;
  location: string;
  notes: {
    required_docs: string;
    inspection_needed: boolean;
  };
  language: string;
}

export interface StartBidResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface BuyerBid {
  buyer_bid_id: number;
  bid_id: number;
  buyer_id: number;
  company_name: string;
  contact_person: string;
  country: string;
  amount: string;
  submitted_at: string;
  status: string;
  notes: string;
}

export interface GetBuyerBidsResponse {
  success: boolean;
  message: string;
  data: {
    batch_id: string;
    bid_id: number;
    buyer_bids: BuyerBid[];
  };
}

// --- Types ---
export interface WinnerData {
  buyer_bid_id: number;
  bid_id: number;
  buyer_id: number;
  company_name: string;
  amount: string;
  status: string;
  submitted_at: string;
}

export interface GetWinnerResponse {
  success: boolean;
  message: string;
  data: WinnerData | null;
}

export interface MarkWinnerResponse {
  success: boolean;
  message: string;
}

// --- Payment Types ---
export interface PaymentRequest {
  buyer_bid_id: number;
  payment_method: string;
  transaction_number: string;
  amount: number;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data?: any;
}

// --- Report Types ---
export interface ReportBidItem {
  buyer_bid_id: number;
  company_name: string;
  amount: string | number;
  status: string;
  submitted_at: string;
  payment_status: string | null;
}

export interface ReportWinningCompany {
  buyer_bid_id: number;
  company_name: string;
  amount: string | number;
  payment_status: string;
  payment_amount: number | null;
}

export interface BatchReport {
  batch_id: number | string;
  inspection_participants: number;
  total_bids_received: number;
  winning_amount: number | null;
  winning_company: ReportWinningCompany | null;
  bids: ReportBidItem[];
}

export interface GetReportResponse {
  success: boolean;
  report: BatchReport;
}

export interface UpdatePickupRequest {
  buyer_bid_id: number;
  pickup_date: string; // ISO date string
  pickup_time: string;
  isDelivery: boolean;
  batchId: string;
}

export interface UpdatePickupResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Place Bid Buyer Portal Interface
export interface PlaceBidRequest {
  batch_id: number;
  buyer_id: number;
  company_name: string;
  contact_person: string;
  country: string;
  amount: number;
  notes: string;
}

export interface PlaceBidResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface CheckBidRequest {
  batch_id: number;
  buyer_id: number;
}

export interface CheckBidResponse {
  success: boolean;
  message: string;
  data?: any;
}





// --- Bid API Slice ---
export const bidApiSlice = createApi({
  reducerPath: "bidApi",
  baseQuery: axiosBaseQuery,
  tagTypes: ["Bids"],
  endpoints: (builder) => ({
    startBid: builder.mutation<StartBidResponse, StartBidRequest>({
      query: (body) => ({
        url: "/bid/create",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: body,
      }),
      invalidatesTags: ["Bids"],
    }),

    getBuyerBids: builder.query<GetBuyerBidsResponse, string>({
      query: (batch_id) => ({
        url: `/buyer/bid/batch/${batch_id}`,
        method: "GET",
      }),
      providesTags: ["Bids"],
    }),

    // Mark Winner of a Batch
    markWinnerForBatch: builder.mutation<
      MarkWinnerResponse,
      { batch_id: number; buyer_bid_id: number }
    >({
      query: ({ batch_id, buyer_bid_id }) => ({
        url: `/buyer/bid/win/${batch_id}/${buyer_bid_id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Bids"],
    }),

    getWinnerForBatch: builder.query<GetWinnerResponse, number>({
      query: (batch_id) => ({
        url: `/buyer/bid/winner/${batch_id}`,
        method: "GET",
      }),
      providesTags: ["Bids"],
    }),

    addPaymentForWinner: builder.mutation<PaymentResponse, PaymentRequest>({
      query: (body) => ({
        url: "/winner/create",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: body,
      }),
      invalidatesTags: ["Bids"],
    }),

    getBatchReport: builder.query<GetReportResponse, number | string>({
      query: (batch_id) => ({
        url: `/report/${batch_id}`,
        method: "GET",
      }),
      providesTags: ["Bids"],
    }),

    updatePickupForWinner: builder.mutation<
      UpdatePickupResponse,
      UpdatePickupRequest
    >({
      query: ({
        buyer_bid_id,
        pickup_date,
        pickup_time,
        isDelivery,
        batchId,
      }) => ({
        url: `/winner/${buyer_bid_id}/pickup`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: { pickup_date, pickup_time, isDelivery, batchId },
      }),
      invalidatesTags: ["Bids"],
    }),

    placeBid: builder.mutation<PlaceBidResponse, PlaceBidRequest>({
      query: (body) => ({
        url: `/buyer/bid/place`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: body,
      }),
      invalidatesTags: ["Bids"],
    }),

    checkBidStatus: builder.mutation<CheckBidResponse, CheckBidRequest>({
      query: (body) => ({
        url: `/buyer/bid/check`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: body,
      }),
      invalidatesTags: ["Bids"],
    }),

getBatchExcel: builder.query<Blob, string>({
  query: (batchId) => ({
    url: `/reports/batch/${batchId}/excel`,
    method: "GET",
    responseType: "blob", // important
  }),
}),

  }),
});

export const {
  useStartBidMutation,
  useGetBuyerBidsQuery,
  useMarkWinnerForBatchMutation,
  useGetWinnerForBatchQuery,
  useAddPaymentForWinnerMutation,
  useGetBatchReportQuery,
  useUpdatePickupForWinnerMutation,
  usePlaceBidMutation,
  useCheckBidStatusMutation,
  useLazyGetBatchExcelQuery

} = bidApiSlice;
