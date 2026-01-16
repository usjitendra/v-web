import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Eye, Heart, ArrowRight, BookOpen } from 'lucide-react';
import { useGetFeaturedBlogsQuery, useGetRecentBlogsQuery } from '../../rtk/slices/blogApiSlice';

const BlogCard = ({ blog, featured = false }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Link
      to={`/blog/${blog.slug}`}
      className={`block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group ${
        featured ? 'md:col-span-2 lg:col-span-1' : ''
      }`}
    >
      {/* Featured Image */}
      <div className={`relative overflow-hidden ${featured ? 'h-64' : 'h-48'}`}>
        {blog.featuredImage ? (
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-main/20 to-main/10 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-main/60" />
          </div>
        )}

        {/* Status Badge */}
        {blog.isFeatured && (
          <div className="absolute top-3 left-3 bg-main text-white px-3 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
        <h3 className={`font-bold text-darktext mb-3 group-hover:text-main transition-colors line-clamp-2 ${
          featured ? 'text-xl' : 'text-lg'
        }`}>
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-lighttext text-sm leading-relaxed mb-4 line-clamp-3">
          {blog.excerpt}
        </p>

        {/* Categories */}
        {blog.categories && blog.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.categories.slice(0, 2).map((category, index) => (
              <span
                key={index}
                className="bg-main/10 text-main px-3 py-1 rounded-full text-xs font-medium"
              >
                {category}
              </span>
            ))}
            {blog.categories.length > 2 && (
              <span className="text-lighttext text-xs">+{blog.categories.length - 2} more</span>
            )}
          </div>
        )}

        {/* Stats and CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-lighttext">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{blog.views || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{blog.likeCount || 0}</span>
            </div>
          </div>

          <div className="flex items-center text-main font-medium text-sm group-hover:text-main/80 transition-colors">
            Read More
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};

const BlogSection = () => {
  const { data: featuredBlogs, isLoading: featuredLoading } = useGetFeaturedBlogsQuery({ limit: 2 });
  const { data: recentBlogs, isLoading: recentLoading } = useGetRecentBlogsQuery({ limit: 3 });

  const featuredBlogsData = featuredBlogs?.data || [];
  const recentBlogsData = recentBlogs?.data || [];

  return (
    <section className="py-20 bg-lightSky">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-darktext mb-4">
            Latest Health Insights
          </h2>
          <p className="text-lg text-lighttext max-w-2xl mx-auto">
            Stay informed with expert articles on medical treatments, health tips,
            and the latest developments in healthcare.
          </p>
        </div>

        {/* Featured Blogs */}
        {featuredBlogsData.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-darktext">Featured Articles</h3>
              <Link
                to="/blog"
                className="text-main hover:text-main/80 font-medium flex items-center gap-2 transition-colors"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {featuredLoading ? (
              <div className="grid md:grid-cols-2 gap-8">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-xl h-80 animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {featuredBlogsData.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} featured />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recent Blogs */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-darktext">Recent Posts</h3>
            <Link
              to="/blog"
              className="text-main hover:text-main/80 font-medium flex items-center gap-2 transition-colors"
            >
              View All Posts
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl h-72 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentBlogsData.slice(0, 3).map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          )}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-main to-main/80 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-white/90 mb-6 max-w-md mx-auto">
            Subscribe to our newsletter for the latest health insights and medical updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-darktext placeholder-darktext/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="bg-white text-main hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
