import React from "react";
import { FaWallet, FaShoppingCart, FaUsers, FaBoxOpen } from "react-icons/fa";
import { Link } from "react-router-dom";

const DashboardStats = ({ earnings, orders, customers, product, loading }) => {

  const formatPrice = (price) => {
    const num = Number(price);
    if (isNaN(num)) return "₹0";
    
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const stats = [
    {
      title: "Total Earnings",
      value: loading ? "..." : formatPrice(earnings) || 0,
      icon: <FaWallet className="text-md" />,
      bgColor: "bg-Lime",
      link: "#sales",
    },
    {
      title: "Total Orders",
      value: loading ? "..." : orders || 0,
      icon: <FaShoppingCart className="text-md" />,
      bgColor: "bg-white",
      link: "/admin/orders",
    },
    {
      title: "Total Customers",
      value: loading ? "..." : customers || 0,
      icon: <FaUsers className="text-md" />,
      bgColor: "bg-white",
      link: "/admin/manage-customer",
    },
    {
      title: "Product",
      value: loading ? "..." : product || 0,
      icon: <FaBoxOpen className="text-md" />,
      bgColor: "bg-white",
      link: "/admin/product/all-products",
    },
  ];

  return (
    <div className="grid grid-cols-2 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, index) => (
        <Link
          to={stat.link}
          key={index}
          className={`p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-sm flex flex-col gap-1 sm:gap-2 ${stat.bgColor} hover:bg-[#CCFE8C] hover:shadow-sm hover:scale-105 transition-all duration-300 ease-in-out cp`}
        >
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold text-black">
            <span className="bg-white p-1 sm:p-2 rounded-full shadow-sm">
              {stat.icon}
            </span>
            {stat.title}
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-black">
            {stat.value}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default DashboardStats;
