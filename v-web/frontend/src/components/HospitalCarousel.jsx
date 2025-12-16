import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import url_prefix from "../data/variable";
import { useLanguage } from '../hooks/useLanguage';
import HospitalCard from './HospitalCard';

const HospitalCarousel = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language] = useLanguage();
  const [headings, setHeadings] = useState({
    heading: 'Not Available For Selected Language',
    subheading: '',
    description: ''
  });

  // Fetch hospitals and headings data from API
  useEffect(() => {
    if (!language) {
      console.log('Language not yet available, skipping fetch');
      return;
    }

    const fetchHeadings = async () => {
      try {
        const response = await fetch(`${url_prefix}/api/headings/hospital/${language}`);
        const result = await response.json();
        if (result.success) {
          setHeadings(result.data.home[0]); // Fetch headings for 'home' type
        }
      } catch (error) {
        console.error('Error fetching headings:', error);
      }
    };

    const fetchHospitals = async () => {
      try {
        const response = await fetch(`${url_prefix}/api/hospitals/all`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
          let dataToSet;
          if (Array.isArray(result.data)) {
            dataToSet = result.data.filter(
              item => item.language?.toLowerCase() === language?.toLowerCase()
            );
          } else {
            dataToSet =
              result.data.language?.toLowerCase() === language?.toLowerCase()
                ? [result.data]
                : [];
          }

          if (dataToSet.length > 0) {
            console.log('Setting hospitals:', dataToSet);
            setHospitals(dataToSet);
            setError(null);
          }
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setHospitals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHeadings();
    fetchHospitals();
  }, [language]);

  // Group hospitals by country
  const countryGroups = hospitals.reduce((acc, hospital) => {
    acc[hospital.country] = acc[hospital.country] || [];
    acc[hospital.country].push(hospital);
    return acc;
  }, {});

  const countryNames = Object.keys(countryGroups);
  const [currentCountryIndex, setCurrentCountryIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const selectCountry = (index) => {
    setDirection(index > currentCountryIndex ? 1 : -1);
    setCurrentCountryIndex(index);
  };

  // Container animation variants for the carousel
  const containerVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      y: 50,
    }),
    center: {
      x: 0,
      opacity: 1,
      y: 0,
      transition: {
        x: { type: "spring", stiffness: 120, damping: 15 },
        opacity: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
        y: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      y: -50,
      transition: {
        x: { type: "spring", stiffness: 120, damping: 15 },
        opacity: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
        y: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
      },
    }),
  };

  // Item animation variants for individual hospital cards
  const itemVariants = {
    enter: {
      opacity: 0,
      y: 20,
      scale: 0.9,
    },
    center: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
        y: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
        scale: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.9,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  // Loading state
  if (loading) {
    return (
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-darktext mb-4">
              {headings.heading}
            </h2>
            {headings.subheading && (
              <h3 className="text-xl md:text-2xl font-semibold text-primary mb-3">
                {headings.subheading}
              </h3>
            )}
            {headings.description && (
              <p className="text-lg text-lighttext max-w-3xl mx-auto">
                {headings.description}
              </p>
            )}
          </div>
          <div className="flex justify-center mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-darktext mb-4">
              {headings.heading}
            </h2>
            {headings.subheading && (
              <h3 className="text-xl md:text-2xl font-semibold text-primary mb-3">
                {headings.subheading}
              </h3>
            )}
            {headings.description && (
              <p className="text-lg text-lighttext max-w-3xl mx-auto">
                {headings.description}
              </p>
            )}
          </div>
          <div className="text-center text-red-600 py-8">
            <p>Error loading hospitals: {error}</p>
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

  // No hospitals found
  if (hospitals.length === 0) {
    return (
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-darktext mb-4">
              {headings.heading}
            </h2>
            {headings.subheading && (
              <h3 className="text-xl md:text-2xl font-semibold text-primary mb-3">
                {headings.subheading}
              </h3>
            )}
            {headings.description && (
              <p className="text-lg text-lighttext max-w-3xl mx-auto">
                {headings.description}
              </p>
            )}
          </div>
          <div className="text-center text-gray-500 py-8">
            <p>No hospitals found.</p>
          </div>
        </div>
      </section>
    );
  }

  const currentCountry = countryNames[currentCountryIndex];
  const currentHospitals = countryGroups[currentCountry] || [];

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-darktext mb-4">
            {headings.heading}
          </h2>
          {headings.subheading && (
            <h3 className="text-xl md:text-2xl font-semibold text-primary mb-3">
              {headings.subheading}
            </h3>
          )}
          {headings.description && (
            <p className="text-lg text-lighttext max-w-3xl mx-auto">
              {headings.description}
            </p>
          )}
        </div>

        {/* Country tabs */}
        <div className="flex justify-center mb-8 border-b border-gray-200">
          <div className="flex space-x-1">
            {countryNames.map((country, index) => (
              <button
                key={country}
                onClick={() => selectCountry(index)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${index === currentCountryIndex
                  ? 'bg-[#008080] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {country}
              </button>
            ))}
          </div>
        </div>

        {/* Animated hospital cards */}
        <div className="relative bg-sectiondiv p-10 rounded-lg min-h-[400px]">
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={currentCountryIndex}
              custom={direction}
              variants={containerVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {currentHospitals.map((hospital) => (
                <motion.div
                  key={hospital._id}
                  variants={itemVariants}
                >
                  <HospitalCard hospital={hospital} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default HospitalCarousel;