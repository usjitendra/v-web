import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  User,
  Eye as EyeIcon,
  Heart,
  MessageCircle,
  Star,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import {
  useGetAdminBlogsQuery,
  useGetBlogStatsQuery,
  useDeleteBlogMutation,
  useUpdateBlogMutation
} from '../../rtk/slices/blogApiSlice';

const BlogManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const { data: blogsData, isLoading: blogsLoading, refetch } = useGetAdminBlogsQuery({
    search: searchTerm,
    status: statusFilter,
    page: 1,
    limit: 50
  });

  const { data: statsData } = useGetBlogStatsQuery();
  const [deleteBlog, { isLoading: deleteLoading }] = useDeleteBlogMutation();
  const [updateBlog, { isLoading: updateLoading }] = useUpdateBlogMutation();

  const blogs = blogsData?.data || [];
  const stats = statsData?.data || {};

  const handleStatusChange = async (blogId, newStatus) => {
    try {
      await updateBlog({
        id: blogId,
        blogData: { status: newStatus }
      }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to update blog status:', error);
    }
  };

  const handleToggleFeatured = async (blogId, currentFeatured) => {
    try {
      await updateBlog({
        id: blogId,
        blogData: { isFeatured: !currentFeatured }
      }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to toggle featured status:', error);
    }
  };

  const handleDeleteBlog = async () => {
    if (!blogToDelete) return;

    try {
      await deleteBlog(blogToDelete).unwrap();
      setShowDeleteModal(false);
      setBlogToDelete(null);
      refetch();
    } catch (error) {
      console.error('Failed to delete blog:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', icon: Clock },
      published: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      archived: { color: 'bg-red-100 text-red-800', icon: AlertCircle }
    };

    const config = statusConfig[status] || statusConfig.draft;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
            <p className="text-gray-600 mt-1">Manage your blog posts and content</p>
          </div>
          <button
            onClick={() => navigate('/admin/blogs/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Blog
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Blogs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold text-green-600">{stats.published || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalViews || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <EyeIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold text-red-600">{stats.totalLikes || 0}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {blogsLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-8 text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
            <p className="text-gray-600">Create your first blog post to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blog
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {blog.featuredImage ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={blog.featuredImage}
                              alt={blog.title}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <MessageCircle className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {blog.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {blog.excerpt}
                          </div>
                          {blog.isFeatured && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(blog.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{blog.author?.username || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-500">
                          <EyeIcon className="w-3 h-3 mr-1" />
                          {blog.views || 0}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Heart className="w-3 h-3 mr-1" />
                          {blog.likeCount || 0}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(blog.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/blog/${blog.slug}`)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Blog"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/blogs/edit/${blog._id}`)}
                          className="text-yellow-600 hover:text-yellow-900 p-1"
                          title="Edit Blog"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(blog._id, blog.isFeatured)}
                          className={`p-1 ${blog.isFeatured ? 'text-yellow-600 hover:text-yellow-900' : 'text-gray-400 hover:text-yellow-600'}`}
                          title={blog.isFeatured ? 'Remove from Featured' : 'Mark as Featured'}
                        >
                          <Star className={`w-4 h-4 ${blog.isFeatured ? 'fill-current' : ''}`} />
                        </button>
                        <select
                          value={blog.status}
                          onChange={(e) => handleStatusChange(blog._id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Publish</option>
                          <option value="archived">Archive</option>
                        </select>
                        <button
                          onClick={() => {
                            setBlogToDelete(blog._id);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete Blog"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Blog</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this blog? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBlog}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
