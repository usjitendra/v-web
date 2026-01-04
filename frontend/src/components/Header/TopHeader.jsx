import React, { useEffect, useState } from 'react';
// import logo from '../assets/logo/shanyalogo.png';
import { FaShoppingCart, FaPlus } from 'react-icons/fa';
import { IoMdLogIn } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { AiOutlineClose } from 'react-icons/ai';
import Sidebar from './SideBar';

const TopHeader = () => {
  const [openSideBar, setOpenSideBar] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  /* =====================
     STATIC DATA
     ===================== */

  const [packageData] = useState([
    { packageName: 'Full Body Checkup', packageRate: 1999 },
    { packageName: 'Diabetes Package', packageRate: 999 },
  ]);

  const [serviceData] = useState([
    { testName: 'X-Ray', testPrice: 500 },
    { testName: 'CT Scan', testPrice: 2500 },
  ]);

  const [cartData, setCartData] = useState([]);
  const [numberOfCart, setNumberOfCart] = useState(0);

  const navigate = useNavigate();

  const handleSideBar = () => {
    setOpenSideBar(!openSideBar);
  };

  /* =====================
     CART FUNCTIONS
     ===================== */

  const toggleCartSidebar = () => {
    setIsOpen(!isOpen);
  };

  const removeItemFromCart = (itemId) => {
    const updatedCart = cartData.filter(
      (item) => (item.testName || item.packageName) !== itemId
    );
    setCartData(updatedCart);
    setNumberOfCart(updatedCart.length);
  };

  const calculateTotal = () => {
    return cartData.reduce(
      (total, item) =>
        total + (item.packageRate || item.testPrice) * item.quantity,
      0
    );
  };

  const processCheckout = () => {
    if (cartData.length === 0) return;

    const checkoutData = cartData.map((data) => ({
      name: data.packageName || data.testName,
      rate: data.packageRate || data.testPrice,
      quantity: data.quantity,
      orderType: data.packageName ? "package" : "scan",
      category: data.packageName || data.testName,
    }));

    toggleCartSidebar();
    navigate("/scan/checkout", { state: checkoutData });
  };

  /* =====================
     LOCAL STORAGE SYNC
     ===================== */

  useEffect(() => {
    localStorage.setItem("cartData", JSON.stringify(cartData));
    localStorage.setItem("numberOfCart", JSON.stringify(numberOfCart));
  }, [cartData, numberOfCart]);

  return (
    <div className="flex flex-row lg:z-40 items-center justify-between gap-6 sm:px-20 lg:px-10 px-4 py-0 border-b bg-white h-fit w-full">

      {/* Logo */}
      <Link to="/">
        <img src={"logo"} alt="Logo" className="w-[14rem] lg:h-[5rem] object-contain h-auto" />
      </Link>

      {/* Mobile Icons */}
      <div className="flex items-center gap-4">
        <div className="relative cursor-pointer" onClick={toggleCartSidebar}>
          <FaShoppingCart className="text-2xl" />
          {numberOfCart > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 text-xs flex items-center justify-center rounded-full">
              {numberOfCart}
            </span>
          )}
        </div>

        <Link>
          <div className="flex items-center bg-prime px-2 py-1 rounded-full">
            <IoMdLogIn className="text-white text-xl" />
            <span className="text-sm font-semibold ml-2 text-white">Login</span>
            <FaPlus className="text-white text-xl ml-2" />
          </div>
        </Link>

        <button className="lg:hidden" onClick={handleSideBar}>
          {!openSideBar ? (
            <svg className="w-7 h-7" fill="#000" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 5h14v2H3V5zm0 4h14v2H3v-2zm0 4h14v2H3v-2z"
              />
            </svg>
          ) : (
            <AiOutlineClose className="text-xl" />
          )}
        </button>
      </div>

      {openSideBar && <Sidebar handleSideBar={handleSideBar} />}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleCartSidebar}
        />
      )}

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg w-96 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex justify-between border-b">
            <h2 className="text-xl font-semibold">My Cart</h2>
            <button onClick={toggleCartSidebar}>✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cartData.length === 0 ? (
              <p className="text-center text-gray-500">Your cart is empty.</p>
            ) : (
              cartData.map((item, index) => (
                <div key={index} className="flex justify-between border-b pb-2">
                  <div>
                    <p className="font-semibold">
                      {item.packageName || item.testName}
                    </p>
                    <p>₹{item.packageRate || item.testPrice}</p>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <button
                    className="text-red-500"
                    onClick={() =>
                      removeItemFromCart(item.packageName || item.testName)
                    }
                  >
                    <MdDelete className="text-2xl" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t">
            <p className="text-lg font-semibold">
              Total: ₹{calculateTotal()}
            </p>
            <button
              className="bg-main text-white px-4 py-2 rounded-md mt-4 w-full"
              onClick={processCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
