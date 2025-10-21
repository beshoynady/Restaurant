import React, { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";import "./ManagLayout.css";
import { dataContext } from "../../App";
import { Navigate, Outlet } from "react-router-dom";
import LoadingPage from "./adminComponent/LoadingPage/LoadingPage";
import NavBar from "./adminComponent/navbar/NavBar";
import SideBar from "./adminComponent/sidebar/SideBar";
import { ToastContainer } from "react-toastify";
import axios from "axios";

import StepWelcome from "./adminComponent/Setup/StepWelcome";

const ManagLayout = () => {
  const context = useContext(dataContext);

if (!context) {
  console.error("ManagLayout must be used within a dataContext.Provider");
  return null;
}

const { employeeLoginInfo, isLoading, setIsLoading } = context;
  const [hasEmployees, setHasEmployees] = useState(null); // null = not loaded yet


  if (isLoading) {
    return <LoadingPage />;
  }

  const isLoggedIn = hasEmployees && employeeLoginInfo?.isAdmin && employeeLoginInfo?.isActive;
  
    // ===============================
    // 🔹 Check if employees exist
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
  
    // ✅ Run check once on mount
    useEffect(() => {
      checkIfEmployeesExist();
    }, []);

    if (hasEmployees === false) {
    return <Navigate to="/setup" />;
  }



  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="manag-body">
      <ToastContainer />
      <main className="content">
        <NavBar />
        <Outlet />
      </main>
      <SideBar />
    </div>
  );
};

export default ManagLayout;
