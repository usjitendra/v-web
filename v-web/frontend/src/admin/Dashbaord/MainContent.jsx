import React, { useEffect, useState } from "react";
import DashboardStats from "./DashboardStats";
import OrderStatusCards from "./OrderStatusCards";
import RecentOrdersTable from "./RecentOrdersTable";
import ProductInsights from "./ProductInsights";
import LowStockProduct from "./LowStockProduct";
import SalesReport from "./SalesReport";
import { fetchDashboardCount } from "../../../api/Admin/DashboardApi";
import { useDashboard } from "../../../Context/DashboardContext";
import { format } from "date-fns";

const MainContent = () => {
  const { dateRange } = useDashboard();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        startDate: dateRange.startDate
          ? format(dateRange.startDate, "yyyy-MM-dd")
          : null,
        endDate: dateRange.endDate
          ? format(dateRange.endDate, "yyyy-MM-dd")
          : null,
      };
      const response = await fetchDashboardCount(params);
      setData(response.data.data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange.startDate, dateRange.endDate]);

  return (
    <>
      <DashboardStats
        earnings={data?.earning}
        orders={data?.totalOrderItems}
        customers={data?.customer}
        product={data?.product}
        loading={loading}
      />
      <OrderStatusCards
        loading={loading}
        pendingOrder={data?.pendingOrder}
        refundedOrder={data?.refundedOrder}
        completedOrder={data?.completedOrder}
        cancelledOrder={data?.cancelledOrder}
        confirmOrder={data?.confirmOrder}
        shippedOrder={data?.shippedOrder}
      />
      <RecentOrdersTable loading={loading} data={data?.recentOrder} />
      <ProductInsights
        loading={loading}
        topCategory={data?.topCategory}
        bestSellingProducts={data?.bestSellingProductDetails}
        mostWishlistedProducts={data?.mostWishlistedProducts}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-3 xl:gap-5 md:gap-10 mt-8 mb-6">
        <SalesReport sales={data?.monthlySalesReport} />
        <LowStockProduct stock={data?.lowStock} />
      </div>
    </>
  );
};

export default MainContent;
