import React, { useContext } from "react";
import "./ManagLayout.css";
import { dataContext } from "../../App";
import { Navigate, Outlet } from "react-router-dom";
import LoadingPage from "./adminComponent/LoadingPage/LoadingPage";
import NavBar from "./adminComponent/navbar/NavBar";
import SideBar from "./adminComponent/sidebar/SideBar";
import { ToastContainer } from "react-toastify";

const ManagLayout = () => {
  const context = useContext(dataContext);

if (!context) {
  console.error("ManagLayout must be used within a dataContext.Provider");
  return null;
}

const { employeeLoginInfo, isLoading } = context;

  if (isLoading) {
    return <LoadingPage />;
  }

  const isLoggedIn = employeeLoginInfo?.isAdmin && employeeLoginInfo?.isActive;
  

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
