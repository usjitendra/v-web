import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
// import bgImage from '../../assets/pattern/pattern12.jpg'
// import TypewriterHeading from "../../component/TypeWriterHeading";

export default function HomeAbout() {
  const navigate = useNavigate();

  return (
    <section>
      <div className=" py-8 sm:py-10 md:py-12  px-4 sm:px-6 lg:px-8 bg-white text-gray-900 relative ">
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            backgroundImage: `url(${"bgImage"})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.4,
            zIndex: -10,
          }}
        ></div>

        <div className="max-w-7xl mx-auto md:text-center text-start">
          {/* Animated Heading */}
          <motion.h2
            className="text-xl md:text-5xl font-extrabold leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Elevating <span className="text-main">Healthcare</span> with Excellence
          </motion.h2>

          <motion.h3
            className="text-md md:text-2xl  text-main font-semibold md:mt-2 tleading-relaxed text-left md:text-center w-full hyphens-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Uttar Pradesh's 1st Largest Diagnostic and Theranostic Centre in Lucknow
          </motion.h3>

          {/* Subheading */}
          <motion.p
   className="text-lg md:text-xl md:mt-5 mt-2 text-gray-700 leading-relaxed text-justify w-full hyphens-auto lg:text-center"

            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="font-semibold text-yellow text-justify lg:text-center">MedicwayCare</span> is committed to connecting patients worldwide with world-class healthcare services. Our platform operates 24x7 and provides access to the best hospitals, doctors, and medical treatments across the globe. With transparent pricing, expert guidance, and comprehensive support, we ensure every patient gets the quality healthcare they deserve.
          </motion.p>

          {/* Features Section */}
          <div className="mt-4 md:mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
            {[
              { title: "🔬 Advanced Imaging", desc: "Digital PET-CT Scan, Digital 3.0 Tesla MRI, 128 Slice CT Scan & AI-Powered Radiology." },
              { title: "🩸 Accurate Pathology", desc: "Diagnostic tests enable early detection and personalized treatment for patients." },
              { title: "❤️ Heart & Brain Scans", desc: "Heart and Brain Scans detect abnormalities, ensuring timely diagnosis and treatment." },
              { "title": "💊 Nuclear Medicine & Therapies", "desc": "Nuclear Medicine utilizes radioactive isotopes for precise diagnostics and targeted therapies, improving patient care and treatment." },

              { 
                "title": "🩺 Fetal Medicine", 
                "desc": "Fetal Medicine Services focus on the health and development of unborn babies, ensuring  care during pregnancy." 
              },
              
              { 
                "title": "🩻 Interventional Radiology", 
                "desc": "Advanced, minimally invasive treatments using precision imaging for accurate diagnosis and care." 
              }
              
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white p-5 rounded-lg shadow-lg border-l-4 border-main"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 * index, duration: 0.5 }}
              >
                <h3 className="text-xl text-[#252424]">{item.title}</h3>
                <p className="text-gray-600 mt-2">{item.desc}</p>
              </motion.div>
            ))}
          </div>

           {/* Call to Action Button */}
        <motion.button
          className="mt-10 bg-yellow text-white text-lg font-semibold rounded-full px-8 py-3 transition-all duration-300 shadow-lg"
          onClick={() => navigate("/about")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Learn More
        </motion.button>

        </div>
      </div>
    </section>
  );
}
