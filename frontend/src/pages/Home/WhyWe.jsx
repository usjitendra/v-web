import React, { useEffect } from "react";
import PropTypes from "prop-types";
// import mainImage from "../assets/home/whyweimg.jpeg"; // Use an appropriate image

import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import { FaAward, FaDollarSign, FaRobot, FaHeadset } from 'react-icons/fa'; // Importing React Icons
// import icon1 from '../assets/icon/lab.png'
// import icon2 from '../assets/icon/laboratory.png'
// import icon3 from '../assets/icon/customer-service.png'
// import icon4 from '../assets/icon/best-price.png'

const features = [
  {
    title: "Accuracy",
    amount: "100%",
  },
  {
    title: "Support",
    amount: "24/7",
  },
  {
    title: "Happy Customer",
    amount: "10,000",
  },
];

const FeaturedItem = ({ feature }) => {
  const { title, amount } = feature;
  return (
    <div
      className="bg-slate-800 shadow-lg rounded-xl p-4 flex flex-col items-center justify-center"
      data-aos="fade-up"
    >
      <h4 className="text-3xl sm:text-4xl text-main font-medium">{amount}</h4>
      <h6 className="font-medium  text-white mt-2">{title}</h6>
    </div>
  );
};

FeaturedItem.propTypes = {
  feature: PropTypes.object.isRequired,
};

const WhyWe = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: false,
    });
  }, []);

  return (
    <section className="py-6 sm:py-8 md:py-10 lg:py-6 bg-white text-black relative overflow-hidden ">
      {/* Background Shapes */}
      <div className="ezy__featured55-shape-one absolute left-0 bottom-0 min-w-[20%] h-full bg-main bg-opacity-80 -z-10" />
      <div className="ezy__featured55-shape-two absolute left-[20%] bottom-0 min-w-[25%] h-full bg-main bg-opacity-30 -z-10" />

      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto ">
        <div className="grid grid-cols-12 gap-6 items-center">
          {/* Image Section */}

          <div
            className="col-span-12 sm:col-span-6 order-2 sm:order-1"
            data-aos="fade-right"
          >
            <Link to={"/scan"}>
              <img
                src={"mainImage"}
                alt="Why Choose Us"
                className="w-full max-w-md sm:max-w-sm lg:max-w-full mx-auto rounded-lg text-main"
              />
            </Link>
          </div>

          {/* Content Section */}
          <div
            className="col-span-12 sm:col-span-6 order-1 sm:order-2 text-center sm:text-left"
            data-aos="fade-left"
          >
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mt-6 sm:mt-0 text-main">
              Why Choose Us?
            </h3>
            <p className="text-base sm:text-lg opacity-80 leading-7 my-4 sm:my-6 text-justify">
              aims at achieving the highest level of excellence with quality results. Our labs operate 24x7 and are equipped with fully automated state-of-the-art technology and infrastructure.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

              {/* Center of Excellence */}
              <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 cursor-pointer">
                {/* Icon Section */}
                <div className="w-16 h-16 mb-4 flex items-center justify-center bg-gray-100 rounded-full shadow-md">
                  <img src={"icon1"} alt="Center of Excellence" className="w-12 h-12 object-contain" />
                </div>

                {/* Title Section */}
                <h4 className="text-gray-800 text-lg font-normal text-center">
                  Center of Excellence
                </h4>
              </div>


              {/* Affordable Pricing */}
              <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 cursor-pointer">
                {/* Icon Section */}
                <div className="w-16 h-16 mb-4 flex items-center justify-center bg-gray-100 rounded-full shadow-md">
                  <img src={"icon4"} alt="Center of Excellence" className="w-12 h-12 object-contain" />
                </div>

                {/* Title Section */}
                <h4 className="text-gray-800 text-lg font-normal text-center">
                  Affordable Pricing
                </h4>
              </div>


              {/* Latest Technology */}
              <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 cursor-pointer">
                {/* Icon Section */}
                <div className="w-16 h-16 mb-4 flex items-center justify-center bg-gray-100 rounded-full shadow-md">
                  <img src={"icon2"} alt="Center of Excellence" className="w-12 h-12 object-contain" />
                </div>

                {/* Title Section */}
                <h4 className="text-gray-800 text-lg font-normal text-center">
                  Latest Technology
                </h4>
              </div>




              <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadowborder border-gray-200 cursor-pointer ">
                {/* Icon Section */}
                <div className="w-16 h-16 mb-4 flex items-center justify-center bg-gray-100 rounded-full shadow-md">
                  <img src={"icon3"} alt="Center of Excellence" className="w-12 h-12 object-contain" />
                </div>

                {/* Title Section */}
                <h4 className="text-gray-800 text-lg font-normal text-center">
                  24x7 Support
                </h4>
              </div>


            </div>
          </div>

          {/* Feature Items */}
          <div className="col-span-12 mt-8 sm:mt-12" data-aos="fade-up">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-6 justify-center">
              {features.map((feature, i) => (
                <div
                  className="col-span-3 sm:col-span-2"
                  key={i}
                  data-aos="zoom-in"
                >
                  <FeaturedItem feature={feature} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyWe;
