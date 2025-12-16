import { motion } from 'framer-motion';
import processflow from '../../data/processflow';
import './ProcessFlow.css';
import SectionHeading from './SectionHeading';

export default function ProcessFlow() {
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const dotVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 200,
      },
    },
  };

  return (
    <section className="bg-sectiondiv py-16">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading
            center={true}
            // title="Our Process"
            // subtitle="Simple & Transparent"
            // description="From initial consultation to post-treatment care, we guide you through every step of your medical journey"
            title='process'
          />

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical timeline */}
            <motion.div 
              className="absolute left-6 top-0 bottom-0 w-1 bg-blue-200 md:left-1/2 md:-ml-0.5"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {processflow.map((item, index) => (
                <motion.div 
                  key={index} 
                  className={`flex items-center mb-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  variants={itemVariants}
                >
                  {/* Timeline dot */}
                  <motion.div 
                    className="absolute left-4 md:left-1/2 md:-ml-3 w-6 h-6 rounded-full bg-blue-500 border-4 border-white z-10"
                    variants={dotVariants}
                    whileHover={{ scale: 1.2, backgroundColor: "#3b82f6" }}
                  />
                  
                  {/* Content card */}
                  <div className={`ml-12 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                    <motion.div 
                      className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-500"
                      whileHover={{ 
                        y: -5,
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-center mb-3">
                        <motion.div 
                          className="text-2xl mr-3"
                          whileHover={{ rotate: 10, scale: 1.2 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          {item.icon}
                        </motion.div>
                        <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                          {item.step}
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}