// components/AdminBlogManagement.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import url_prefix from '../../data/variable';
import ImageUpload from './ImageUpload';

const AdminBlogManagement = () => {
    const [blogs, setBlogs] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('blogs');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [showBlogModal, setShowBlogModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();

    const limit = 10;

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }

        if (activeTab === 'blogs') {
            fetchBlogs();
        } else if (activeTab === 'stats') {
            fetchStats();
        }
    }, [activeTab, currentPage, searchTerm, statusFilter, navigate]);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            let url = `${url_prefix}/api/admin/blogs?page=${currentPage}&limit=${limit}`;

            if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
            if (statusFilter) url += `&status=${statusFilter}`;

            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const result = await response.json();

            if (result.success) {
                setBlogs(result.data);
                // setTotalPages(result.pagination.pages);
            } else {
                console.error('Failed to fetch blogs:', result.error);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };
    // Handle image upload



    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${url_prefix}/api/admin/blogs/stats`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const result = await response.json();

            if (result.success) {
                setStats(result.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleDeleteBlog = async (blogId) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${url_prefix}/api/admin/blogs/${blogId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            const result = await response.json();

            if (result.success) {
                alert('Blog deleted successfully');
                setShowDeleteModal(false);
                fetchBlogs();
            } else {
                alert('Failed to delete blog: ' + result.error);
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
            alert('Error deleting blog');
        }
    };

    const handleStatusChange = async (blogId, newStatus) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${url_prefix}/api/admin/blogs/${blogId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            const result = await response.json();

            if (result.success) {
                alert('Blog status updated successfully');
                fetchBlogs();
            } else {
                alert('Failed to update status: ' + result.error);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error updating blog status');
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    const openBlogModal = (blog = null) => {
        setSelectedBlog(blog);
        setShowBlogModal(true);
    };

    const openDeleteModal = (blog) => {
        setSelectedBlog(blog);
        setShowDeleteModal(true);
    };

    const StatusBadge = ({ status }) => {
        const getStatusColor = (status) => {
            switch (status) {
                case 'published': return 'bg-green-100 text-green-800';
                case 'draft': return 'bg-yellow-100 text-yellow-800';
                case 'archived': return 'bg-gray-100 text-gray-800';
                default: return 'bg-gray-100 text-gray-800';
            }
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Blog Management</h1>
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Back to Dashboard
                </button>
            </header>

            {/* Tabs */}
            <div className="flex border-b mb-6">
                <button
                    className={`px-4 py-2 ${activeTab === 'blogs' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                    onClick={() => setActiveTab('blogs')}
                >
                    Blogs
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'stats' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                    onClick={() => setActiveTab('stats')}
                >
                    Statistics
                </button>
            </div>

            {activeTab === 'blogs' ? (
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Manage Blogs</h2>
                        <button
                            onClick={() => openBlogModal()}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            + Add New Blog
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Search blogs..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="p-2 border border-gray-300 rounded"
                        />
                        <select
                            value={statusFilter}
                            onChange={handleFilterChange}
                            className="p-2 border border-gray-300 rounded"
                        >
                            <option value="">All Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                        </select>
                        <button
                            onClick={fetchBlogs}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Apply Filters
                        </button>
                    </div>

                    {/* Blogs Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="px-4 py-2">Title</th>
                                    <th className="px-4 py-2">Author</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">Views</th>
                                    <th className="px-4 py-2">Likes</th>
                                    <th className="px-4 py-2">Created</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blogs.map((blog) => (
                                    <tr key={blog._id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-2">
                                            <div className="font-medium">{blog.title}</div>
                                            <div className="text-sm text-gray-600">{blog.excerpt.substring(0, 50)}...</div>
                                        </td>
                                        <td className="px-4 py-2">{blog.author?.username}</td>
                                        <td className="px-4 py-2">
                                            <StatusBadge status={blog.status} />
                                        </td>
                                        <td className="px-4 py-2">{blog.views}</td>
                                        <td className="px-4 py-2">{blog.likes?.length || 0}</td>
                                        <td className="px-4 py-2">
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openBlogModal(blog)}
                                                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(blog)}
                                                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>
                                                {blog.status === 'published' && (
                                                    <button
                                                        onClick={() => handleStatusChange(blog._id, 'draft')}
                                                        className="bg-gray-500 text-white px-2 py-1 rounded text-sm hover:bg-gray-600"
                                                    >
                                                        Unpublish
                                                    </button>
                                                )}
                                                {blog.status === 'draft' && (
                                                    <button
                                                        onClick={() => handleStatusChange(blog._id, 'published')}
                                                        className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
                                                    >
                                                        Publish
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {blogs.length === 0 && !loading && (
                        <div className="text-center py-8 text-gray-500">
                            No blogs found
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-6">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-400"
                        >
                            Previous
                        </button>
                        <span className="text-sm">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-400"
                        >
                            Next
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-6">Blog Statistics</h2>

                    {stats ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-blue-800">Total Blogs</h3>
                                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-green-800">Published</h3>
                                <p className="text-3xl font-bold text-green-600">{stats.published}</p>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-yellow-800">Drafts</h3>
                                <p className="text-3xl font-bold text-yellow-600">{stats.drafts}</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-purple-800">Featured</h3>
                                <p className="text-3xl font-bold text-purple-600">{stats.featured}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-800">Total Views</h3>
                                <p className="text-3xl font-bold text-gray-600">{stats.totalViews}</p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-red-800">Total Likes</h3>
                                <p className="text-3xl font-bold text-red-600">{stats.totalLikes}</p>
                            </div>
                            <div className="bg-teal-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-teal-800">Total Comments</h3>
                                <p className="text-3xl font-bold text-teal-600">{stats.totalComments}</p>
                            </div>
                        </div>
                    ) : (
                        <p>Loading statistics...</p>
                    )}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedBlog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                        <p className="mb-4">
                            Are you sure you want to delete the blog "{selectedBlog.title}"? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteBlog(selectedBlog._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Blog Editor Modal */}
            {showBlogModal && (
                <BlogEditorModal
                    blog={selectedBlog}
                    onClose={() => setShowBlogModal(false)}
                    onSave={() => {
                        setShowBlogModal(false);
                        fetchBlogs();
                    }}
                />
            )}
        </div>
    );
};

// Blog Editor Modal Component
const BlogEditorModal = ({ blog, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: blog?.title || '',
        excerpt: blog?.excerpt || '',
        content: blog?.content || '',
        featuredImage: blog?.featuredImage || '',
        categories: blog?.categories?.join(', ') || '',
        tags: blog?.tags?.join(', ') || '',
        status: blog?.status || 'draft',
        isFeatured: blog?.isFeatured || false,
        metaTitle: blog?.metaTitle || '',
        metaDescription: blog?.metaDescription || '',
        language: blog?.language || 'EN'
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('adminToken');
            const url = blog
                ? `${url_prefix}/api/admin/blogs/${blog._id}`
                : `${url_prefix}/api/admin/blogs`;

            const method = blog ? 'PUT' : 'POST';

            const payload = {
                ...formData,
                categories: formData.categories.split(',').map(cat => cat.trim()).filter(cat => cat),
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
                alert(blog ? 'Blog updated successfully' : 'Blog created successfully');
                onSave();
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            console.error('Error saving blog:', error);
            alert('Error saving blog');
        } finally {
            setLoading(false);
        }
    };
    const handleImageUpload = (imageUrl) => {
        console.log(imageUrl)
        setFormData(prev => ({ ...prev, featuredImage: imageUrl }));
        console.log(formData)
    };
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">
                    {blog ? 'Edit Blog' : 'Create New Blog'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="w-full border border-gray-300 rounded p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded p-2"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Excerpt *</label>
                        <textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleInputChange}
                            required
                            rows="3"
                            className="w-full border border-gray-300 rounded p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Content *</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            required
                            rows="10"
                            className="w-full border border-gray-300 rounded p-2"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700">Featured Image URL</label>
                            <input
                                type="url"
                                name="featuredImage"
                                value={formData.featuredImage}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded p-2"
                            />
                        </div> */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Featured Image</label>
                            <ImageUpload
                                onImageUpload={handleImageUpload}
                                currentImage={formData.featuredImage}
                                folder="blog"
                                maxSize={5}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Language</label>
                            <select
                                name="language"
                                value={formData.language}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded p-2"
                            >
                                <option value="EN">English</option>
                                <option value="ES">Spanish</option>
                                <option value="FR">French</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Categories (comma-separated)</label>
                            <input
                                type="text"
                                name="categories"
                                value={formData.categories}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded p-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Meta Title</label>
                            <input
                                type="text"
                                name="metaTitle"
                                value={formData.metaTitle}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                            <textarea
                                name="metaDescription"
                                value={formData.metaDescription}
                                onChange={handleInputChange}
                                rows="2"
                                className="w-full border border-gray-300 rounded p-2"
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isFeatured"
                            checked={formData.isFeatured}
                            onChange={handleInputChange}
                            className="mr-2"
                        />
                        <label className="text-sm font-medium text-gray-700">Featured Blog</label>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : (blog ? 'Update Blog' : 'Create Blog')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminBlogManagement;