import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaChevronDown, FaQuestionCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import url_prefix from "../../data/variable";
import { useLanguage } from '../../hooks/useLanguage';
import "./FAQ.css";

// Static FAQ Data
const staticFaqData = [
  {
    _id: "1",
    question: "What services do you offer?",
    answer: "We offer comprehensive medical treatment services including consultations, diagnostics, treatment planning, and post-treatment care coordination."
  },
  {
    _id: "2",
    question: "How do I book an appointment?",
    answer: "You can book an appointment through our website by clicking the 'Book Now' button, or by contacting our care coordinators directly via phone or email."
  },
  {
    _id: "3",
    question: "What are your operating hours?",
    answer: "Our care coordinators are available 24/7 to assist you with any questions or concerns you may have about your medical journey."
  },
  {
    _id: "4",
    question: "Do you accept insurance?",
    answer: "Yes, we accept most major insurance providers. Please contact us with your insurance details for verification and coverage information."
  },
  {
    _id: "5",
    question: "How long does the treatment process take?",
    answer: "Treatment duration varies depending on the specific procedure and individual circumstances. Our team will provide you with a detailed timeline during your consultation."
  },
  {
    _id: "6",
    question: "What should I bring to my first appointment?",
    answer: "Please bring a valid ID, insurance information, list of current medications, and any relevant medical records or test results from previous treatments."
  }
];

const FAQ = () => {

  const [activeIndex, setActiveIndex] = useState(null);
  const [faqData, setFaqData] = useState(staticFaqData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const [language] = useLanguage();
  const [headings, setHeadings] = useState({
    heading: "Frequently Asked Questions",
    subheading: "Find answers to common questions about our medical treatment process",
    h1: 'Still have questions?',
    h2: 'Our care coordinators are available 24/7 to answer any questions you may have about your medical journey.',
    h3: 'Contact Us Now',
    h4: 'Request a Call Back'
  });


  // Fetch headings from API (keeping this dynamic as per your code)
  useEffect(() => {

    if (!language) {
      console.log('Language not yet available, skipping fetch');
      return;
    }

    const fetchHeadings = async () => {
      try {
        const response = await fetch(
          `${url_prefix}/api/headings/FAQs/${language}`
        );
        const result = await response.json();
        if (result.success) {
          console.log('reslut', result.data.detailPage.headings[0]['text'])
          setHeadings({
            heading: result.data.home[0]?.heading,
            subheading:
              result.data.home[0]?.description,
            h1: result.data.detailPage?.headings[0]['text'],
            h2: result.data.detailPage?.headings[1]['text'],
            h3: result.data.detailPage?.headings[2]['text'],
            h4: result.data.detailPage?.headings[3]['text']

          });
        }
      } catch (error) {
        console.error("Error fetching headings:", error);
        // Keep default headings if fetch fails
      }
    };

    fetchHeadings();
    console.log('heading', headings)
    
    // Set static FAQ data and loading to false
    setFaqData(staticFaqData);
    setLoading(false);
  }, [language]);



  // Split FAQ data into two columns
  const leftColumn = faqData.slice(0, Math.ceil(faqData.length / 2));
  const rightColumn = faqData.slice(Math.ceil(faqData.length / 2));

  // Loading state
  if (loading) {
    return (
      <section className="faq-section bg-gray-100 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FaQuestionCircle className="text-teal-600 text-2xl" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Frequently Asked <span className="text-teal-600">Questions</span>
            </h2>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="faq-section bg-gray-100 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Frequently Asked <span className="text-teal-600">Questions</span>
            </h2>
          </div>
          <div className="text-center text-red-600 py-8">
            <p>Error loading FAQs: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // No FAQs found
  if (faqData.length === 0) {
    return (
      <section className="faq-section bg-gray-100 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              {/* Frequently Asked <span className="text-teal-600">Questions</span> */}
              {headings.heading}
            </h2>
          </div>
          <div className="text-center text-gray-500 py-8">
            <p>No FAQs found.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="faq-section bg-gray-100 py-16 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100/30 rounded-full -translate-x-16 -translate-y-16"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-100/30 rounded-full translate-x-20 translate-y-20"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FaQuestionCircle className="text-teal-600 text-2xl" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            {/* Frequently Asked <span className="text-teal-600">Questions</span> */}
            {headings.heading}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {/* Find answers to common questions about our medical treatment process */}
            {headings.subheading}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Left Column */}
          <div className="space-y-4">
            {leftColumn.map((faq, index) => (
              <FAQItem
                key={faq._id}
                faq={faq}
                index={index}
                isActive={activeIndex === index}
                onClick={() => toggleFAQ(index)}
              />
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {rightColumn.map((faq, index) => (
              <FAQItem
                key={faq._id}
                faq={faq}
                index={index + leftColumn.length}
                isActive={activeIndex === index + leftColumn.length}
                onClick={() => toggleFAQ(index + leftColumn.length)}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-12 bg-sectiondiv rounded-2xl p-8 border border-blue-100"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            {/* Still have questions? */}
            {headings.h1}
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {/* Our care coordinators are available 24/7 to answer any questions you
            may have about your medical journey. */}
            {headings.h2}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#008080] hover:bg-[#006080] text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300" onClick={() => navigate('/book')}>
              {/* Contact Us Now */}
              {headings.h3}
            </button>
            <button className="border border-[#008080] text-[#008080] hover:bg-blue-50 font-medium py-3 px-6 rounded-lg transition-colors duration-300" onClick={() => navigate('/book')}>
              {/* Request a Call Back */}
              {headings.h4}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// FAQ Item Component
const FAQItem = ({ faq, index, isActive, onClick }) => {

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-blue-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <button
        className="flex justify-between items-center w-full p-5 text-left focus:outline-none"
        onClick={onClick}
        aria-expanded={isActive}
      >
        <h3 className="text-lg font-semibold text-gray-800 pr-4">
          {faq.question}
        </h3>
        <motion.div
          animate={{ rotate: isActive ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <FaChevronDown className="text-blue-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: { duration: 0.3 },
                opacity: { duration: 0.4, delay: 0.1 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.3 },
                opacity: { duration: 0.2 },
              },
            }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-gray-600">{faq.answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FAQ;