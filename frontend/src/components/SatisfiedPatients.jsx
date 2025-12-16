const SatisfiedPatients = () => {
  const testimonials = [
    {
      name: "Rohit Sharma",
      feedback:
        "The platform helped me find the best doctor and hospital. The process was smooth and professional!",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Priya Verma",
      feedback:
        "Excellent guidance and support throughout my medical journey. Highly recommend!",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Amit Joshi",
      feedback:
        "Very helpful team and transparent cost estimation. Made my treatment decision easy.",
      image: "https://randomuser.me/api/portraits/men/54.jpg",
    },
    {
      name: "Sneha Kapoor",
      feedback:
        "I felt completely supported during my treatment abroad. Great platform for patients.",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Satisfied Patients
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Hear from patients who trusted our platform to guide them through
          their medical journey.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={t.image}
                alt={t.name}
                className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
              />
              <p className="text-gray-700 text-sm mb-4">"{t.feedback}"</p>
              <h4 className="text-gray-900 font-semibold">{t.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
