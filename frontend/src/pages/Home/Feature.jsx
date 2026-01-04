import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
// import backgroundImage from '../../assets/pattern/pattern1.png';
// import image from '../../assets/pattern/feabg.jpg';

const Feature = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Animation happens only once
    });
  }, []);

  return (
      <section className="bg-gray-100  relative py-8 sm:py-10 md:py-12">
      <div
    className="absolute"
    style={{
      backgroundImage: `url(${"backgroundImage"})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.2,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1, // Ensuring the background is behind content
    }}
  ></div>

        <div className="max-w-7xl px-6  sm:py-10 mx-auto  lg:px-8">
          <div className="lg:flex lg:items-center">
            <div className="w-full space-y-6 lg:w-1/2 ">
              <div>
                <h3 className='mb-4 text-main'>Our Features</h3>
                <h2 className="text-2xl font-semibold  capitalize lg:text-3xl">
                Uncover top-tier diagnostic services in Lucknow, providing cutting-edge technology and expert care for your health journey
                </h2>
                <div className="mt-2">
                  <span className="inline-block w-40 h-1 bg-main rounded-full"></span>
                  <span className="inline-block w-3 h-1 ml-1 bg-main  rounded-full"></span>
                  <span className="inline-block w-1 h-1 ml-1 bg-main  rounded-full"></span>
                </div>
              </div>

              {/* First Point */}
              <div data-aos="fade-up" className="md:flex md:items-start md:-mx-4">
              <span className="inline-block p-2 text-white  rounded-xl md:mx-4 bg-main">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </span>
                <div className="mt-4 md:mx-4 md:mt-0">
                  <h1 className="text-xl font-semibold text-main capitalize ">
                    Comprehensive Diagnostics
                  </h1>
                  <p className="mt-1 text-black dark:text-black">
                    From routine blood tests to advanced imaging, we offer a wide range of diagnostic solutions tailored to meet your healthcare needs.
                  </p>
                </div>
              </div>

              {/* Second Point */}
              <div data-aos="fade-up" data-aos-delay="200" className="md:flex md:items-start md:-mx-4">
              <span className="inline-block p-2 text-white  rounded-xl md:mx-4 bg-main">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                </span>
                <div className="mt-4 md:mx-4 md:mt-0">
                  <h1 className="text-xl font-semibold text-gray-700 capitalize dark:text-main">
                    Advanced Equipment
                  </h1>
                  <p className="mt-1 text-black dark:text-black">
                    Equipped with state-of-the-art technology, our lab ensures precise and reliable test results every time.
                  </p>
                </div>
              </div>

              {/* Third Point */}
              <div data-aos="fade-up" data-aos-delay="400" className="md:flex md:items-start md:-mx-4">
                <span className="inline-block p-2 text-white  rounded-xl md:mx-4 bg-main">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </span>
                <div className="mt-4 md:mx-4 md:mt-0">
                  <h1 className="text-xl font-semibold text-gray-700 capitalize dark:text-main">
                    24x7 Availability
                  </h1>
                  <p className="mt-1 text-black dark:text-black">
                    We are operational round-the-clock, ensuring that you get the diagnostic support you need, anytime.
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex lg:items-center lg:w-1/2 lg:justify-center">
              <img
                className="w-[28rem] h-[28rem] object-cover xl:w-[34rem] xl:h-[34rem] rounded-full"
                src={"image"}
                alt="Pathology services"
              />
            </div>
          </div>
        </div>
      </section>

  );
};

export default Feature;
