import React from "react";
import {
  FaWallet,
  FaCogs,
  FaClipboardCheck,
  FaBan,
  FaUndo,
} from "react-icons/fa";
import { GiTruck } from "react-icons/gi";
import { Link } from "react-router-dom";

const OrderStatusCards = ({
  loading,
  pendingOrder,
  refundedOrder,
  completedOrder,
  cancelledOrder,
  confirmOrder,
  shippedOrder,
}) => {
  const orderStats = [
    {
      title: "Pending Orders",
      value: loading ? "..." : pendingOrder || 0,
      icon: <FaWallet className="text-md" />,
      link: "/admin/orders?status=PENDING&isPaid=true",
    },
    {
      title: "Shipped Orders",
      value: loading ? "..." : shippedOrder || 0,
      icon: <GiTruck className="text-lg" />,
      link: "/admin/orders?status=SHIPPED&isPaid=true",
    },
    // {
    //   title: "In Confirm Orders",
    //   value: loading ? "..." : confirmOrder || 0,
    //   icon: <FaCogs className="text-md" />,
    // },
    {
      title: "Delivered Orders",
      value: loading ? "..." : completedOrder || 0,
      icon: <FaClipboardCheck className="text-md" />,
      link: "/admin/orders?status=DELIVERED&isPaid=true",
    },
    {
      title: "Cancelled Orders",
      value: loading ? "..." : cancelledOrder || 0,
      icon: <FaBan className="text-md" />,
      link: "/admin/orders?status=CANCELLED&isPaid=true",
    },
    {
      title: "Refund Requests",
      value: loading ? "..." : refundedOrder || 0,
      icon: <FaUndo className="text-md" />,
      link: "/admin/orders?status=REFUNDED&isPaid=true",
    },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-sm font-semibold text-black mb-2  sm:mb-4">
        Order Status
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {orderStats.map((item, index) => (
          <Link
            to={item.link}
            key={index}
            className="bg-white hover:bg-[#CCFE8C] cp hover:scale-105 transition-all duration-300 ease-in-out rounded-xl shadow-sm p-4 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2 text-[11px] sm:text-sm lg:text-sm xl:text-sm font-semibold text-black">
              <span className="bg-gray-100 p-2 rounded-full shadow-sm">
                {item.icon}
              </span>
              {item.title}
            </div>
            <div className="text-xl sm:text-2xl font-bold text-black">
              {item.value}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusCards;
