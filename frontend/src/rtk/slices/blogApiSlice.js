import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../api/baseQuery";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: axiosBaseQuery,
  tagTypes: ["Blog", "BlogStats"],

  endpoints: (builder) => ({
    // PUBLIC ENDPOINTS

    // Get all published blogs
    getBlogs: builder.query({
      query: (params) => ({
        url: "blogs/public",
        method: "GET",
        params,
      }),
      providesTags: ["Blog"],
    }),

    // Get blog by slug
    getBlogBySlug: builder.query({
      query: (slug) => ({
        url: `blogs/public/${slug}`,
        method: "GET",
      }),
      providesTags: ["Blog"],
    }),

    // Get featured blogs
    getFeaturedBlogs: builder.query({
      query: (params = {}) => ({
        url: "blogs/featured",
        method: "GET",
        params,
      }),
      providesTags: ["Blog"],
    }),

    // Get recent blogs
    getRecentBlogs: builder.query({
      query: (params = {}) => ({
        url: "blogs/recent",
        method: "GET",
        params,
      }),
      providesTags: ["Blog"],
    }),

    // Get blog categories
    getBlogCategories: builder.query({
      query: () => ({
        url: "blogs/categories",
        method: "GET",
      }),
      providesTags: ["Blog"],
    }),

    // Get blog tags
    getBlogTags: builder.query({
      query: () => ({
        url: "blogs/tags",
        method: "GET",
      }),
      providesTags: ["Blog"],
    }),

    // Add comment to blog
    addBlogComment: builder.mutation({
      query: ({ slug, commentData }) => ({
        url: `blogs/${slug}/comments`,
        method: "POST",
        data: commentData,
      }),
      invalidatesTags: ["Blog"],
    }),

    // Toggle like on blog
    toggleBlogLike: builder.mutation({
      query: ({ slug, patientId }) => ({
        url: `blogs/${slug}/like`,
        method: "POST",
        data: { patientId },
      }),
      invalidatesTags: ["Blog"],
    }),

    // ADMIN ENDPOINTS

    // Get all blogs (admin)
    getAdminBlogs: builder.query({
      query: (params) => ({
        url: "blogs",
        method: "GET",
        params,
      }),
      providesTags: ["Blog"],
    }),

    // Get blog statistics (admin)
    getBlogStats: builder.query({
      query: () => ({
        url: "blogs/stats",
        method: "GET",
      }),
      providesTags: ["BlogStats"],
    }),

    // Get blog by ID (admin)
    getBlogById: builder.query({
      query: (id) => ({
        url: `blogs/${id}`,
        method: "GET",
      }),
      providesTags: ["Blog"],
    }),

    // Create blog (admin)
    createBlog: builder.mutation({
      query: (blogData) => ({
        url: "blogs",
        method: "POST",
        data: blogData,
      }),
      invalidatesTags: ["Blog", "BlogStats"],
    }),

    // Update blog (admin)
    updateBlog: builder.mutation({
      query: ({ id, blogData }) => ({
        url: `blogs/${id}`,
        method: "PUT",
        data: blogData,
      }),
      invalidatesTags: ["Blog", "BlogStats"],
    }),

    // Delete blog (admin)
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog", "BlogStats"],
    }),

    // Approve blog comment (admin)
    approveBlogComment: builder.mutation({
      query: ({ blogId, commentId }) => ({
        url: `blogs/${blogId}/comments/${commentId}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Blog"],
    }),

    // Delete blog comment (admin)
    deleteBlogComment: builder.mutation({
      query: ({ blogId, commentId }) => ({
        url: `blogs/${blogId}/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

export const {
  // Public hooks
  useGetBlogsQuery,
  useGetBlogBySlugQuery,
  useGetFeaturedBlogsQuery,
  useGetRecentBlogsQuery,
  useGetBlogCategoriesQuery,
  useGetBlogTagsQuery,
  useAddBlogCommentMutation,
  useToggleBlogLikeMutation,

  // Admin hooks
  useGetAdminBlogsQuery,
  useGetBlogStatsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useApproveBlogCommentMutation,
  useDeleteBlogCommentMutation,
} = blogApi;
