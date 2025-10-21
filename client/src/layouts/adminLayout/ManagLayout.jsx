import React, { useContext, useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { dataContext } from "../../App";
import { Navigate, Outlet } from "react-router-dom";
import LoadingPage from "./adminComponent/LoadingPage/LoadingPage";
import NavBar from "./adminComponent/navbar/NavBar";
import SideBar from "./adminComponent/sidebar/SideBar";
import axios from "axios";
import "./ManagLayout.css";

const ManagLayout = () => {
  const context = useContext(dataContext);
  const [hasEmployees, setHasEmployees] = useState(null); // Initialize always
  const [localLoading, setLocalLoading] = useState(false);

  // If context not ready, show nothing safely (no hook condition)
  if (!context) {
    console.error("⚠️ ManagLayout must be used within a dataContext.Provider");
    return null;
  }

  const { employeeLoginInfo, apiUrl, isLoading, setIsLoading } = context;

  // ===============================
  // 🔹 Check if employees exist
  // ===============================
  const checkIfEmployeesExist = async () => {
    setLocalLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/employee/count`);
      const count = response?.data?.count || 0;
      setHasEmployees(count > 0);
    } catch (error) {
      console.error("Error checking employees:", error);
      toast.error("Network error while checking employees.");
      setHasEmployees(false);
    } finally {
      setLocalLoading(false);
    }
  };

  // ✅ Run check once on mount
  useEffect(() => {
    checkIfEmployeesExist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===============================
  // 🔹 Handle loading or redirects
  // ===============================
  if (isLoading || localLoading) {
    return <LoadingPage />;
  }

  if (hasEmployees === false) {
    return <Navigate to="/setup" />;
  }

  const isLoggedIn =
    hasEmployees && employeeLoginInfo?.isAdmin && employeeLoginInfo?.isActive;

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // ===============================
  // 🔹 Main Layout
  // ===============================
  return (
    <div className="manag-body">
      <ToastContainer />
      <NavBar />
      <div className="layout-container">
        <SideBar />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ManagLayout;
