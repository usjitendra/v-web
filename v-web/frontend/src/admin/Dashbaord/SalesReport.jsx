import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { HiOutlineChartBar } from "react-icons/hi";

// Default data in case no sales data is provided
const defaultData = [
  { name: "Jan", total: 50000, sales: 0 },
  { name: "Feb", total: 45000, sales: 0 },
  { name: "Mar", total: 32000, sales: 0 },
  { name: "Apr", total: 50000, sales: 0 },
  { name: "May", total: 37000, sales: 0 },
  { name: "Jun", total: 33000, sales: 0 },
  { name: "Jul", total: 43000, sales: 0 },
  { name: "Aug", total: 47000, sales: 0 },
  { name: "Sep", total: 35000, sales: 0 },
  { name: "Oct", total: 35000, sales: 0 },
  { name: "Nov", total: 35000, sales: 0 },
  { name: "Dec", total: 35000, sales: 0 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 shadow-lg rounded-lg border border-gray-100">
        <p className="font-semibold text-black">{label}</p>
        <p className="text-sm text-gray-600">
          Total Sales: <span className="font-medium">₹{(payload[1].value).toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
};

const SalesReport = ({ sales = [] }) => {
  // Transform the incoming sales data to match the chart's structure
  const transformData = () => {
    if (!sales || sales.length === 0) return defaultData;
    
    return defaultData.map(item => {
      const saleItem = sales.find(s => s.month === item.name);
      return {
        ...item,
        sales: saleItem ? saleItem.totalSales : 0
      };
    });
  };

  const chartData = transformData();
  const maxValue = Math.max(...chartData.map(item => item.sales), 5000000);
  const yAxisTicks = [0, maxValue * 0.25, maxValue * 0.5, maxValue * 0.75, maxValue];
  
  return (
    <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100 w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gray-50 p-2 rounded-full">
            <HiOutlineChartBar className="text-black text-xl" />
          </div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">Sales Report</h2>
        </div>
        <div className="flex gap-2">
          {/* <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-200"></div>
            <span className="text-xs text-gray-500">Total</span>
          </div> */}
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-Lime"></div>
            <span className="text-xs text-gray-500">Sales</span>
          </div>
        </div>
      </div>

      <div className="h-[300px] md:h-[350px] hidden xl:block w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 5,
            }}
            barGap={-30}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
            <YAxis
              ticks={yAxisTicks}
              tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
              fontSize={12}
              stroke="#000"
              className="font-semibold"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              domain={[0, maxValue]}
            />
            <XAxis
              dataKey="name"
              stroke="#000"
              className="font-semibold"
              fontSize={12}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="total"
              fill="#F2F7FA"
              barSize={30}
              radius={[15, 15, 15, 15]}
            />
            <Bar
              dataKey="sales"
              fill="#A0E548"
              barSize={30}
              radius={[15, 15, 15, 15]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="h-[300px] md:h-[350px] block xl:hidden w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 5,
            }}
            barGap={-10}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
            <YAxis
              ticks={yAxisTicks}
              tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
              fontSize={12}
              stroke="#000"
              className="font-semibold"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              domain={[0, maxValue]}
            />
            <XAxis
              dataKey="name"
              stroke="#000"
              className="font-semibold"
              fontSize={12}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="total"
              fill="#F2F7FA"
              barSize={10}
              radius={[15, 15, 15, 15]}
            />
            <Bar
              dataKey="sales"
              fill="#A0E548"
              barSize={10}
              radius={[15, 15, 15, 15]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesReport;