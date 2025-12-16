// /src/pages/Blog.jsx
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SectionHeading from "../components/home/SectionHeading";
import url_prefix from "../data/variable";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const page = parseInt(searchParams.get("page")) || 1;
    const category = searchParams.get("category") || "";
    setCurrentPage(page);
    setSelectedCategory(category);
    fetchBlogs(page, category);
    fetchCategories();
  }, [searchParams]);

  // const fetchBlogs = async (page = 1, category = '') => {
  //     try {
  //         setLoading(true);
  //         let url = `${url_prefix}/api/blogs/public?page=${page}&limit=9`;
  //         if (category) {
  //             url += `&category=${category}`;
  //         }

  //         const response = await fetch(url);
  //         const result = await response.json();

  //         if (result.success) {
  //             setBlogs(result.data.blogs);
  //             console.log(blogs.length)
  //             setTotalPages(result.data.totalPages);
  //         } else {
  //             setError('Failed to load blogs');
  //         }
  //     } catch (err) {
  //         console.error('Error fetching blogs:', err);
  //         setError('Error loading blogs');
  //     } finally {
  //         setLoading(false);
  //     }
  // };

  const fetchBlogs = async (page = 1, category = "") => {
    try {
      setLoading(true);
      let url = `${url_prefix}/api/blogs/public?page=${page}&limit=9`;
      if (category) url += `&category=${category}`;

      const response = await fetch(url);
      const result = await response.json();
      console.log("API response", result); // keep this to confirm

      if (result.success && Array.isArray(result.data)) {
        setBlogs(result.data); // ✅ data itself is the array
        setTotalPages(result.pagination?.pages || 1); // ✅ read from result.pagination
      } else {
        setBlogs([]);
        setError("Failed to load blogs");
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Error loading blogs");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${url_prefix}/api/blogs/categories`);
      const result = await response.json();
      if (result.success) {
        // setCategories(result.data);
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    if (selectedCategory) {
      params.set("category", selectedCategory);
    }
    setSearchParams(params);
    window.scrollTo(0, 0);
  };

  const handleCategoryChange = (category) => {
    const params = new URLSearchParams();
    if (category) {
      params.set("category", category);
    }
    setSearchParams(params);
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Blog</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the latest health insights, tips, and news from our
              medical experts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && blogs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => fetchBlogs(currentPage, selectedCategory)}
            className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Blog</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover the latest health insights, tips, and news from our medical experts.
                    </p>
                </div> */}

        <SectionHeading
          // title={headings.title}
          // subtitle={headings.sub}
          // description={headings.desc}
          center={true}
          title="blog"
          page="page"
        />

        {/* Categories Filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {/* <button
                        onClick={() => handleCategoryChange('')}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${!selectedCategory
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        All Topics
                    </button> */}
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === category
                  ? "bg-teal-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blog posts found.</p>
            {selectedCategory && (
              <button
                onClick={() => handleCategoryChange("")}
                className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-600"
              >
                View All Posts
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {blogs.map((blog) => (
                <article
                  key={blog._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {blog.featuredImage && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-teal-600 font-semibold">
                        {blog.categories?.[0] || "Health"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {blog.readTime} min read
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-teal-600 transition-colors">
                      <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-teal-600 text-sm font-semibold">
                            {blog.author?.username?.charAt(0) || "A"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {blog.author?.username || "Admin"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(blog.publishedAt || blog.createdAt)}
                          </p>
                        </div>
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
                  </div>

                  <div className="px-6 pb-6">
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="inline-flex items-center text-teal-600 hover:text-teal-600 font-medium"
                    >
                      Read More
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    // Show limited pages with ellipsis
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded border ${
                            currentPage === page
                              ? "bg-teal-600 text-white border-teal-600"
                              : "border-gray-300 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="px-1">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
