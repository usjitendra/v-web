
import { motion } from "framer-motion";

export default function ServiceCard({ service, index }) {
  return (
    <div className="col " >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: index * 0.15,
          type: "spring",
          stiffness: 80
        }}
        whileHover={{
          y: -8,
          scale: 1.03,
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
        }}
        className="relative h-full  p-[2px] rounded-2xl bg-gradient-to-tr  from-white to-[#006080]"
      // className=" relative p-[2px] rounded-2xl bg-gradient-to-tr to-[#004080] from-[#808080]"
      // to-green-600 Removed this from classname from-emrald-400 from-[#008080]
      >
        {/* Glassmorphic Card */}
        <div className="bg-white/80 h-full flex items-center gap-4 backdrop-blur-md rounded-2xl p-6 transition-all duration-300">
          <motion.div
            whileHover={{
              rotate: 10,
              scale: 1.2
            }}
            transition={{
              type: "spring",
              stiffness: 200
            }}
            className="text-4xl text-emerald-600"
          >
            {/* {service.icon} */}
            <img
              src={service.icon}
              // src="/uploads/treatments/treatments-1757530455157-82474118.svg"
              // alt={hospital.name}
              className="w-20 h-full object-cover  transition-transform duration-500 group-hover:scale-110"
            />
          </motion.div>
          <div>
            <h3 className="text-md font-semibold text-gray-900">
              {service.title}
            </h3>

            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {service.description}
            </p>

          </div>

        </div>
      </motion.div>
    </div>
  );
}
/* 
made the div flex so that icon and heading/content comes in columns
*/