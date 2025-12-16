import React from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";

export default function Stats() {
  const stats = [
    { label: "Doctors", end: 320 },
    { label: "Hospitals", end: 85 },
    { label: "Appointments", end: 12034 },
  ];
  return (
    <section className="py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            key={s.label}
            className="bg-white p-6 rounded-xl text-center shadow-sm"
          >
            <div className="text-3xl font-bold text-primary">
              <CountUp end={s.end} duration={2.2} separator="," />
            </div>
            <p className="mt-2 text-lighttext">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
