import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { Link } from "react-router-dom";

import axios from "axios";
import { dataContext } from "../../../../App";
import { toast } from "react-toastify";

import notificationSound from "../../../../audio/sound.mp3";

// const socket = io(process.env.REACT_APP_API_URL, {
//   reconnection: true,
// });

// const cashierSocket = io(`${process.env.REACT_APP_API_URL}/cashier`, {
//   reconnection: true,
//   reconnectionAttempts: Infinity,
//   reconnectionDelay: 1000,
// });

// const kitchenSocket = io(`${process.env.REACT_APP_API_URL}/kitchen`, {
//   reconnection: true,
//   reconnectionAttempts: Infinity,
//   reconnectionDelay: 1000,
// });
// const BarSocket = io(`${process.env.REACT_APP_API_URL}/bar`, {
//   reconnection: true,
//   reconnectionAttempts: Infinity,
//   reconnectionDelay: 1000,
// });
// const GrillSocket = io(`${process.env.REACT_APP_API_URL}/grill`, {
//   reconnection: true,
//   reconnectionAttempts: Infinity,
//   reconnectionDelay: 1000,
// });

// const waiterSocket = io(`${process.env.REACT_APP_API_URL}/waiter`, {
//   reconnection: true,
//   reconnectionAttempts: Infinity,
//   reconnectionDelay: 1000,
// });

