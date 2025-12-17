import React from "react";
import DashboardStats from "./DashboardStats";
import OrderStatusCards from "./components/OrderStatusCards";
// import RecentOrdersTable from "./RecentTable";
// import ProductInsights from "./ProductInstant";
// import LowStockProduct from "./Dashbaord/LowStockProduct";
import SalesReport from "./Dashbaord/SalesReport";
import DoctorTable from "./Doctor/DoctoreList";

const MainContent = () => {
  // 🔹 Static Dashboard Data
  const data = {
    earning: 125000,
    totalOrderItems: 420,
    customer: 180,
    product: 95,

    pendingOrder: 12,
    refundedOrder: 4,
    completedOrder: 360,
    cancelledOrder: 8,
    confirmOrder: 20,
    shippedOrder: 16,

    recentOrder: [
      {
        id: "ORD-1001",
        customer: "John Doe",
        total: 250,
        status: "Completed",
        date: "2025-09-01",
      },
      {
        id: "ORD-1002",
        customer: "Jane Smith",
        total: 120,
        status: "Pending",
        date: "2025-09-02",
      },
    ],

    topCategory: [
      { name: "Electronics", value: 45 },
      { name: "Fashion", value: 30 },
      { name: "Home", value: 25 },
    ],

    bestSellingProductDetails: [
      { name: "Wireless Headphones", sales: 120 },
      { name: "Smart Watch", sales: 95 },
    ],

    mostWishlistedProducts: [
      { name: "Gaming Mouse", wishlist: 80 },
      { name: "Bluetooth Speaker", wishlist: 65 },
    ],

    monthlySalesReport: [
      { month: "Jan", sales: 12000 },
      { month: "Feb", sales: 15000 },
      { month: "Mar", sales: 18000 },
      { month: "Apr", sales: 22000 },
    ],

    lowStock: [
      { name: "USB Cable", stock: 5 },
      { name: "Power Bank", stock: 3 },
    ],
  };

  const loading = false;

  return (
    <>
      <DashboardStats
        earnings={data.earning}
        orders={data.totalOrderItems}
        customers={data.customer}
        product={data.product}
        loading={loading}
      />

      <OrderStatusCards
        loading={loading}
        pendingOrder={data.pendingOrder}
        refundedOrder={data.refundedOrder}
        completedOrder={data.completedOrder}
        cancelledOrder={data.cancelledOrder}
        confirmOrder={data.confirmOrder}
        shippedOrder={data.shippedOrder}
      />

      {/* <RecentOrdersTable loading={loading} data={data.recentOrder} /> */}

      {/* <ProductInsights
        loading={loading}
        topCategory={data.topCategory}
        bestSellingProducts={data.bestSellingProductDetails}
        mostWishlistedProducts={data.mostWishlistedProducts}
      /> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-3 xl:gap-5 md:gap-10 mt-8 mb-6">
        {/* <SalesReport sales={data.monthlySalesReport} />
        <LowStockProduct stock={data.lowStock} /> */}
        <DoctorTable/>
      </div>
    </>
  );
};

export default MainContent;
