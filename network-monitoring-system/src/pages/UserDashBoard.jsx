import React from "react";
import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import axios from "axios";
import "../css/userdashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUser,
  faBell,
  faGear,
  faRightFromBracket,
  faBars,
  faSignal,
  faXmark,
  faFolderPlus,
  faPenToSquare,
  faServer,
  faWifi,
} from "@fortawesome/free-solid-svg-icons";
import nicLogo from "../assets/nic-logo.png";
import { Link, useNavigate } from "react-router-dom";

const UserDashBoard = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const openDashboard = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    console.log("Logout clicked");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:2001/user-details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUserInfo(res.data);
        console.log(res.data);
      })
      .catch((error) => console.log("Token error", error));
  }, []);

  // for icon only first letters of first and last name
  const getInitials = (fullName) => {
    if (!fullName) return "";

    const names = fullName.trim().split(" ");

    const first = names[0]?.charAt(0).toUpperCase() || "";
    const last =
      names.length > 1 ? names[names.length - 1].charAt(0).toUpperCase() : "";

    return first + last;
  };

  return (
    <div className="user-dashboard-page">
      <div className="user-navbar">
        <div className="user-brand">
          <div className="user-menu" onClick={openDashboard}>
            <FontAwesomeIcon icon={isOpen ? faXmark : faBars} />
          </div>
          <div className="user-logo">DASHBOARD</div>
        </div>
        <div className="user-information">
          <div className="user-icon">{getInitials(userInfo.name)}</div>
          <h3>{userInfo.name}</h3>
        </div>
      </div>
      {/* ------------------------------------------------------------------- */}
      <div className="user-dashboard-body">
        <div className={`user-dashboard-left ${isOpen ? "show" : ""}`}>
          {/* <div className="dashboard-text">DASHBOARD</div> */}

          <div className="user-dashboard-group">
            <div className="user-dashboard-items">
              <Link to="/">
                <FontAwesomeIcon icon={faHouse} /> Home
              </Link>
            </div>
            <Link to="/user-profile" className="user-dashboard-items">
              <FontAwesomeIcon icon={faUser} /> Profile
            </Link>
            <Link to="/notifications" className="user-dashboard-items">
              <FontAwesomeIcon icon={faBell} /> Notifications
            </Link>
            <Link to="/user-settings" className="user-dashboard-items">
              <FontAwesomeIcon icon={faGear} /> Settings
            </Link>
            <div className="user-dashboard-items" onClick={handleLogout}>
              <FontAwesomeIcon icon={faRightFromBracket} /> Log out
            </div>
          </div>

          <div className="user-dashboard-nic-logo">
            <img src={nicLogo} alt="NIC Logo" />
          </div>

          <div className="author">
            <p>Developed by-</p>
            <p>
              <b>Abhishek Jaiswal</b> |Intern at NIC, 2025
            </p>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        <div className="user-dashboard-content">
          <div className="forms-n-tools">
            <div className="tools-list">
              <h3 className="tools-heading">Tools</h3>
              <div className="tools-flex">
                <Link to="/dnstoip" className="decoration-none">
                  <div className="tools-link">
                    <FontAwesomeIcon icon={faServer} className="tool-icon" />
                    <p>DNSxIP</p>
                  </div>
                </Link>
                <Link to="/ping-testing" className="decoration-none">
                  <div className="tools-link">
                    <FontAwesomeIcon icon={faWifi} className="tool-icon" />
                    <p>Ping IP</p>
                  </div>
                </Link>
              </div>
            </div>
            <div className="tools-list">
              <h3 className="tools-heading">Forms</h3>
              <div className="tools-flex">
                <Link to="/complaint-form" className="decoration-none">
                  <div className="tools-link">
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="tool-icon"
                    />
                    <p>complaint form</p>
                  </div>
                </Link>
                <Link to="/user-ip-collection-form" className="decoration-none">
                  <div className="tools-link">
                    <FontAwesomeIcon
                      icon={faFolderPlus}
                      className="tool-icon"
                    />
                    <p>Fill IP Details</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashBoard;
