import React, { useEffect } from "react";
import PropTypes from "prop-types";
import AOS from "aos";
import "aos/dist/aos.css";
import { Search, TestTube, CheckCircle } from "lucide-react";

const contents = [
  {
    icon: Search,
    title: "Sample Collection",
    text: "We start by collecting samples in a safe and hygienic manner, ensuring the best quality for testing and analysis.",
  },
  {
    icon: TestTube,
    title: "Testing & Analysis",
    text: "Our lab uses the latest technology to perform accurate and timely diagnostic testing for all types of medical conditions.",
  },
  {
    icon: CheckCircle,
    title: "Results & Consultation",
    text: "Once your pathology reports are ready, our experts offer detailed consultation, helping you understand the findings and plan your next steps for better health.",
  },
];

const ContentItem = ({ item, index }) => (
  <div
    className=" bg-slate-800 shadow-xl rounded-xl flex flex-col justify-center items-center text-center pb-10 lg:pb-24 xl:pb-10 px-6 h-full"
    data-aos="fade-up" // AOS Animation
    data-aos-delay={index * 100} // Add delay based on index
  >
    <div className="w-20 h-20 rounded-full bg-yellow bg-opacity-90 flex items-center justify-center -translate-y-10">
      <h1 className="font-medium text-[40px] text-white">{index}</h1>
    </div>
    <h2 className="text-2xl font-medium text-white">{item.title}</h2>
    {/* <div className="text-[95px] font-medium text-white ">
      <FontAwesomeIcon icon={item.icon} />
    </div> */}
  </div>
);

ContentItem.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

const SpecialContentItem = () => (
  <div
    className="bg-yellow shadow-xl rounded-xl flex flex-col justify-center items-center text-center pb-10 px-6 h-full"
    data-aos="fade-up"
    data-aos-delay="400"
  >
    <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center -translate-y-10 text-white">
      <h1 className="font-medium text-[40px] text-white">4</h1>
    </div>
    <h2 className="text-gray-800 text-2xl font-medium grow">Delivery</h2>
    <p className="text-gray-800 leading-relaxed grow opacity-75 ">
      Once your pathology reports are ready, our experts offer detailed consultation, helping you understand.
    </p>
  </div>
);

const HowItWorks = () => {
  useEffect(() => {
    AOS.init({
      duration: 800, // Animation duration in milliseconds
      easing: "ease-in-out", // Easing type
      once: true, // Run animation only once
    });
  }, []);

  return (
    <section className="py-8 sm:py-10 md:py-12 lg:py-10 bg-gray-100">
      <div className="max-w-7xl px-4 lg:px-6 mx-auto">
        <div
          className="flex flex-col max-w-xl justify-center md:items-center md:text-center px-4 mx-auto"
          data-aos="fade-in"
        >
          <h3 className="mb-2 md:text-3xl text-2xl text-main ">How We Work</h3>
          <p className=" opacity-80 mb-2">
          We offer exceptional customer support and foster long-lasting relationships with our clients for a truly personalized experience
          </p>
        </div>

        <div className="grid grid-cols-4  gap-6 gap-y-16 mt-16 lg:gap-y-0 lg:mt-12">
          {contents.map((item, i) => (
            <div className="col-span-2 sm:col-span-2 lg:col-span-1" key={i}>
              <ContentItem index={i + 1} item={item} />
            </div>
          ))}

          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <SpecialContentItem />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
