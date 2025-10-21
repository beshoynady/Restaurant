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
  if (!context) {
    console.error("ManagLayout must be used within a dataContext.Provider");
    return null;
  }

  const { employeeLoginInfo, apiUrl, isLoading, setIsLoading } = context;
  const [hasEmployees, setHasEmployees] = useState(null);

  // ===============================
  // 🔹 Check if any employee exists
  // ===============================
  const checkIfEmployeesExist = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/employee/count`);
      const count = response?.data?.count || 0;
      setHasEmployees(count > 0);
    } catch (error) {
      console.error("Error checking employees:", error);
      toast.error("Network error while checking employees.");
      setHasEmployees(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkIfEmployeesExist();
  }, []);

  // Wait for data loading
  if (hasEmployees === null || isLoading || !employeeLoginInfo) {
    return <LoadingPage />;
  }

  // If no employees exist → go to setup wizard
  if (hasEmployees === false) {
    return <Navigate to="/setup" />;
  }

  // If not logged in → go to login
  if (!employeeLoginInfo?.isAdmin || !employeeLoginInfo?.isActive) {
    return <Navigate to="/login" />;
  }

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
