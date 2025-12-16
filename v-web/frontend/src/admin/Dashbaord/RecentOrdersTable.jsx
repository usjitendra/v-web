import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const statusStyles = {
  PENDING: "bg-orange-100 text-orange-600",
  SUCCESS: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-600",
  REFUNDED: "bg-green-100 text-green-700",
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const RecentOrdersTable = ({ loading, data }) => {
  if (loading) {
    return (
      <div className="mt-8 rounded-lg">
        <h2 className="text-sm font-semibold mb-4">Recent Orders</h2>
        <div className="hidden md:block overflow-x-auto shadow-md">
          <Table className="w-full bg-white rounded-xl overflow-hidden text-sm">
            <TableHeader>
              <TableRow className="bg-Lime text-black">
                {[
                  "S.No.",
                  "Order ID",
                  "Customer",
                  "Amount",
                  "Date",
                  "Status",
                ].map((header) => (
                  <TableHead key={header} className="px-4 py-3">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index} className="border-b last:border-b-0">
                  {[...Array(6)].map((_, cellIndex) => (
                    <TableCell key={cellIndex} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden space-y-3">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-sm space-y-3"
            >
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 rounded-lg">
      <h2 className="text-sm font-semibold mb-4">Recent Orders</h2>

      <div className="hidden md:block overflow-x-auto shadow-md">
        <Table className="w-full bg-white rounded-xl overflow-hidden text-sm">
          <TableHeader>
            <TableRow className="bg-Lime text-black">
              {[
                "S.No.",
                "Order ID",
                "Customer",
                "Email",
                "Amount",
                "Date",
                "Status",
              ].map((header) => (
                <TableHead key={header} className="px-4 py-3">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((order, index) => (
              <TableRow
                key={order.id}
                className="border-b last:border-b-0 hover:bg-gray-50"
              >
                <TableCell className="px-4 py-3">{index + 1}.</TableCell>
                <TableCell className="px-4 py-3 font-medium min-w-[200px]">
                  <Link
                    to={`/admin/orders/order-details/${order.id}`}
                    className="font-medium text-lime-500 cp hover:font-semibold"
                  >
                    {order.orderNumber}
                  </Link>
                </TableCell>
                <TableCell className="px-4 py-3 min-w-[120px]">
                  <div className="flex flex-col">
                    <span>
                      {order.customer.firstName} {order.customer.lastName}
                    </span>
                    <span className="text-xs"> {order.customer.phone}</span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 font-normal">
                  {order.customer.email}
                </TableCell>
                <TableCell className="px-4 py-3 font-medium min-w-[120px]">
                  {formatCurrency(order.finalAmount)} (incl. tax)
                </TableCell>
                <TableCell className="px-4 py-3 min-w-[120px]">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      statusStyles[order.paymentStatus]
                    }`}
                  >
                    <span className="w-2 h-2 bg-current rounded-full"></span>
                    {order.paymentStatus}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {data.map((order, index) => (
          <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between text-xs items-start mb-2">
              <div className="font-medium">#{order.orderNumber}</div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${
                  statusStyles[order.paymentStatus]
                }`}
              >
                <span className="w-2 h-2 bg-current text-[10px] rounded-full"></span>
                {order.paymentStatus}
              </span>
            </div>

            <div className="mb-1">
              <div className="font-medium text-sm">
                {order.customer.firstName} {order.customer.lastName}
              </div>
              <div className="text-xs text-gray-600">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            <div className="flex justify-between mt-3 text-sm">
              <div>
                <span className="text-gray-500">Email: </span>
                <span className="text-xs">{order.customer.email}</span>
              </div>
              <div className="">
                <span className="text-gray-500 float-end">Amount: </span>
                <span className="font-medium float-end">
                  {formatCurrency(order.finalAmount)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrdersTable;
