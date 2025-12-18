import { motion } from "framer-motion";
import { Hammer } from "lucide-react";

export default function WorkInProgress() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600 text-red-100 mb-6"
        >
          <Hammer className="w-8 h-8" />
        </motion.div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Work in Progress
        </h1>
        <p className="text-gray-500 text-sm">
          We’re currently building this feature. Please check back soon.
        </p>
      </motion.div>
    </div>
  );
}