const NavBar = () => {
  const {
    permissionsList,
    employeeLoginInfo,
    isRefresh,
    setIsRefresh,
    cashierSocket,
    kitchenSocket,
    BarSocket,
    GrillSocket,
    waiterSocket,
    apiUrl,
    handleGetTokenAndConfig,
  } = useContext(dataContext);

  const permissionUserMassage = permissionsList?.filter(
    (permission) => permission.resource === "Messages"
  )[0];
  const role = employeeLoginInfo ? employeeLoginInfo.role : "";
  const isProgrammer = role === "programer";

  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);

  const getAllCustomerMessage = async () => {
    if (permissionUserMassage && !permissionUserMassage.read) {
      toast.warn("ليس لك صلاحية لعرض رسائل المستخدمين");
      return;
    }
    try {
      const config = await handleGetTokenAndConfig();
      const response = await axios.get(`${apiUrl}/api/message`, config);
      const data = await response.data.reverse();
      const messageNotSeen = data.filter((mas) => mas.isSeen === false);
      setMessages(messageNotSeen);
    } catch (error) {}
  };

  const updateisSeenMessage = async (id) => {
    if (permissionUserMassage && !permissionUserMassage.update) {
      toast.warn("ليس لك صلاحية لتعديل رسائل المستخدمين");
      return;
    }
    try {
      const config = await handleGetTokenAndConfig();
      const response = await axios.put(
        `${apiUrl}/api/message/${id}`,
        { isSeen: true },
        config
      );
      getAllCustomerMessage();
    } catch (error) {}
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    setShowMessages(false);
  };

  const toggleMessages = () => {
    setShowMessages((prev) => !prev);
    setShowNotifications(false);
  };

  const toggleDir = () => {
    const html = document.documentElement;
    const newDir = html.getAttribute("dir") === "ltr" ? "rtl" : "ltr";
    const newLang = newDir === "rtl" ? "ar" : "en";

    html.setAttribute("dir", newDir);
    html.setAttribute("lang", newLang);
  };

  const handleNotificationClick = (index) => {
    const newNotifications = notifications.filter((_, i) => i !== index);
    setNotifications(newNotifications);
    localStorage.setItem("notifications", JSON.stringify(newNotifications));
  };

  const handleMessageClick = (index) => {
    setMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));
  };

  const employeeLogout = async () => {
    try {
      // استرجاع الكونفيج والتوكن
      const config = await handleGetTokenAndConfig();

      const response = await axios.post(
        `${apiUrl}/api/employee/logout`,
        {}, // ممكن تحط refreshToken هنا لو API محتاجه
        {
          ...config,
          withCredentials: true, // عشان يمسح الكوكيز لو مستخدمها
        }
      );

      if (response.status === 200) {
        toast.success("تم تسجيل الخروج بنجاح");
      } else {
        toast.error("لم يتم تسجيل الخروج. حاول مرة أخرى");
      }
    } catch (error) {
      // لو السيرفر رجع رسالة واضحة
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("حدث خطأ أثناء تسجيل الخروج. حاول مرة أخرى.");
      }
      console.error("Logout error:", error);
    } finally {
      // تنظيف التوكنات والجلسة
      localStorage.removeItem("token_e");
      localStorage.removeItem("refresh_token_e"); // لو عندك ريفريش توكن
      sessionStorage.clear();

      // توجيه المستخدم لصفحة تسجيل الدخول
      window.location.replace("/login");
    }
  };

  const [fullscreen, setFullscreen] = useState(false);
  const toggleFullscreen = () => {
    const doc = window.document;
    const docEl = doc.documentElement;

    const requestFullScreen =
      docEl.requestFullscreen ||
      docEl.mozRequestFullScreen ||
      docEl.webkitRequestFullScreen ||
      docEl.msRequestFullscreen;
    const exitFullScreen =
      doc.exitFullscreen ||
      doc.mozCancelFullScreen ||
      doc.webkitExitFullscreen ||
      doc.msExitFullscreen;

    if (
      !doc.fullscreenElement &&
      !doc.mozFullScreenElement &&
      !doc.webkitFullscreenElement &&
      !doc.msFullscreenElement
    ) {
      requestFullScreen.call(docEl);
      setFullscreen(true);
    } else {
      exitFullScreen.call(doc);
      setFullscreen(false);
    }
  };

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

   useEffect(() => {
    document.body.setAttribute("data-bs-theme", isDarkMode ? "dark" : "light");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    // Load notifications from localStorage on component mount
    const savedNotifications =
      JSON.parse(localStorage.getItem("notifications")) || [];
    setNotifications(savedNotifications);

    // Define the event handler
    const handleNewOrderNotification = (notification) => {
      const parts = notification.split("-");
      const waiterId = parts[1] || null;
      const currentWaiterId = employeeLoginInfo.id;
      console.log({
        employeeLoginInfo,
        notification,
        parts,
        waiterId,
        currentWaiterId,
      });

      const notificationText = parts[0];
      // Check if the waiter id matches the current user's waiter id
      if (waiterId === currentWaiterId) {
        // Assuming currentWaiterId is the ID of the current waiter
        setNotifications((prevNotifications) => {
          const updatedNotifications = [...prevNotifications, notificationText];
          setIsRefresh(updatedNotifications.length);

          // Save notifications to localStorage
          localStorage.setItem(
            "notifications",
            JSON.stringify(updatedNotifications)
          );
          const audio = new Audio(notificationSound);
          audio.play().catch((error) => {
            console.error("Error playing sound:", error);
          });
          return updatedNotifications;
        });
      } else {
        setNotifications((prevNotifications) => {
          const updatedNotifications = [...prevNotifications, notification];
          // Save notifications to localStorage
          setIsRefresh(updatedNotifications.length);

          localStorage.setItem(
            "notifications",
            JSON.stringify(updatedNotifications)
          );
          const audio = new Audio(notificationSound);
          audio.play().catch((error) => {
            console.error("Error playing sound:", error);
          });
          return updatedNotifications;
        });
      }
    };

    // Listen for new order notifications
    if (
      employeeLoginInfo.role === "cashier" ||
      employeeLoginInfo.role === "programer"
    ) {
      cashierSocket.on("neworder", handleNewOrderNotification);
      cashierSocket.on("helprequest", handleNewOrderNotification);
      cashierSocket.on("orderReady", handleNewOrderNotification);
    } else if (employeeLoginInfo.role === "chef") {
      kitchenSocket.on("orderkitchen", handleNewOrderNotification);
    } else if (employeeLoginInfo.role === "Bartender") {
      BarSocket.on("orderBar", handleNewOrderNotification);
    } else if (employeeLoginInfo.role === "Grill Chef") {
      GrillSocket.on("orderGrill", handleNewOrderNotification);
    } else if (employeeLoginInfo.role === "waiter") {
      waiterSocket.on("orderReady", handleNewOrderNotification);
      waiterSocket.on("neworder", handleNewOrderNotification);
      waiterSocket.on("helprequest", handleNewOrderNotification);
    }

    // Clean up the socket connection on component unmount
    return () => {
      if (
        employeeLoginInfo.role === "cashier" ||
        employeeLoginInfo.role === "programer"
      ) {
        cashierSocket.off("neworder", handleNewOrderNotification);
        cashierSocket.off("orderReady", handleNewOrderNotification);
        cashierSocket.off("helprequest", handleNewOrderNotification);
      } else if (employeeLoginInfo.role === "chef") {
        kitchenSocket.off("orderkitchen", handleNewOrderNotification);
      } else if (employeeLoginInfo.role === "Bartender") {
        BarSocket.off("orderkitchen", handleNewOrderNotification);
      } else if (employeeLoginInfo.role === "Grill Chef") {
        GrillSocket.off("orderkitchen", handleNewOrderNotification);
      } else if (employeeLoginInfo.role === "waiter") {
        waiterSocket.off("neworder", handleNewOrderNotification);
        waiterSocket.off("orderReady", handleNewOrderNotification);
        waiterSocket.off("helprequest", handleNewOrderNotification);
      }
    };
  }, []);

  useEffect(() => {
    getAllCustomerMessage();
  }, []);

  return (
    <nav
      className="navbar w-100 navbar-expand-lg flex-row p-0 m-0 pr-2 sticky-top"
      style={{ height: "50px", backgroundColor: "#343a40" }}
    >
      {/* <input type="checkbox" className="form-check-input form-check-input-lg" id="theme-toggle" hidden />
      <label htmlFor="theme-toggle" className="theme-toggle" onClick={toggleDir}></label> */}
      <div className="navbar-nav flex-row align-items-center w-100 px-1 mx-1 ms-auto h-100">
        <div className="nav-item mx-1 dropdown">
          <a
            className="nav-link d-flex align-items-center text-light"
            href="#"
            id="userDropdown"
            onClick={toggleDropdown}
            aria-haspopup="true"
            aria-expanded={showDropdown ? "true" : "false"}
          >
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
              style={{ width: "36px", height: "36px", fontSize: "18px" }}
            >
              {employeeLoginInfo && employeeLoginInfo.username?.charAt(0)}
            </div>
          </a>
          {showDropdown && (
            <div
              className="dropdown-menu dropdown-menu-right text-right flex-column show"
              aria-labelledby="userDropdown"
              style={{ position: "absolute" }}
            >
              <a className="dropdown-item" href="#">
                {employeeLoginInfo?.username}
              </a>
              <a className="dropdown-item" href="#">
                {employeeLoginInfo?.role}
              </a>
              <div className="dropdown-divider"></div>
              <a
                className="dropdown-item btn btn-danger text-center"
                href="#"
                onClick={employeeLogout}
              >
                خروج
              </a>
            </div>
          )}
        </div>
        {(isProgrammer || permissionUserMassage?.read) && (
          <div className="nav-item mx-1 dropdown">
            <a
              className="nav-link dropdown-toggle text-light"
              href="#"
              id="messagesDropdown"
              onClick={toggleMessages}
              aria-haspopup="true"
              aria-expanded={showMessages ? "true" : "false"}
            >
              <i className="bx bx-envelope"></i>
              <span className="badge badge-pill badge-danger">
                {messages.length}
              </span>
            </a>
            {showMessages && (
              <div
                className="dropdown-menu dropdown-menu-right flex-column show"
                aria-labelledby="messagesDropdown"
                style={{ position: "absolute" }}
              >
                {messages.length > 0 ? (
                  messages.map((message, index) => (
                    <Link
                      to="message"
                      key={index}
                      className="dropdown-item text-right"
                    >
                      <i
                        className="material-icons"
                        data-toggle="tooltip"
                        title="Delete"
                        onClick={() => updateisSeenMessage(message._id)}
                        style={{ marginRight: "8px", fontSize: "18px" }}
                      >
                        close
                      </i>
                      <strong className="text-right">{message.name}</strong>:
                      {message.message}
                    </Link>
                  ))
                ) : (
                  <p className="dropdown-item">لا يوجد رسائل</p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="nav-item mx-1 dropdown">
          <a
            className="nav-link dropdown-toggle text-light"
            href="#"
            id="notificationsDropdown"
            onClick={toggleNotifications}
            aria-haspopup="true"
            aria-expanded={showNotifications ? "true" : "false"}
          >
            <i className="bx bx-bell"></i>
            <span className="badge badge-pill badge-danger">
              {notifications.length}
            </span>
          </a>
          {showNotifications && (
            <div
              className="dropdown-menu dropdown-menu-right flex-column absolute show"
              aria-labelledby="notificationsDropdown"
              style={{ position: "absolute" }}
            >
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <a
                    key={index}
                    className="dropdown-item"
                    href="#"
                    onClick={() => handleNotificationClick(index)}
                  >
                    {notification}
                  </a>
                ))
              ) : (
                <a className="dropdown-item" href="#">
                  لا يوجد اشعارات
                </a>
              )}
            </div>
          )}
        </div>
        <div
          className="nav-item d-flex align-items-center justify-content-center mx-1"
          style={{ cursor: "pointer" }}
          onClick={toggleFullscreen}
        >
          {!fullscreen ? (
            <i className="fa-solid fa-maximize fa-xl text-light"></i>
          ) : (
            <i className="fa-solid fa-minimize fa-xl text-light"></i>
          )}
        </div>
        <div
          className="nav-item d-flex align-items-center justify-content-center mx-1"
          style={{ cursor: "pointer" }}
          onClick={toggleTheme}
        >
          <button className="toggle-theme-btn">
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>
        {/* <form className="form-inline my-2 my-lg-0 me-auto">
      <div className="input-group">
        <input className="form-control border-primary m-0 p-2 h-auto" type="search" placeholder="Search" aria-label="Search" />
        <div className="input-group-append">
          <button className="h-100 btn btn-primary" type="submit">Search</button>
        </div>
      </div>
    </form> */}
      </div>
    </nav>
  );
};

export default NavBar;
