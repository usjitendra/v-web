// slices/seoApiSlice.js
import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../api/baseQuery';

export const seoApi = createApi({
  reducerPath: 'seoApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['SEO', 'SEOStats'],

  endpoints: (builder) => ({
    // Public endpoints for frontend use
    getSEOByPage: builder.query({
      query: ({ pageType, pageIdentifier = '' }) => ({
        url: `/seo/page/${pageType}/${pageIdentifier}`,
        method: 'GET',
      }),
      providesTags: (result, error, { pageType, pageIdentifier }) => [
        { type: 'SEO', id: `${pageType}-${pageIdentifier}` },
      ],
    }),

    getSEOBySlug: builder.query({
      query: (slug) => ({
        url: `/seo/slug/${slug}`,
        method: 'GET',
      }),
      providesTags: (result, error, slug) => [
        { type: 'SEO', id: slug },
      ],
    }),

    // Admin endpoints
    getSEOEntries: builder.query({
      query: (params = {}) => ({
        url: '/seo',
        method: 'GET',
        params,
      }),
      providesTags: ['SEO'],
    }),

    getSEOStats: builder.query({
      query: () => ({
        url: '/seo/stats',
        method: 'GET',
      }),
      providesTags: ['SEOStats'],
    }),

    getSEOById: builder.query({
      query: (id) => ({
        url: `/seo/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [
        { type: 'SEO', id },
      ],
    }),

    createSEO: builder.mutation({
      query: (data) => ({
        url: '/seo',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['SEO', 'SEOStats'],
    }),

    updateSEO: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/seo/${id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'SEO', id },
        'SEO',
        'SEOStats',
      ],
    }),

    deleteSEO: builder.mutation({
      query: (id) => ({
        url: `/seo/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SEO', 'SEOStats'],
    }),

    bulkUpdateSEO: builder.mutation({
      query: (data) => ({
        url: '/seo/bulk-update',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['SEO', 'SEOStats'],
    }),

    generateDefaultSEO: builder.mutation({
      query: () => ({
        url: '/seo/generate-defaults',
        method: 'POST',
      }),
      invalidatesTags: ['SEO', 'SEOStats'],
    }),
  }),
});

export const {
  useGetSEOByPageQuery,
  useGetSEOBySlugQuery,
  useGetSEOEntriesQuery,
  useGetSEOStatsQuery,
  useGetSEOByIdQuery,
  useCreateSEOMutation,
  useUpdateSEOMutation,
  useDeleteSEOMutation,
  useBulkUpdateSEOMutation,
  useGenerateDefaultSEOMutation,
} = seoApi;
