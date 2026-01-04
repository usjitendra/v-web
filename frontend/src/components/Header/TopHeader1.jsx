import React, { useEffect, useState } from 'react';
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaCartArrowDown,
  FaPlus
} from 'react-icons/fa';
import { FaSquareThreads } from "react-icons/fa6";
import { BsPhone, BsTwitterX } from "react-icons/bs";
import { Link, useNavigate } from 'react-router-dom';
import { IoMdArrowDropdown, IoMdLogIn } from 'react-icons/io';

const TopHeader1 = () => {
  /* ===============================
     STATIC SOCIAL LINKS
     =============================== */
  const socialLinks = [
    { icon: <FaFacebookF />, url: "#", color: "bg-blue-600" },
    { icon: <FaInstagram />, url: "#", color: "bg-gradient-to-r from-pink-500 to-yellow-500" },
    { icon: <FaYoutube />, url: "#", color: "bg-red-600" },
    { icon: <FaLinkedin />, url: "#", color: "bg-[#007BB6]" },
    { icon: <FaSquareThreads />, url: "#", color: "bg-black" },
    { icon: <BsTwitterX />, url: "#", color: "bg-[#141414]" },
  ];

  /* ===============================
     STATIC DATA
     =============================== */
  const [packageData] = useState([
    { packageName: "Full Body Checkup", packageRate: 1999, quantity: 1 },
  ]);

  const [serviceData] = useState([
    { testName: "X-Ray", testPrice: 500, quantity: 1 },
  ]);

  /* ===============================
     CART STATE
     =============================== */
  const [cartData, setCartData] = useState([]);
  const [numberOfCart, setNumberOfCart] = useState(0);

  /* ===============================
     LOGIN STATE (STATIC)
     =============================== */
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState({ name: "User" });
  const [isModel, setModel] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [spinLoading, setSpinloading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();

  /* ===============================
     CART FUNCTIONS
     =============================== */
  const toggleCartSidebar = () => {
    // UI only, sidebar handled elsewhere
  };

  const calculateTotal = () => {
    return cartData.reduce(
      (total, item) =>
        total + (item.packageRate || item.testPrice) * item.quantity,
      0
    );
  };

  const processCheckout = () => {
    if (!cartData.length) return;

    const checkoutData = cartData.map(item => ({
      itemName: item.packageName || item.testName,
      itemRate: item.packageRate || item.testPrice,
      itemQuantity: item.quantity,
      itemType: item.packageName ? "Package" : "Test",
    }));

    navigate(`/checkout`, { state: { checkoutData } });
  };

  /* ===============================
     LOGIN HANDLERS (STATIC)
     =============================== */
  const handleLogin = () => {
    if (!email) return alert("Enter email");
    setSpinloading(true);
    setTimeout(() => {
      setOtpSent(true);
      setSpinloading(false);
    }, 800);
  };

  const handleVerifyOtp = () => {
    if (!otp) return alert("Enter OTP");
    setSpinloading(true);
    setTimeout(() => {
      setIsLogin(true);
      setUserData({ name: email.split("@")[0] });
      setModel(false);
      setSpinloading(false);
    }, 800);
  };

  const handleLogout = () => {
    setIsLogin(false);
    setUserData({});
    setIsDropdownOpen(false);
    navigate("/");
  };

  /* ===============================
     LOCAL STORAGE SYNC
     =============================== */
  useEffect(() => {
    localStorage.setItem("cartData", JSON.stringify(cartData));
    localStorage.setItem("numberOfCart", numberOfCart);
  }, [cartData, numberOfCart]);

  return (
    <div className="bg-prime text-white py-0 xl:py-1 shadow-lg z-50">
      <div className="max-w-full mx-auto flex flex-col lg:flex-row lg:justify-between px-10 py-2 xl:py-0 items-center gap-2 container">

        {/* Contact */}
        <div className="flex items-center gap-2">
          <BsPhone className="text-white" />
          <span className="text-sm">Toll Free No: 18001234187</span>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-10">

          <div className="lg:flex hidden gap-6">
            <Link to="/gallery" className="underline">Gallery</Link>
            <Link to="/review" className="underline">Reviews</Link>
            <Link to="/carrer" className="underline">Career</Link>
            <Link to="/blog" className="underline">Blog</Link>
          </div>

          <div className="flex items-center gap-4">

            <Link to="/book-home-collection">
              <div className="flex items-center bg-gradient-to-r from-[#f9e666] to-[#fcb045] px-4 py-1 rounded-full">
                <span className="text-sm font-semibold text-gray-800">Home Collection</span>
                <FaPlus className="text-gray-800 ml-2" />
              </div>
            </Link>

            {!isLogin ? (
              <div
                className="flex items-center px-4 py-1 rounded-full cursor-pointer bg-gradient-to-r from-[#f9e666] to-[#fcb045]"
                onClick={() => setModel(true)}
              >
                <IoMdLogIn className="text-gray-800 text-xl" />
                <span className="ml-2 text-gray-800">Login</span>
              </div>
            ) : (
              <div className="relative">
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="cursor-pointer flex items-center"
                >
                  Welcome {userData?.name}
                  <IoMdArrowDropdown />
                </div>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white text-black rounded shadow w-40">
                    <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-200">
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="relative cursor-pointer">
              <FaCartArrowDown className="text-white text-2xl" />
              {numberOfCart > 0 && (
                <div className="absolute -top-2 right-0 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                  {numberOfCart}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* LOGIN MODAL (UI UNCHANGED) */}
      {isModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl w-[30rem] relative z-50">
            <button className="absolute top-3 right-3" onClick={() => setModel(false)}>❌</button>
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

            {!otpSent ? (
              <>
                <input
                  className="w-full p-3 border rounded"
                  placeholder="Enter Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <button
                  className="w-full mt-4 bg-orange-500 text-white py-2 rounded"
                  onClick={handleLogin}
                >
                  {spinLoading ? "Processing..." : "Continue"}
                </button>
              </>
            ) : (
              <>
                <input
                  className="w-full p-3 border rounded"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                />
                <button
                  className="w-full mt-4 bg-green-500 text-white py-2 rounded"
                  onClick={handleVerifyOtp}
                >
                  {spinLoading ? "Verifying..." : "Verify OTP"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopHeader1;
