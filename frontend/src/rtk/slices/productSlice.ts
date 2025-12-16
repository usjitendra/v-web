import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../api/baseQuery";

// --- Add Product ---
interface AddProductResponse {
  success: boolean;
  message: string;
  data?: { ID: number }; // the new product ID
}

// --- Batch Create ---
interface BatchCreateRequest {
  productIds: number[];
  sellerId: string | null;
}

interface BatchCreateResponse {
  success: boolean;
  message: string;
  data?: { batch_id: number };
}

// --- Generic Batch ---
interface Batch {
  batchId: number;
  batchNumber: number;
  category: string;
  postDate: string;
  inspectionBidDate: string;
  itemsCount: number;
  value: number;
  bids: number;
  status: string;
}

// --- Inspection ---
interface ScheduleSlot {
  time: string;
}

interface Schedule {
  date: string;
  slots: ScheduleSlot[];
}

interface CreateInspectionRequest {
  batch_id: number;
  schedule: Schedule[];
}

interface InspectionData {
  inspection_id: number;
  batch_id: number;
  schedule: Schedule[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateInspectionResponse {
  success: boolean;
  message: string;
  data: InspectionData;
}

// --- Batches By Seller ---
interface BuyerBid {
  buyer_bid_id: number;
  bid_id: number;
  buyer_id: number;
  company_name: string;
  contact_person: string | null;
  country: string | null;
  amount: string;
  submitted_at: string;
  status: string;
  notes: string | null;
}

interface Bid {
  bid_id: number;
  type: string;
  start_date: string;
  end_date: string;
  target_price: string;
  current_price: string;
  location: string | null;
  notes: Record<string, any>;
  language: string;
  status: string;
  buyer_bids: BuyerBid[];
}

interface BatchBySeller {
  batch_id: number;
  post_date: string;
  category: string;
  bids: Bid[];
  highest_bid: number;
  lowest_bid: number;
  total_bids: number;
  change: number;
  time_remaining: string;
}

interface GetBatchesBySellerResponse {
  success: boolean;
  message: string;
  data: {
    total_active_bids: number;
    highest_current_bid: number;
    total_bid_value: number;
    batches: BatchBySeller[];
    seller: {
      id: number;
      name: string;
      email: string;
      phone: string | null;
      company: string;
      country: string | null;
    };
    stats: {
      total_listings: number;
      total_live: number;
      total_sold: number;
    };
  };
}

// --- Company Registration ---
interface CompanyRegistration {
  company_registration_id: number;
  inspection_id: number;
  company_name: string;
  email: string | null;
  phone: string | null;
  selected: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GetCompaniesByBatchResponse {
  success: boolean;
  message: string;
  data: {
    inspection: InspectionData;
    companies: CompanyRegistration[];
  };
}

// Request payload
interface MarkSelectedCompaniesRequest {
  inspection_id: number;
  company_ids: number[];
}

// Response payload
interface MarkSelectedCompaniesResponse {
  success: boolean;
  message: string;
}

// Company Registration for Inspection (Buyer Dashboard) ---
interface CompanyRegistrationRequest {
  batch_id: number;
  buyer_id: number;
  company_name: string;
  date: string;
  slot: string;
}
interface CompanyRegistrationResponse {
  success: boolean;
  message: string;
  data: {
    registration_id: number;
    inspection_id: number;
    buyer_id: number;
    company_name: string;
    date: string;
    slot: string;
    selected: boolean;
    skipped: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

// --- Check Inspection ---
interface CheckInspectionRequest {
  batchId: number;
  buyerId: number;
}

interface CheckInspectionResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface UpdateCompanyRegistrationRequest extends CompanyRegistrationRequest {
  registration_id: number;
}

interface UpdateCompanyRegistrationResponse
  extends CompanyRegistrationResponse {}

export const productApiSlice = createApi({
  reducerPath: "productApi",
  baseQuery: axiosBaseQuery,
  tagTypes: ["Batches", "Products"],
  endpoints: (builder) => ({
    // --- Add Product ---
    addProduct: builder.mutation<AddProductResponse, FormData>({
      query: (formData) => ({
        url: "/product/add-product",
        method: "POST",
        headers: { "x-system-key": "fa39812fec" },
        data: formData,
      }),
    }),

    // --- Batch Create ---
    batchCreate: builder.mutation<BatchCreateResponse, BatchCreateRequest>({
      query: (body) => ({
        url: "/batch/create",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: body,
      }),
    }),

    // --- Fetch All Batches ---
    fetchBatches: builder.query<Batch[], void>({
      query: () => ({
        url: "/batch/fetch",
        method: "GET",
        headers: { "x-system-key": "fa39812fec" },
      }),
      providesTags: ["Batches"],
    }),

    // --- Create Inspection ---
    createInspection: builder.mutation<
      CreateInspectionResponse,
      CreateInspectionRequest
    >({
      query: (body) => ({
        url: "/inspection/create",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: body,
      }),
    }),

    // --- Fetch Batches By Seller ---
    getBatchesBySeller: builder.query<
      GetBatchesBySellerResponse,
      { sellerId: string; page: number }
    >({
      query: ({ sellerId, page }) => ({
        url: `/batch/seller/${sellerId}?page=${page}`,
        method: "GET",
        headers: { "x-system-key": "fa39812fec" },
      }),
      providesTags: ["Batches"],
    }),

    // --- Fetch Companies By Batch ---
    getCompanyRegistrationByBatch: builder.query<
      GetCompaniesByBatchResponse,
      number
    >({
      query: (batchId) => ({
        url: `/inspection/${batchId}/companies`,
        method: "GET",
        headers: { "x-system-key": "fa39812fec" },
      }),
    }),

    // --- Mark Selected Companies ---
    markSelectedCompanies: builder.mutation<
      MarkSelectedCompaniesResponse,
      MarkSelectedCompaniesRequest
    >({
      query: (body) => ({
        url: "/inspection/mark-selected",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-system-key": "fa39812fec",
        },
        data: body,
      }),
    }),

    // --- Register Company for Inspection ---
    registerCompanyForInspection: builder.mutation<
      CompanyRegistrationResponse,
      CompanyRegistrationRequest
    >({
      query: (body) => ({
        url: "/inspection/company/registration",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: body,
      }),
    }),

    updateCompanyRegistration: builder.mutation<
      UpdateCompanyRegistrationResponse,
      UpdateCompanyRegistrationRequest
    >({
      query: (body) => ({
        url: "/inspection/company/registration/update", 
        method: "PUT", 
        headers: { "Content-Type": "application/json" },
        data: body,
      }),
    }),

    // --- Check Inspection ---
    checkInspection: builder.mutation<
      CheckInspectionResponse,
      CheckInspectionRequest
    >({
      query: (body) => ({
        url: "/inspection/check",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: body,
      }),
    }),
  }),
});

export const {
  useAddProductMutation,
  useBatchCreateMutation,
  useFetchBatchesQuery,
  useCreateInspectionMutation,
  useGetBatchesBySellerQuery,
  useGetCompanyRegistrationByBatchQuery,
  useMarkSelectedCompaniesMutation,
  useRegisterCompanyForInspectionMutation,
  useUpdateCompanyRegistrationMutation,
  useCheckInspectionMutation,
} = productApiSlice;
