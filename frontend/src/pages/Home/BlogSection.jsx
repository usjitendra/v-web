// components/BlogSection.jsx
import { Link } from "react-router-dom";
import SectionHeading from "@/components/home/SectionHeading";
// import { useGetFeaturedBlogsQuery } from "../../rtk/slices/blogApiSlice";

const BlogSection = () => {
  /* ===========================
      STATIC BLOG DATA
  ============================ */
  const blogs = [
    {
      _id: "1",
      title: "Understanding Mental Health in Modern Life",
      slug: "understanding-mental-health",
      excerpt:
        "Mental health is just as important as physical health. Learn how to maintain balance in today’s fast-paced world.",
      featuredImage:
        "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb",
      categories: ["Mental Health"],
      readTime: 5,
      author: {
        username: "Admin",
      },
      views: 120,
      likeCount: 24,
      publishedAt: "2024-10-10",
    },
    {
      _id: "2",
      title: "10 Daily Habits for a Healthier Lifestyle",
      slug: "healthy-daily-habits",
      excerpt:
        "Small habits practiced daily can lead to a healthier and happier life. Here are 10 habits you should start today.",
      featuredImage:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
      categories: ["Wellness"],
      readTime: 4,
      author: {
        username: "Admin",
      },
      views: 98,
      likeCount: 18,
      publishedAt: "2024-10-05",
    },
    {
      _id: "3",
      title: "Why Preventive Healthcare Matters",
      slug: "preventive-healthcare-matters",
      excerpt:
        "Preventive healthcare helps detect diseases early and improves long-term outcomes. Learn why it matters.",
      featuredImage:
        "https://images.unsplash.com/photo-1580281658629-63a51a34b7b6",
      categories: ["Healthcare"],
      readTime: 6,
      author: {
        username: "Admin",
      },
      views: 150,
      likeCount: 30,
      publishedAt: "2024-09-28",
    },
  ];

  // 🔹 Previously dynamic states (now fixed)
  const isLoading = false;
  const isError = false;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  /* ===========================
      LOADING STATE
  ============================ */
  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Latest Blog Posts
            </h2>
            <p className="text-gray-600">
              Loading our latest health insights...
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-300" />
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-4" />
                  <div className="h-4 bg-gray-300 rounded mb-2" />
                  <div className="h-4 bg-gray-300 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ===========================
      ERROR STATE
  ============================ */
  if (isError) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">Failed to load blogs</p>
        </div>
      </section>
    );
  }

  /* ===========================
      MAIN UI
  ============================ */
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* <div className="text-center mb-12">
          <SectionHeading title="blog" />
        </div> */}


             <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center" >
              Latest Blog Posts
            </h2>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{blog.views || 0}</span>
                      <span>{blog.likeCount || blog.likes?.length || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Read More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/blog"
            className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Blog Posts
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
