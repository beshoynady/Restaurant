import React, { useContext } from "react";
import "./ManagLayout.css";
import { dataContext } from "../../App";
import { Navigate, Outlet } from "react-router-dom";
import LoadingPage from "../management/manag.component/LoadingPage/LoadingPage";
import NavBar from "./manag.component/navbar/NavBar";
import SideBar from "./manag.component/sidebar/SideBar";
import { ToastContainer } from "react-toastify";

const ManagLayout = () => {
  const { employeeLoginInfo, isLoading, handleGetTokenAndConfig } =
    useContext(dataContext);

  if (isLoading) {
    return <LoadingPage />;
  }

  const isLoggedIn = employeeLoginInfo?.isAdmin && employeeLoginInfo?.isActive;
  console.log({ employeeLoginInfo, isLoggedIn });

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
