import React, { useContext, useEffect } from "react";
import "./ManagLayout.css";
import { dataContext } from "../../App";
import { Navigate, Outlet } from "react-router-dom";
// import { Outlet } from "react-router";
import NavBar from "./manag.component/navbar/NavBar";
import SideBar from "./manag.component/sidebar/SideBar";
import { ToastContainer } from "react-toastify";

const ManagLayout = () => {
  const { employeeLoginInfo, getUserInfoFromToken, apiUrl, handleGetTokenAndConfig } =
    useContext(dataContext);
  
    useEffect(() => {
        getUserInfoFromToken(employeeLoginInfo);
      }, []);

  const isLoggedIn = employeeLoginInfo?.isAdmin && employeeLoginInfo?.isActive;

  console.log({ isLoggedIn });
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
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
