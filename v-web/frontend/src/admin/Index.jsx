import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardHeader from "./AdminNavbar";
import WindowHeader from "./WindowHeader";

const AdminDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <WindowHeader />

      <div className="flex  min-h-screen  font-Poppins w-full montserrat ">
        <div
          className={`fixed inset-y-0  z-50 w-64 md:w-56 xl:w-64  transform bg-white shadow-lg transition-transform duration-300 ease-in-out 
          ${sidebarCollapsed ? "-translate-x-full" : "translate-x-0"} 
          md:translate-x-0 md:relative`}
        >
          <Sidebar
            sidebarCollapsed={sidebarCollapsed}
            toggleSidebar={toggleSidebar}
          />
        </div>

        {!sidebarCollapsed && (
          <div className="fixed inset-0  md:hidden" onClick={toggleSidebar} />
        )}

        <div className="flex flex-col flex-1 ml-0 transition-all duration-300 ease-in-out overflow-hidden">
          <DashboardHeader toggleSidebar={toggleSidebar} />
          <div className="px-4 py-3  md:px-6 md:py-4 h-full overflow-y-auto min-h-screen bg-lightBlue ">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
