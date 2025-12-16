import { motion } from "framer-motion";

export default function ProcedureCostCard({ service, index }) {



  const WhatsAppSectionButton = (service) => {
    // Replace with your actual WhatsApp number in international format (without +)
    const phoneNumber = '919555447404';

    // Message that will be pre-filled (optional)
    const message = `Hello! I have a question about your ${service} procedure`;

    // Create the WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  }
  return (
    <div className="col">
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
          boxShadow: "0 15px 40px rgba(0, 96, 128, 0.2)",
        }}
        className="relative p-[2px] rounded-2xl bg-gradient-to-tr from-white to-[#006080]"
      >
        {/* Glassmorphic Card */}
        <div className="bg-white/90 flex items-center gap-4 backdrop-blur-md rounded-2xl p-5 transition-all duration-300 h-full">
          {/* Icon Container */}
          <motion.div
            whileHover={{
              rotate: 10,
              scale: 1.2
            }}
            transition={{
              type: "spring",
              stiffness: 200
            }}
            className="flex-shrink-0 w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center"
          >
            <img
              src={service.icon}
              alt={service.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </motion.div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {service.title}
            </h3>

            <div className="flex items-center justify-between mt-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Starting from</p>
                <p className="text-xl font-bold text-teal-700">
                  ${service.basePrice}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors shadow-md"
                onClick={() => WhatsAppSectionButton(service.title)}
              >


                Get Quote

              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}