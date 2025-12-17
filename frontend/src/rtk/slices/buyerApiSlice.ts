// src/rtk/slices/buyerApiSlice.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../api/baseQuery";

/* ========================= DASHBOARD ========================= */

export interface BuyerDashboardResponse {
    success: boolean;
    data: {
        buyer_id: string;
        total_inspections_registered: number;
        completed_inspections: number;
        total_bids_placed: number;
        total_won_bids: number;
    };
}

/* ========================= BIDS LIST ========================= */

export interface BidProduct {
    title: string;
    images: string[];
    category: string;
}

export interface BuyerBidItem {
    batch_id: number;
    products: BidProduct[];
    bid_amount: string;
    bid_date: string;
    end_date: string;
    batch_step: number;
    status: string;
}

export interface BuyerBidListResponse {
    success: boolean;
    data: {
        data: BuyerBidItem[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
}

/* ========================= INSPECTION LIST ========================= */

export interface InspectionProduct {
    title: string;
    images: string[];
    category: string;
}

export interface InspectionItem {
    batch_id: number;
    inspection_number: string;
    inspection_date: string;
    registered_date: string;
    status: string;
    products: InspectionProduct[];
}

export interface BuyerInspectionResponse {
    success: boolean;
    data: {
        data: InspectionItem[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
}

/* ========================= BUYER FULL DETAILS ========================= */

export interface BuyerDetails {
    id: number;
    name: string;
    email: string;
    phone: string;
    company: string;
    country: string;
}

export interface BuyerStats {
    total_bids: number;
    accepted_bids: number;
    rejected_bids: number;
    total_amount_bid: number;
    total_wins: number;
    total_paid: number;
}

export interface BuyerFullDetailsResponse {
    success: boolean;
    message: string;
    data: {
        buyer: BuyerDetails[];
        stats: BuyerStats[];
    };
}

/* ========================= PAYMENT ========================= */

export interface PaymentDetailsRequest {
    buyer_id: number;
    batch_id: number;
    transaction_number: string;
    payment_method: string;
}

export interface PaymentDetailsResponse {
    success: boolean;
    message: string;
    data: {
        payment_id: number;
        payment_method: string;
        transaction_number: string;
        updatedAt: string;
        createdAt: string;
    };
}

/* ========================= BUYER BATCH SUMMARY ========================= */

export interface BatchDetails {
    batch_id: number;
    batch_number: number;
    status: string;
    step: number;
    product_ids: number[];
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
    Bidding: {
        bid_id: number;
        batch_id: number;
        type: string;
        start_date: string;
        end_date: string;
        target_price: string;
        current_price: string;
        location: string;
        notes: {
            required_docs: string;
            inspection_needed: boolean;
        };
        language: string;
        status: string;
        currency: string;
        createdAt: string;
        updatedAt: string;
    };
}

export interface BuyerPaymentDetails {
    payment_id: number;
    batch_id: number;
    buyer_id: number;
    payment_method: string;
    transaction_number: string;
    account_holder_name: string | null;
    bank_name: string | null;
    account_number: string | null;
    ifsc_code: string | null;
    branch_name: string | null;
    createdAt: string;
    updatedAt: string;
}

/* === FIXED INSPECTION ATTENDANCE (based on your actual API response) === */

export interface InspectionAttendanceSlot {
    time: string;
}

export interface InspectionSchedule {
    date: string;
    slots: InspectionAttendanceSlot[];
}

export interface InspectionRegistration {
    registration_id: number;
    date: string;
    slot: string;
    selected: boolean;
    skipped: boolean;
    company_name: string;
}

export interface InspectionAttendance {
    inspection_id: number;
    schedule: InspectionSchedule[];
    registration: InspectionRegistration;
}

export interface BuyerBatchSummaryData {
    batch: BatchDetails;
    buyer_bids: BuyerBid[];
    buyer_payment_details: BuyerPaymentDetails | null;
    inspection_attendance: InspectionAttendance; // FIXED from array → object
}

export interface BuyerBatchSummaryResponse {
    success: boolean;
    message: string;
    data: BuyerBatchSummaryData;
}

/* ========================= API SLICE ========================= */

export const buyerApi = createApi({
    reducerPath: "buyerApi",
    baseQuery: axiosBaseQuery,
    tagTypes: ["BuyerDashboard", "BuyerBids", "BuyerInspections", "BuyerDetails"],

    endpoints: (builder) => ({

        /* --- DASHBOARD --- */
        getBuyerDashboard: builder.query<BuyerDashboardResponse, number>({
            query: (buyerId) => ({
                url: `/buyer/dashboard/${buyerId}`,
                method: "GET",
            }),
            providesTags: ["BuyerDashboard"],
        }),

        /* --- BUYER BIDS LIST --- */
        getBuyerBids: builder.query<
            BuyerBidListResponse,
            {
                buyerId: number;
                page: number;
                limit: number;
                status?: string;
                category?: string;
                search?: string;
                minAmount?: string;
                maxAmount?: string;
                dateFrom?: string;
                dateTo?: string;
            }
        >({
            query: ({ buyerId, page, limit, status, category, search, minAmount, maxAmount, dateFrom, dateTo }) => {
                const params = new URLSearchParams({
                    page: String(page),
                    limit: String(limit),
                });

                if (status) params.append("status", status);
                if (category) params.append("category", category);
                if (search) params.append("search", search);
                if (minAmount) params.append("min_amount", minAmount);
                if (maxAmount) params.append("max_amount", maxAmount);
                if (dateFrom) params.append("date_from", dateFrom);
                if (dateTo) params.append("date_to", dateTo);

                return {
                    url: `/buyer/bid/buyer/${buyerId}?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["BuyerBids"],
        }),

        /* --- SELLER BIDS --- */
        getSellerBids: builder.query<BuyerBidListResponse, number>({
            query: (sellerId) => ({
                url: `/seller/bids/${sellerId}`,
                method: "GET",
            }),
            providesTags: ["BuyerBids"],
        }),

        /* --- INSPECTIONS LIST --- */
        getBuyerInspections: builder.query<
            BuyerInspectionResponse,
            { buyerId: number; page: number; limit: number; status?: string; search?: string }
        >({
            query: ({ buyerId, page, limit, status, search }) => {
                const params = new URLSearchParams({
                    page: String(page),
                    limit: String(limit),
                });

                if (status) params.append("status", status);
                if (search) params.append("search", search);

                return {
                    url: `/inspection/buyer/${buyerId}?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["BuyerInspections"],
        }),

        /* --- BUYER FULL DETAILS --- */
        getBuyerFullDetails: builder.query<BuyerFullDetailsResponse, string | number>({
            query: (id) => ({
                url: `/admin/buyer/${id}/full-details`,
                method: "GET",
            }),
            providesTags: ["BuyerDetails"],
        }),

        /* --- PAYMENT --- */
        completePaymentDetails: builder.mutation<PaymentDetailsResponse, PaymentDetailsRequest>({
            query: (paymentDetails) => ({
                url: `/buyer/payment`,
                method: "POST",
                data: paymentDetails,
            }),
        }),

        /* --- BATCH SUMMARY --- */
        getBuyerBatchSummary: builder.query<
            BuyerBatchSummaryResponse,
            { batch_id: number; buyer_id: number }
        >({
            query: ({ batch_id, buyer_id }) => ({
                url: `/buyer/details?batch_id=${batch_id}&buyer_id=${buyer_id}`,
                method: "GET",
            }),
            providesTags: ["BuyerDetails"],
        }),
    }),
});

export const {
    useGetBuyerDashboardQuery,
    useGetBuyerBidsQuery,
    useGetSellerBidsQuery,
    useGetBuyerInspectionsQuery,
    useGetBuyerFullDetailsQuery,
    useCompletePaymentDetailsMutation,
    useGetBuyerBatchSummaryQuery
} = buyerApi;
