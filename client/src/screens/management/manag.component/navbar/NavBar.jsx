import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';

import { detacontext } from '../../../../App';

import notificationSound from '../../../../audio/sound.mp3';


const socket = io(process.env.REACT_APP_API_URL, {
  reconnection: true,
});

const NavBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
    setShowMessages(false);
  };

  const toggleMessages = () => {
    setShowMessages(prev => !prev);
    setShowNotifications(false);
  };

  const toggleDir = () => {
    const html = document.documentElement;
    const newDir = html.getAttribute('dir') === 'ltr' ? 'rtl' : 'ltr';
    const newLang = newDir === 'rtl' ? 'ar' : 'en';

    html.setAttribute('dir', newDir);
    html.setAttribute('lang', newLang);
  };

  const handleNotificationClick = (index) => {
    setNotifications(prevNotifications => prevNotifications.filter((_, i) => i !== index));
  };

  const handleMessageClick = (index) => {
    setMessages(prevMessages => prevMessages.filter((_, i) => i !== index));
  };



  useEffect(() => {
    // Load notifications from localStorage on component mount
    const savedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
    setNotifications(savedNotifications);

    // Listen for new order notifications
    socket.on('reciveorder', (notification) => {
      console.log("Socket notification received:", notification);
      const updatedNotifications = [...notifications, notification];
      setNotifications(updatedNotifications);

      // Save notifications to localStorage
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

      const audio = new Audio(notificationSound);
      audio.play();
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.off('reciveorder');
    };
  }, [notifications]);



  const employeeLogout = () => {
    try {
      // Remove admin token from local storage

      localStorage.removeItem('token_e');
      window.location.href = `https://${window.location.hostname}/login`;
    } catch (error) {
      // Handle any potential errors
      console.error('Logout error:', error);
      // Display a notification to the user about the error
      alert('حدث خطأ أثناء تسجيل الخروج. يرجى المحاولة مرة أخرى.');
    }
  }


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

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
      setFullscreen(true);
    } else {
      exitFullScreen.call(doc);
      setFullscreen(false);
    }
  };



  return (
    <detacontext.Consumer>
      {({ employeeLoginInfo, employeelogout }) => (
        <nav className="navbar w-100 navbar-expand-lg flex-row p-0 m-0 pr-2 sticky-top" style={{ height: '50px', backgroundColor: '#343a40' }}>
          {/* <input type="checkbox" className="form-check-input form-check-input-lg" id="theme-toggle" hidden />
      <label htmlFor="theme-toggle" className="theme-toggle" onClick={toggleDir}></label> */}
          <div className="navbar-nav ms-auto flex-row">
            <div className="nav-item mx-1 dropdown">
              <a
                className="nav-link d-flex align-items-center text-light"
                href="#"
                id="userDropdown"
                onClick={toggleDropdown}
                aria-haspopup="true"
                aria-expanded={showDropdown ? "true" : "false"}
              >
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', fontSize: '18px' }}>
                  {employeeLoginInfo && employeeLoginInfo.username?.charAt(0)}
                </div>
              </a>
              {showDropdown && (
                <div className="dropdown-menu dropdown-menu-right text-right flex-column show" aria-labelledby="userDropdown" style={{ position: 'absolute' }}>
                  <a className="dropdown-item" href="#">{employeeLoginInfo?.username}</a>
                  <a className="dropdown-item" href="#">{employeeLoginInfo?.role}</a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item btn btn-danger text-center" href="#" onClick={employeeLogout}>خروج</a>
                </div>
              )}
            </div>
            <div className="nav-item mx-1 dropdown">
              <a className="nav-link dropdown-toggle text-light" href="#" id="messagesDropdown" onClick={toggleMessages} aria-haspopup="true" aria-expanded={showMessages ? "true" : "false"}>
                <i className="bx bx-envelope"></i>
                <span className="badge badge-pill badge-danger">{messages.length}</span>
              </a>
              {showMessages && (
                <div className="dropdown-menu dropdown-menu-right flex-column show" aria-labelledby="messagesDropdown" style={{ position: 'absolute' }}>
                  {messages.length > 0 ? messages.map((message, index) => (
                    <Link to="/message" key={index} className="dropdown-item"  onClick={() => handleMessageClick(index)}>
                      <strong>{message.name}</strong>: {message.message}
                    </Link>
                  )) : <p className="dropdown-item">لا يوجد رسائل</p>}
                </div>
              )}
            </div>
            <div className="nav-item mx-1 dropdown">
              <a className="nav-link dropdown-toggle text-light" href="#" id="notificationsDropdown" onClick={toggleNotifications} aria-haspopup="true" aria-expanded={showNotifications ? "true" : "false"}>
                <i className="bx bx-bell"></i>
                <span className="badge badge-pill badge-danger">{notifications.length}</span>
              </a>
              {showNotifications && (
                <div className="dropdown-menu dropdown-menu-right flex-column absolute show" aria-labelledby="notificationsDropdown" style={{ position: 'absolute' }}>
                  {notifications.length > 0 ? notifications.map((notification, index) => (
                    <a key={index} className="dropdown-item" href="#" onClick={() => handleNotificationClick(index)}>
                      {notification}
                    </a>
                  )) : <a className="dropdown-item" href="#">لا يوجد اشعارات</a>}
                </div>
              )}
            </div>
            <div className="nav-item d-flex align-items-center justify-content-center mx-1"
              style={{ cursor: 'pointer' }}
              onClick={toggleFullscreen}>
              {!fullscreen ? <i className="fa-solid fa-maximize fa-xl text-light"></i>
                : <i className="fa-solid fa-minimize fa-xl text-light"></i>}
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

      )}
    </detacontext.Consumer>
  );
};

export default NavBar;


