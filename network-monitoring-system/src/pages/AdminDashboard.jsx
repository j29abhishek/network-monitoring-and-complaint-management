import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import "../css/admindashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUser,
  faBell,
  faGear,
  faRightFromBracket,
  faBars,
  faXmark,
  faMap,
  faSignal,
  faPrint,
  faFolder,
  faFileLines,
  faFloppyDisk,
  faFolderPlus,
  faPenToSquare,
  faServer,
  faHexagonNodes,
  faDatabase,
  faWifi,
} from "@fortawesome/free-solid-svg-icons";
import nicLogo from "../assets/nic-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

// import { response } from "express";

const socket = io("http://localhost:2001");

const AdminDashboard = () => {
  const [complaintStats, setComplaintStats] = useState({});
  const [stats, setStats] = useState({ total: 0, up: 0, down: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const openDashboard = () => {
    setIsOpen((prev) => !prev);
  };

  const navigate = useNavigate();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    //to get network intitial stats
    axios
      .get("http://localhost:2001/getStats")
      .then((response) => {
        const data = response.data;
        console.log(data);
        setStats({ total: data.total, up: data.up, down: data.down });
      })
      .catch((error) => {
        console.error("error while fetching data", error);
      });
    // to get complaint using axios request
    axios
      .get("http://localhost:2001/getComplaintStats")
      .then((response) => {
        setComplaintStats(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    // ----------------------------------------------------

    socket.on("statusUpdate", (data) => {
      console.log("Received status update:", data);
      setStats(data);
    });

    socket.on("disconnect", () => {
      console.warn("Disconnected from Socket.IO server");
    });

    return () => {
      socket.off("statusUpdate");
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    console.log("Logout clicked");
  };

  // number formatter as per international system
  const formatNumber = (num) => {
    return new Intl.NumberFormat("en", {
      notation: "compact",
      compactDisplay: "short",
    }).format(num);
  };

  return (
    <div className="admin-dashboard-page">
      <div className="admin-navbar">
        <div className="admin-brand">
          <div className="admin-menu" onClick={openDashboard}>
            <FontAwesomeIcon icon={isOpen ? faXmark : faBars} />
          </div>
          <div className="admin-logo">DASHBOARD</div>
        </div>
        <div className="admin-information">
          <div className="admin-icon">NIC</div>
          <h3>NETWORK DIVISION</h3>
        </div>
      </div>
      {/* ------------------------------------------------------------------- */}
      <div className="admin-dashboard-body">
        <div className={`admin-dashboard-left ${isOpen ? "show" : ""}`}>
          <div className="dashboard-text">DASHBOARD</div>

          <div className="admin-dashboard-group">
            <div className="admin-dashboard-items">
              <Link to="/">
                <FontAwesomeIcon icon={faHouse} /> Home
              </Link>
            </div>
            <Link to="/user-profile" className="admin-dashboard-items">
              <FontAwesomeIcon icon={faUser} /> Profile
            </Link>
            <Link to="/notifications" className="admin-dashboard-items">
              <FontAwesomeIcon icon={faBell} /> Notifications
            </Link>
            <Link to="/user-settings" className="admin-dashboard-items">
              <FontAwesomeIcon icon={faGear} /> Settings
            </Link>
            <div className="admin-dashboard-items" onClick={handleLogout}>
              <FontAwesomeIcon icon={faRightFromBracket} /> Log out
            </div>
          </div>

          <div className="admin-dashboard-nic-logo">
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
        <div className="admin-dashboard-content">
          <div className="dashboard-statistics">
            <div className="network-statistics">
              <h2>Network Status</h2>
              <div className="statistics-boxes">
                <div className="statistics-box bg-blue">
                  <p>Total</p>
                  <p className="f-blue">{formatNumber(stats.total)}</p>
                </div>
                <div className="statistics-box bg-green">
                  <p>Uplinks</p>
                  <p className="f-green">{formatNumber(stats.up)}</p>
                </div>
                <div className="statistics-box bg-red">
                  <p>Downlinks</p>
                  <p className="f-red">{formatNumber(stats.down)}</p>
                </div>
              </div>
              <Link to="/network-map" className="view-more">
                Go to map
              </Link>
            </div>
            <div className="complaint-statistics">
              <h2>Complaint Status</h2>
              <div className="statistics-boxes">
                <div className="statistics-box bg-blue">
                  <p>Total</p>
                  <p className="f-blue">{formatNumber(complaintStats.total)}</p>
                </div>
                <div className="statistics-box bg-green">
                  <p>Resolved</p>
                  <p className="f-green">
                    {formatNumber(complaintStats.resolved)}
                  </p>
                </div>
                <div className="statistics-box bg-yellow">
                  <p>Pending</p>
                  <p className="f-yellow">
                    {formatNumber(complaintStats.pending)}
                  </p>
                </div>
              </div>
              <Link to="/complaintDashboard" className="view-more">
                See more
              </Link>
            </div>
          </div>
          {/* --------------------------------------------- */}

          <div className="important-links-section">
            <h2>Important links</h2>
            <div className="important-links">
              <div className="important-link">
                <Link to="/network-map" className="link-icon">
                  <FontAwesomeIcon icon={faMap} />
                </Link>
                <p>Network map</p>
              </div>
              <div className="important-link">
                <Link to="/up-down-tracking" className="link-icon">
                  <FontAwesomeIcon icon={faSignal} />
                </Link>
                <p>IP Status</p>
              </div>
              <div className="important-link">
                <Link to="/status-log" className="link-icon">
                  <FontAwesomeIcon icon={faPrint} />
                </Link>
                <p>IP logs</p>
              </div>
              <div className="important-link">
                <Link to="/user-ip-details" className="link-icon">
                  <FontAwesomeIcon icon={faFolder} />
                </Link>
                <p>IP Details</p>
              </div>
              <div className="important-link">
                <Link to="/complaintDashboard" className="link-icon">
                  <FontAwesomeIcon icon={faFileLines} />
                </Link>
                <p>complaints dashboard</p>
              </div>
              <div className="important-link">
                <Link to="/add-ip-to-network" className="link-icon">
                  <FontAwesomeIcon icon={faFloppyDisk} />
                </Link>
                <p>Save IP</p>
              </div>
              <div className="important-link">
                <Link to="/user-ip-collection-form" className="link-icon">
                  <FontAwesomeIcon icon={faFolderPlus} />
                </Link>
                <p>User & IP form</p>
              </div>
              <div className="important-link">
                <Link to="/complaint-form" className="link-icon">
                  <FontAwesomeIcon icon={faPenToSquare} />
                </Link>
                <p>Complaint Form</p>
              </div>
            </div>
          </div>

          <div className="control-panel-n-tools">
            {/* control panel for admin  */}
            <div className="admin-control-panel">
              <h2>Control Panel</h2>
              <div className="control-panel">
                <div className="cp-link">
                  <Link to="/manage-users" className="link-icon">
                    <FontAwesomeIcon icon={faUser} />
                    <p>Manage User</p>
                  </Link>
                </div>
                <div className="cp-link">
                  <Link to="/assigned-ips" className="link-icon">
                    <FontAwesomeIcon icon={faDatabase} />
                    <p>User IP Database</p>
                  </Link>
                </div>
                <div className="cp-link">
                  <Link to="/manage-network" className="link-icon">
                    <FontAwesomeIcon icon={faHexagonNodes} />
                    <p>Manage Network</p>
                  </Link>
                </div>
              </div>
            </div>

            {/* control panel for admin ^ */}
            <div className="admin-tools">
              <h2>Tools</h2>
              <div className="admin-tool-link">
                <div className="tool-link">
                  <Link to="/dnstoip" className="link-icon">
                    <FontAwesomeIcon icon={faServer} />
                    <p>DNSxIP</p>
                  </Link>
                </div>
                <div className="tool-link">
                  <Link to="/ping-testing" className="link-icon">
                    <FontAwesomeIcon icon={faWifi} />
                    <p>Ping IP</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
