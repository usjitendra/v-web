import { motion } from "framer-motion";
import medicwayLogo from "../assets/logo_banne/m1.png"

export default function MedicwayCTA() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 py-10 sm:py-14">
      <div className="relative w-full min-h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden flex items-center"
        style={{ background: "linear-gradient(120deg, #0a3d2e 0%, #0f6e56 45%, #1a5276 100%)" }}
      >

        {/* Background decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[400px] h-[400px] rounded-full border border-white/5 -top-28 right-72" />
          <div className="absolute w-[600px] h-[600px] rounded-full border border-white/[0.03] -bottom-72 right-48" />
          <div className="absolute w-[200px] h-[200px] rounded-full top-[-60px] left-[300px]"
            style={{ background: "rgba(232,120,37,0.12)" }} />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full px-6 sm:px-10 lg:px-14 py-10 sm:py-14 gap-8 lg:gap-6">

          {/* LEFT: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="flex-1 min-w-[260px] text-white"
          >
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 mb-5"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: "#1D9E75" }} />
              <span className="text-[#7de8c4] text-[11px] font-semibold tracking-widest uppercase">
                Your Journey · Our Care · Your Recovery
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-extrabold leading-tight mb-4"
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
              }}
            >
              Your Health Deserves <br />
              The{" "}
              <span style={{ color: "#E87825" }}>World's Best</span> Care
            </h2>

            {/* Subtext */}
            <p className="text-sm leading-relaxed mb-7 max-w-sm"
              style={{ color: "rgba(255,255,255,0.72)" }}
            >
              Connect with top hospitals and specialists across 10+ countries.
              Medicway Care makes world-class treatment accessible, affordable,
              and effortless.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer border-0"
                style={{ background: "#E87825" }}
              >
                Book Free Consultation
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3 rounded-xl text-sm font-medium text-white cursor-pointer"
                style={{
                  background: "transparent",
                  border: "1.5px solid rgba(255,255,255,0.35)",
                }}
              >
                Explore Hospitals
              </motion.button>
            </div>

            {/* Trust numbers */}
            <div className="flex flex-wrap gap-6">
              {[
                { num: "50K+", label: "Patients Served" },
                { num: "500+", label: "Partner Hospitals" },
                { num: "98%",  label: "Satisfaction Rate" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="font-extrabold text-xl text-white"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    {item.num.replace(/[+%K]/, "")}
                    <span style={{ color: "#E87825" }}>
                      {item.num.match(/[+%K]+/)?.[0] ?? ""}
                    </span>
                  </div>
                  <div className="text-[11px] mt-0.5"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Logo image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            animate={{ y: [0, -10, 0] }}
            // framer-motion continuous float
            className="flex-shrink-0 w-full lg:w-[38%] max-w-[380px]"
          >
            <motion.img
              src={medicwayLogo}
              alt="Medicway Care"
              className="w-full h-auto object-contain"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.4))" }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}