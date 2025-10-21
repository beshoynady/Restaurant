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
  // ===============================
  // ✅ كل الـHooks هنا فوق
  // ===============================
  const context = useContext(dataContext);
  const [hasEmployees, setHasEmployees] = useState(null);
  const [localLoading, setLocalLoading] = useState(true);

  // لو الكونتكست مش متاح، نرجع مكون بسيط بدل return مبكر
  const employeeLoginInfo = context?.employeeLoginInfo;
  const apiUrl = context?.apiUrl;
  const isLoading = context?.isLoading;
  const setIsLoading = context?.setIsLoading;

  // ===============================
  // 🔹 Check if employees exist
  // ===============================
  useEffect(() => {
    const checkIfEmployeesExist = async () => {
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

    if (apiUrl) {
      checkIfEmployeesExist();
    }
  }, [apiUrl]);

  // ===============================
  // 🔹 Handle loading or redirects
  // ===============================
  if (localLoading || isLoading) {
    return <LoadingPage />;
  }

  if (hasEmployees === false) {
    return <Navigate to="/setup" replace />;
  }

  const isLoggedIn =
    hasEmployees && employeeLoginInfo?.isAdmin && employeeLoginInfo?.isActive;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
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
