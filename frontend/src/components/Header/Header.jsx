import React, { useEffect, useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate } from 'react-router-dom';
// import logo from '../assets/logo/Shanya.png'
import TopHeader from './TopHeader';
import Sidebar from './SideBar';
import { AiOutlineClose } from "react-icons/ai";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSideBar, setOpenSideBar] = useState(false);

  /* ===============================
     STATIC DATA (API REPLACEMENT)
     =============================== */

  const [packageData] = useState([
    {
      packageName: "Full Body Checkup",
      packageRate: 1999,
      quantity: 1,
    },
    {
      packageName: "Heart Care Package",
      packageRate: 1499,
      quantity: 1,
    },
  ]);

  const [serviceData] = useState([
    {
      testName: "X-Ray",
      testPrice: 500,
      quantity: 1,
    },
    {
      testName: "CT Scan",
      testPrice: 2500,
      quantity: 1,
    },
  ]);

  /* ===============================
     CART STATE (STATIC)
     =============================== */

  const [cartData, setCartData] = useState([]);
  const [numberOfCart, setNumberOfCart] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  /* ===============================
     HANDLERS (UNCHANGED LOGIC)
     =============================== */

  const handleSideBar = () => {
    setOpenSideBar(!openSideBar);
  };

  const toggleCartSidebar = () => {
    setIsOpen(!isOpen);
  };

  const removeItemFromCart = (itemId) => {
    const updatedCart = cartData.filter(
      (item) => (item.packageName || item.testName) !== itemId
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
      itemName: data.packageName || data.testName,
      itemRate: data.packageRate || data.testPrice,
      itemQuantity: data.quantity,
      itemType: data.packageName ? "Package" : "Test",
    }));

    toggleCartSidebar();
    navigate(`/checkout`, { state: { checkoutData } });
  };

  /* ===============================
     LOCAL STORAGE SYNC
     =============================== */

  useEffect(() => {
    localStorage.setItem("cartData", JSON.stringify(cartData));
    localStorage.setItem("numberOfCart", JSON.stringify(numberOfCart));
  }, [cartData, numberOfCart]);

  return (
    <div>
      <header className="shadow-md bg-white font-[sans-serif] tracking-wide relative z-30">

        {/* Sidebar */}
        {openSideBar && <Sidebar />}

        <div className="flex">
          {/* Top Header */}
          <TopHeader />

          {/* Mobile Toggle */}
          <div id="toggleOpen" className="ml-auto mr-2 hidden border border-red-500">
            <button onClick={handleSideBar}>
              {!openSideBar ? (
                <svg
                  className="w-7 h-7"
                  fill="#000"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <AiOutlineClose className="text-xl" />
              )}
            </button>
          </div>
        </div>

      </header>
    </div>
  );
};

export default Header;
