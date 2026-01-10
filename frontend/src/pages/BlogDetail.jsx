import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  ArrowLeft,
  User,
  MessageCircle,
  Send,
  Facebook,
  Twitter,
  Linkedin,
  Bookmark
} from 'lucide-react';
import { useGetBlogBySlugQuery, useAddBlogCommentMutation, useToggleBlogLikeMutation } from '../rtk/slices/blogApiSlice';

const BlogDetail = () => {
  const { slug } = useParams();
  const [commentText, setCommentText] = useState('');
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [showComments, setShowComments] = useState(false);

  const { data: blogData, isLoading, isError } = useGetBlogBySlugQuery(slug);
  const [addComment, { isLoading: commentLoading }] = useAddBlogCommentMutation();
  const [toggleLike, { isLoading: likeLoading }] = useToggleBlogLikeMutation();

  const blog = blogData?.data;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim() || !commentName.trim() || !commentEmail.trim()) {
      alert('Please fill all required fields');
      return;
    }

    try {
      await addComment({
        slug,
        commentData: {
          text: commentText,
          name: commentName,
          email: commentEmail
        }
      }).unwrap();

      setCommentText('');
      setCommentName('');
      setCommentEmail('');
      alert('Comment submitted successfully! It will be visible after approval.');
    } catch (error) {
      console.error('Comment submission error:', error);
      alert('Failed to submit comment. Please try again.');
    }
  };

  const handleLike = async () => {
    try {
      await toggleLike({ slug, patientId: 'guest' }); // For demo purposes
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const shareUrl = window.location.href;
  const shareTitle = blog?.title || '';

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-lightSky">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-64 bg-gray-200 animate-pulse"></div>
            <div className="p-8">
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="min-h-screen bg-lightSky">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-3xl font-bold text-darktext mb-4">Article Not Found</h1>
          <p className="text-lighttext mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/blog"
            className="bg-main hover:bg-main/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightSky">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-lighttext">
            <Link to="/" className="hover:text-main transition-colors">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-main transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-darktext truncate">{blog.title}</span>
          </nav>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Article Header */}
        <header className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="relative h-64 md:h-96">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              {blog.isFeatured && (
                <div className="absolute top-4 left-4 bg-main text-white px-3 py-1 rounded-full text-sm font-medium">
                  Featured Article
                </div>
              )}
            </div>
          )}

          {/* Article Meta */}
          <div className="p-8">
            {/* Categories */}
            {blog.categories && blog.categories.length > 0 && (
              <div className="flex gap-2 mb-4">
                {blog.categories.map((category, index) => (
                  <Link
                    key={index}
                    to={`/blog?category=${encodeURIComponent(category)}`}
                    className="px-3 py-1 bg-main/10 text-main rounded-full text-sm font-medium hover:bg-main hover:text-white transition-colors"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-darktext mb-4 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-lighttext mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{blog.readTime} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{blog.views || 0} views</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{blog.author?.username || 'Anonymous'}</span>
              </div>
            </div>

            {/* Excerpt */}
            <p className="text-xl text-lighttext leading-relaxed border-l-4 border-main pl-6">
              {blog.excerpt}
            </p>
          </div>
        </header>

        {/* Article Content */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div
            className="prose prose-lg max-w-none prose-headings:text-darktext prose-p:text-lighttext prose-strong:text-darktext prose-a:text-main hover:prose-a:text-main/80"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Article Footer */}
        <footer className="bg-white rounded-xl shadow-sm p-8 mb-8">
          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-darktext mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <Link
                    key={index}
                    to={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="px-4 py-2 bg-gray-100 text-lighttext rounded-lg hover:bg-main hover:text-white transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Engagement Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                disabled={likeLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  blog.likes?.includes('guest')
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${blog.likes?.includes('guest') ? 'fill-current' : ''}`} />
                <span>{blog.likeCount || 0}</span>
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{blog.comments?.filter(c => c.isApproved).length || 0}</span>
              </button>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-lighttext mr-2">Share:</span>
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-400 text-white rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-700 text-white rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </footer>

        {/* Comments Section */}
        {showComments && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h3 className="text-2xl font-bold text-darktext mb-6">
              Comments ({blog.comments?.filter(c => c.isApproved).length || 0})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email *"
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                  required
                />
              </div>
              <textarea
                placeholder="Write your comment... *"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent resize-none mb-4"
                required
              />
              <button
                type="submit"
                disabled={commentLoading}
                className="bg-main hover:bg-main/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {commentLoading ? 'Posting...' : 'Post Comment'}
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {blog.comments?.filter(comment => comment.isApproved).map((comment, index) => (
                <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-main/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-main font-semibold text-sm">
                        {comment.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-darktext">{comment.name}</span>
                        <span className="text-sm text-lighttext">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-lighttext">{comment.text}</p>
                    </div>
                  </div>
                </div>
              ))}

              {(!blog.comments || blog.comments.filter(c => c.isApproved).length === 0) && (
                <div className="text-center py-8 text-lighttext">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Related Articles */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="text-2xl font-bold text-darktext mb-6">Related Articles</h3>
          <div className="text-center py-8 text-lighttext">
            Related articles will be displayed here based on categories and tags.
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
