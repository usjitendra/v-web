import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Upload, X } from 'lucide-react';
import {
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useGetBlogByIdQuery
} from '../../rtk/slices/blogApiSlice';

const BlogForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    categories: [],
    tags: [],
    status: 'draft',
    isFeatured: false,
    metaTitle: '',
    metaDescription: ''
  });

  const [currentCategory, setCurrentCategory] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState({});

  const [createBlog, { isLoading: createLoading }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: updateLoading }] = useUpdateBlogMutation();
  const { data: blogData, isLoading: blogLoading } = isEditing
    ? useGetBlogByIdQuery(id)
    : { data: null, isLoading: false };

  useEffect(() => {
    if (isEditing && blogData?.data) {
      const blog = blogData.data;
      setFormData({
        title: blog.title || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        featuredImage: blog.featuredImage || '',
        categories: blog.categories || [],
        tags: blog.tags || [],
        status: blog.status || 'draft',
        isFeatured: blog.isFeatured || false,
        metaTitle: blog.metaTitle || '',
        metaDescription: blog.metaDescription || ''
      });
    }
  }, [blogData, isEditing]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addCategory = () => {
    if (currentCategory.trim() && !formData.categories.includes(currentCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, currentCategory.trim()]
      }));
      setCurrentCategory('');
    }
  };

  const removeCategory = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.excerpt.trim()) newErrors.excerpt = 'Excerpt is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (formData.excerpt.length > 300) newErrors.excerpt = 'Excerpt cannot exceed 300 characters';
    if (formData.metaDescription && formData.metaDescription.length > 160) {
      newErrors.metaDescription = 'Meta description cannot exceed 160 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        ...formData,
        categories: formData.categories,
        tags: formData.tags
      };

      if (isEditing) {
        await updateBlog({ id, blogData: submitData }).unwrap();
      } else {
        await createBlog(submitData).unwrap();
      }

      navigate('/admin/blogs');
    } catch (error) {
      console.error('Blog save error:', error);
      setErrors({ submit: 'Failed to save blog. Please try again.' });
    }
  };

  if (isEditing && blogLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/blogs')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? 'Edit Blog' : 'Create New Blog'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditing ? 'Update your blog post' : 'Write and publish your blog post'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={createLoading || updateLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              {createLoading || updateLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errors.submit && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{errors.submit}</p>
        </div>
      )}

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter blog title"
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt *
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              rows="3"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.excerpt ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Brief description of the blog post"
            />
            {errors.excerpt && <p className="text-red-600 text-sm mt-1">{errors.excerpt}</p>}
            <p className="text-gray-500 text-sm mt-1">
              {formData.excerpt.length}/300 characters
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows="15"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.content ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Write your blog content here..."
            />
            {errors.content && <p className="text-red-600 text-sm mt-1">{errors.content}</p>}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Featured Image
            </label>
            <div className="space-y-3">
              {formData.featuredImage && (
                <div className="relative">
                  <img
                    src={formData.featuredImage}
                    alt="Featured"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <input
                type="url"
                name="featuredImage"
                value={formData.featuredImage}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter image URL"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Categories
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={currentCategory}
                onChange={(e) => setCurrentCategory(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addCategory)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add category"
              />
              <button
                onClick={addCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.categories.map((category, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {category}
                  <button
                    onClick={() => removeCategory(category)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tags
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addTag)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add tag"
              />
              <button
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:bg-green-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Featured & Settings */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700">
                  Mark as Featured
                </label>
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="SEO title (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.metaDescription ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="SEO description (optional)"
                />
                {errors.metaDescription && (
                  <p className="text-red-600 text-sm mt-1">{errors.metaDescription}</p>
                )}
                <p className="text-gray-500 text-sm mt-1">
                  {(formData.metaDescription || '').length}/160 characters
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;
