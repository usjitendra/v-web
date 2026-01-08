import React from 'react';

const BlogCard = ({ image, title, description, author }) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl bg-white">
      <div className="relative h-56 sm:h-64 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col flex-grow p-6 bg-slate-800">
        <p className="text-sm font-medium text-gray-300 mb-2">{author}</p>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-300 text-sm sm:text-base mb-6 flex-grow line-clamp-3">
          {description}
        </p>
        <button className="self-start px-6 py-2.5 border-2 border-white text-white font-medium rounded-md hover:bg-white hover:text-slate-800 transition-colors duration-300">
          Read More
        </button>
      </div>
    </div>
  );
};

const HealthBlogSection = () => {
  const blogs = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
      title: "Why Regular Screening is Important for Your Health",
      description: "Why Regular Screening is Important? Regular health screenings are a cornerstone of preventive care, ...",
      author: "Sanya Global"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?w=800&h=600&fit=crop",
      title: "Dengue Fever: Symptoms, Prevention, and Treatment",
      description: "Dengue fever poses a significant public health challenge, particularly in tropical and subtropical r...",
      author: "Sanya Global"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
      title: "Understanding Thyroid Problems and Their Management",
      description: "Understanding Thyroid Disorders: Causes, Symptoms, and Treatments. Thyroid disorders are prevalent med...",
      author: "Sanya Global"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-main mb-12 sm:mb-16">
          Our Blogs Related to Health Care
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              image={blog.image}
              title={blog.title}
              description={blog.description}
              author={blog.author}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthBlogSection;