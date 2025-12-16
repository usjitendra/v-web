// /src/pages/BlogPost.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import url_prefix from "../data/variable";

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    fetchBlogPost();
  }, [slug]);

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${url_prefix}/api/blogs/public/${slug}`);
      const result = await response.json();

      if (result.success) {
        setBlog(result.data);
      } else {
        setError("Blog post not found");
      }
    } catch (err) {
      console.error("Error fetching blog post:", err);
      setError("Error loading blog post");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    setSubmittingComment(true);
    setCommentError("");

    try {
      const response = await fetch(`${url_prefix}/api/blogs/${slug}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: commentText,
          name: commentName,
          email: commentEmail,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setCommentSuccess(true);
        setCommentText("");
        setCommentName("");
        setCommentEmail("");
        // Refresh the blog post to show the new comment
        fetchBlogPost();
      } else {
        setCommentError(result.message || "Failed to submit comment");
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
      setCommentError("Error submitting comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="h-96 bg-gray-300 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Blog Post Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            {error || "The blog post you are looking for does not exist."}
          </p>
          <Link
            to="/blog"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-teal-700"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link to="/" className="hover:text-teal-600">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/blog" className="hover:text-teal-600">
                Blog
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-800">{blog.title}</li>
          </ol>
        </nav>

        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="h-96 overflow-hidden">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Meta Information */}
            <div className="flex flex-wrap items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-teal-600 font-semibold">
                  {blog.categories?.[0] || "Health"}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(blog.publishedAt || blog.createdAt)}
                </span>
                <span className="text-sm text-gray-500">
                  {blog.readTime} min read
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {blog.views}
                </span>
                <span className="text-sm text-gray-500 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {blog.likes?.length || 0}
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {blog.title}
            </h1>

            {/* Author Info */}
            <div className="flex items-center space-x-3 mb-8 pb-6 border-b">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-teal-600 text-sm font-semibold">
                  {blog.author?.username?.charAt(0) || "A"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {blog.author?.username || "Admin"}
                </p>
                <p className="text-xs text-gray-500">
                  Published on {formatDate(blog.publishedAt || blog.createdAt)}
                </p>
              </div>
            </div>

            {/* Content */}
            <div
              className="prose max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Tags:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="border-t pt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Comments (
                {blog.comments
                  ? blog.comments.filter((c) => c.isApproved).length
                  : 0}
                )
              </h3>

              {/* Comment Form */}
              <form onSubmit={handleSubmitComment} className="mb-8">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">
                  Leave a Comment
                </h4>
                {commentSuccess && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    Your comment has been submitted and is awaiting approval.
                  </div>
                )}
                {commentError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {commentError}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={commentEmail}
                      onChange={(e) => setCommentEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Comment *
                  </label>
                  <textarea
                    id="comment"
                    required
                    rows="4"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
                >
                  {submittingComment ? "Submitting..." : "Submit Comment"}
                </button>
              </form>

              {/* Comments List */}
              {blog.comments &&
              blog.comments.filter((c) => c.isApproved).length > 0 ? (
                <div className="space-y-6">
                  {blog.comments
                    .filter((comment) => comment.isApproved)
                    .map((comment) => (
                      <div
                        key={comment._id}
                        className="border-b pb-6 last:border-b-0"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-teal-600 text-sm font-semibold">
                              {comment.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="text-sm font-semibold text-gray-700">
                                {comment.name}
                              </h4>
                              <span className="text-xs text-gray-500">
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-600">{comment.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </article>

        {/* Back to Blog Link */}
        <div className="mt-8 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
