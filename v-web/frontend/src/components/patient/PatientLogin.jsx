
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaEnvelope, FaLock, FaUserMd } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import url_prefix from "../../data/variable";

const PatientLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("patientToken");
    if (token) {
      navigate("/patient/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${url_prefix}/api/patients/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("patientToken", result.token);
        localStorage.setItem("patientData", JSON.stringify(result.data));
        navigate("/patient/dashboard");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl w-full bg-white rounded-2xl shadow-xl flex overflow-hidden"
      >
        {/* Illustration Section */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-teal-600 to-teal-400 items-center justify-center p-8 relative">
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center text-white"
          >
            <FaUserMd className="text-7xl mb-4 mx-auto" />
            <h2 className="text-3xl font-bold">Welcome Back!</h2>
            <p className="mt-3 text-lg opacity-90">
              Login to access your patient dashboard, connect with doctors, and
              manage your appointments.
            </p>
          </motion.div>
          {/* Decorative Circle */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-teal-300 opacity-20 rounded-full blur-3xl"></div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-2xl font-bold text-center text-teal-700 mb-6"
          >
            Patient Login
          </motion.h2>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <FaLock className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-500 text-white py-3 rounded-lg shadow-md font-semibold hover:from-teal-700 hover:to-teal-600 transition-all disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          {/* Links */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Don&apos;t have an account?{" "}
              <Link
                to="/patient/register"
                className="text-teal-600 font-semibold hover:underline"
              >
                Register here
              </Link>

            </p>
            <Link
              to="/admin"
              className="text-teal-600 font-semibold hover:underline"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PatientLogin;
