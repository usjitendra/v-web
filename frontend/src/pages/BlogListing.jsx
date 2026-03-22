import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  Search,
  Filter,
  Grid,
  List,
  ArrowRight
} from 'lucide-react';
import { useGetBlogsQuery, useGetBlogCategoriesQuery, useGetBlogTagsQuery } from '../rtk/slices/blogApiSlice';

const BlogCard = ({ blog, viewMode }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (viewMode === 'list') {
    return (
      <Link
        to={`/blog/${blog.slug}`}
        className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6"
      >
        <div className="flex gap-6">
          {/* Image */}
          <div className="flex-shrink-0 w-48 h-32 rounded-lg overflow-hidden bg-gray-200">
            {blog.featuredImage ? (
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-main/10">
                <span className="text-main text-2xl font-bold">
                  {blog.title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-4 text-sm text-lighttext mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{blog.readTime} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{blog.views || 0}</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-darktext mb-2 hover:text-main transition-colors">
              {blog.title}
            </h3>

            <p className="text-lighttext mb-4 line-clamp-2">{blog.excerpt}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {blog.categories && blog.categories.length > 0 && (
                  <div className="flex gap-2">
                    {blog.categories.slice(0, 2).map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-main/10 text-main rounded-full text-sm font-medium"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center text-main font-medium hover:text-main/80 transition-colors">
                Read More
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
    >
      {/* Featured Image */}
      <div className="relative overflow-hidden h-48">
        {blog.featuredImage ? (
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-main/20 to-main/10 flex items-center justify-center">
            <span className="text-main text-3xl font-bold">
              {blog.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {blog.isFeatured && (
          <div className="absolute top-3 left-3 bg-main text-white px-3 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Meta Information */}
        <div className="flex items-center gap-4 text-sm text-lighttext mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{blog.readTime} min read</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-darktext mb-3 group-hover:text-main transition-colors line-clamp-2">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-lighttext text-sm leading-relaxed mb-4 line-clamp-3">
          {blog.excerpt}
        </p>

        {/* Categories and CTA */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {blog.categories && blog.categories.slice(0, 2).map((category, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-main/10 text-main rounded-full text-xs font-medium"
              >
                {category}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 text-sm text-lighttext">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{blog.views || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{blog.likeCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const BlogListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');

  const { data: blogsData, isLoading, isError } = useGetBlogsQuery({
    search: searchTerm,
    category: selectedCategory,
    tag: selectedTag,
    page: 1,
    limit: 12
  });

  const { data: categoriesData } = useGetBlogCategoriesQuery();
  const { data: tagsData } = useGetBlogTagsQuery();

  const blogs = blogsData?.data || [];
  const categories = categoriesData?.data || [];
  const tags = tagsData?.data || [];

  const updateURL = (params) => {
    const newParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
    });
    setSearchParams(newParams);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateURL({
      search: searchTerm,
      category: selectedCategory,
      tag: selectedTag
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedTag('');
    setSearchParams({});
  };

  return (
    <>
      <Helmet>
        <title>Medical Blog Articles & Healthcare Insights | MedicwayCare</title>
        <meta name="description" content="Discover comprehensive articles on medical treatments, wellness tips, and healthcare information from MedicwayCare experts." />
        <meta name="keywords" content="blog, medical articles, health tips, healthcare, treatment information" />
      </Helmet>
      <div className="min-h-screen bg-lightSky">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-main/5 to-main/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-darktext mb-6">
              Health Insights & Articles
            </h1>
            <p className="text-xl text-lighttext max-w-3xl mx-auto mb-8">
              Stay informed with expert medical insights, treatment guides, and the latest
              developments in healthcare technology and research.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-main focus:border-transparent text-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-main hover:bg-main/90 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-main mb-2">{blogsData?.pagination?.total || 0}</div>
                <div className="text-lighttext">Articles</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-main mb-2">{categories.length}</div>
                <div className="text-lighttext">Categories</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-main mb-2">{tags.length}</div>
                <div className="text-lighttext">Topics</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-darktext mb-4">Filters</h3>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-medium text-darktext mb-3">Categories</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setSelectedCategory('');
                        updateURL({ ...Object.fromEntries(searchParams), category: '' });
                      }}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === '' ? 'bg-main text-white' : 'hover:bg-gray-100 text-lighttext'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.slice(0, 10).map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => {
                          setSelectedCategory(cat._id);
                          updateURL({ ...Object.fromEntries(searchParams), category: cat._id });
                        }}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === cat._id ? 'bg-main text-white' : 'hover:bg-gray-100 text-lighttext'
                        }`}
                      >
                        {cat._id} ({cat.count})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Tags */}
                <div className="mb-6">
                  <h4 className="font-medium text-darktext mb-3">Popular Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 15).map((tag) => (
                      <button
                        key={tag._id}
                        onClick={() => {
                          setSelectedTag(tag._id);
                          updateURL({ ...Object.fromEntries(searchParams), tag: tag._id });
                        }}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedTag === tag._id
                            ? 'bg-main text-white'
                            : 'bg-gray-100 text-lighttext hover:bg-gray-200'
                        }`}
                      >
                        {tag._id}
                      </button>
                    ))}
                  </div>
                </div>

                {(searchTerm || selectedCategory || selectedTag) && (
                  <button
                    onClick={clearFilters}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* View Toggle */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-main text-white' : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-main text-white' : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-lighttext">
                  {blogsData?.pagination?.total || 0} articles found
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-xl h-80 animate-pulse"></div>
                  ))}
                </div>
              )}

              {/* Error State */}
              {isError && (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">😔</div>
                  <h3 className="text-2xl font-bold text-darktext mb-2">Failed to Load Articles</h3>
                  <p className="text-lighttext mb-6">Please try again later or contact support.</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-main hover:bg-main/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Blogs Grid/List */}
              {!isLoading && !isError && (
                <>
                  {blogs.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="text-6xl mb-4">📝</div>
                      <h3 className="text-2xl font-bold text-darktext mb-2">No Articles Found</h3>
                      <p className="text-lighttext mb-6">
                        {searchTerm || selectedCategory || selectedTag
                          ? "Try adjusting your search criteria."
                          : "Check back later for new articles."
                        }
                      </p>
                      {(searchTerm || selectedCategory || selectedTag) && (
                        <button
                          onClick={clearFilters}
                          className="bg-main hover:bg-main/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className={
                      viewMode === 'grid'
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        : "space-y-6"
                    }>
                      {blogs.map((blog) => (
                        <BlogCard
                          key={blog._id}
                          blog={blog}
                          viewMode={viewMode}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Load More Button (if pagination exists) */}
              {blogsData?.pagination?.pages > 1 && (
                <div className="text-center mt-12">
                  <button className="bg-main hover:bg-main/90 text-white px-8 py-4 rounded-lg font-semibold transition-colors">
                    Load More Articles
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default BlogListing;
