// src/rtk/slices/adminStatsApiSlice.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../api/baseQuery";

// Dashboard Stats Interface
export interface AdmindashboardStatsResponse {
  success: boolean;
  message: string;
  data: {
    newSellers: number;
    newBuyers: number;
    inspectionsScheduled: number;
    transactionsCompleted: number;
  };
}

// Monthly Stats Interface
export interface MonthlyCurrencyData {
  transaction_count: number;
  total_amount: number;
}

export interface MonthlyStatsItem {
  year: number;
  month: number;
  currencies: Record<string, MonthlyCurrencyData>;
}

export interface TransactionsCompletedItem {
  month: number;
  [currency: string]: number | undefined;
}

export interface TransactionAmountsItem {
  month: number;
  [currency: string]: number | undefined;
}

export interface StatsResponse {
  success: boolean;
  months: MonthlyStatsItem[];
  transactions_completed: TransactionsCompletedItem[];
  transaction_amounts: TransactionAmountsItem[];
}

// User Growth Analytics Interface
export interface UserGrowthMonthlyItem {
  year: number;
  month: number;
  buyers: number;
  sellers: number;
}

export interface UserGrowthResponse {
  success: boolean;
  message: string;
  data: {
    startDate: string;
    endDate: string;
    monthly_data: UserGrowthMonthlyItem[];
  };
}

export interface CategoryStatsItem {
  category: string;
  total_products: number;
  total_sellers: number;
}

export interface CategoryStatsResponse {
  success: boolean;
  message: string;
  data: CategoryStatsItem[];
}

// RTK Query Slice
export const adminStatsApi = createApi({
  reducerPath: "adminStatsApi",
  baseQuery: axiosBaseQuery,

  endpoints: (builder) => ({
    // Admin Dashboard Stats
    getAdminDashboardStats: builder.query<
      AdmindashboardStatsResponse,
      { year: number; startMonth: number; endMonth: number }
    >({
      query: ({ year, startMonth, endMonth }) => ({
        url: `/stats/dashboard?year=${year}&startMonth=${startMonth}&endMonth=${endMonth}`,
        method: "GET",
      }),
      providesTags: [{ type: "AdminStats", id: "DASHBOARD_STATS" }],
    }),
    getMonthlyStats: builder.query<
      StatsResponse,
      {
        year: number;
        startMonth: number;
        endMonth: number;
        sellerId?: number | null;
      }
    >({
      query: ({ year, startMonth, endMonth, sellerId }) => {
        const finalSellerId = sellerId ?? null; // if undefined, make it null
        console.log("getMonthlyStats params:", {
          year,
          startMonth,
          endMonth,
          sellerId: finalSellerId,
        });

        // optionally, skip the API call if sellerId is null
        if (!finalSellerId) {
          console.warn("No sellerId provided, skipping monthly stats API call");
          return {
            url: `/stats?year=${year}&startMonth=${startMonth}&endMonth=${endMonth}`,
            method: "GET",
          };
        }

        return {
          url: `/stats?year=${year}&startMonth=${startMonth}&endMonth=${endMonth}&seller_id=${finalSellerId}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "AdminStats", id: "MONTHLY_STATS" }],
    }),

    // User Growth API
    getUserGrowthStats: builder.query<
      UserGrowthResponse,
      {
        year: number;
        startMonth: number;
        endMonth: number;
      }
    >({
      query: ({ year, startMonth, endMonth }) => ({
        url: `/stats/user-growth`,
        method: "GET",
        params: { year, startMonth, endMonth },
      }),
      providesTags: [{ type: "AdminStats", id: "USER_GROWTH" }],
    }),

    // Category Stats
    getCategoryStats: builder.query<
      CategoryStatsResponse,
      { sellerId?: number } | void
    >({
      query: (params) => {
        const sellerId = params?.sellerId ?? null; // use null if not provided
        return {
          url: `/stats/category${sellerId ? `?seller_id=${sellerId}` : ""}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "AdminStats", id: "CATEGORY_STATS" }],
    }),
  }),
});

// Export Hooks
export const {
  useGetAdminDashboardStatsQuery,
  useGetMonthlyStatsQuery,
  useGetUserGrowthStatsQuery,
  useGetCategoryStatsQuery,
} = adminStatsApi;
