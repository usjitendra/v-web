import { useEffect, useState } from "react";
import {
  FaBed,
  FaCalendarCheck,
  FaCar,
  FaHeadset,
  FaLanguage,
  FaMoneyBillWave,
  FaPassport,
  FaPlane,
  FaUserMd,
  FaUserNurse,
} from "react-icons/fa";

import url_prefix from "../../data/variable";
import { useLanguage } from '../../hooks/useLanguage';
import SectionHeading from "./SectionHeading";


// Icon mapping
const iconComponents = {
  FaUserMd,
  FaPlane,
  FaPassport,
  FaMoneyBillWave,
  FaLanguage,
  FaCar,
  FaBed,
  FaCalendarCheck,
  FaUserNurse,
};

const OurServices = () => {
  const [language] = useLanguage();
  const [headings, setHeadings] = useState({
    'title': 'Not Available For Selected Language',
    'sub': '',
    'desc': ''
  });

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch assistance services from API
  useEffect(() => {
    if (!language) {
      console.log('Language not yet available, skipping fetch');
      return;
    }

    const fetchAssistance = async () => {
      try {
        const response = await fetch(url_prefix + "/api/assistance");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Invalid API response structure");
        }
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
            console.log('Setting aboutData:', dataToSet);
            setServices(dataToSet);
            setError(null);
            setHeadings({
              title: dataToSet[0].htitle,
              sub: dataToSet[0].hsubtitle,
              desc: dataToSet[0].hdesc
            })
          }
        }

      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssistance();
  }, [language]);

  // Loading state
  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-darktext mb-4">
              Our Services Cover{" "}
              <span className="text-primary">Every Need</span>
            </h2>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-darktext mb-4">
              Our Services Cover{" "}
              <span className="text-primary">Every Need</span>
            </h2>
          </div>
          <div className="text-center text-red-600 py-8">
            <p>Error loading services: {error}</p>
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

  // No services found
  if (services.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-darktext mb-4">
              Our Services Cover{" "}
              <span className="text-primary">Every Need</span>
            </h2>
          </div>
          <div className="text-center text-gray-500 py-8">
            <p>No assistance services found.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          {/* <h2 className="text-3xl md:text-4xl font-bold text-darktext mb-4">
            Our Services Cover <span className="text-primary">Every Need</span>
          </h2>
          <p className="text-lg text-lighttext max-w-3xl mx-auto mb-6">
            You will be assisted by a dedicated case manager from our team. List
            of services you can expect from us, for{" "}
            <span className="text-primary font-semibold">FREE!</span>
          </p>
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <FaHeadset className="mr-2" />
            <span className="font-semibold">
              Dedicated Case Manager Included
            </span>
          </div> */}
          <SectionHeading
            // title={headings.title}
            // subtitle={headings.sub}
            // description={headings.desc}
            title='service'
          />
        </div>


        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const IconComponent = iconComponents[service.icon];
            return (
              <div
                key={service._id}
                className="bg-white rounded-xl p-6 shadow-smooth hover:shadow-lg transition-all duration-300 border border-blue-50"
              >
                <div className="flex items-start mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    {IconComponent ? (
                      <IconComponent className="text-2xl text-teal-600" />
                    ) : (
                      <FaHeadset className="text-2xl text-teal-600" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-darktext">
                    {service.title}
                  </h3>
                </div>
                <p className="text-lighttext">{service.description}</p>
              </div>
            );
          })}
        </div>

        {/* Free Service Note */}
        <div className="text-center mt-12 bg-primary/5 rounded-2xl p-6 border border-primary/20">
          <h4 className="text-2xl font-semibold text-primary mb-2">
            All Services Included at No Extra Cost
          </h4>
          <p className="text-lighttext">
            These comprehensive services are provided free of charge when you
            choose our medical care coordination.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurServices;
