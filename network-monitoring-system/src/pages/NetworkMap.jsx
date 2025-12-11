import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import "../css/networkmap.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDown, faCircleUp, faBuildingColumns } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import BackToDashboard from "../components/BackToDashboard";

const NetworkMap = () => {
  const [ips, setIps] = useState([]);
  const [statuses, setStatuses] = useState({});
  const navigate=useNavigate();

  useEffect(() => {
    const socket = io("http://localhost:2001");

    // Fetch IP addresses and their statuses from backend
    axios
      .get("http://localhost:2001/getIP")
      .then((res) => {
        const ipData = res.data;
        setIps(ipData);

        // Initialize statuses from ipcollection (not ipstatuscollection)
        const initialStatuses = ipData.reduce((acc, ip) => {
          // Check the status from ipcollection (initial status)
          acc[ip.ipAddress?.trim()] = ip.currentStatus
            ? { status: ip.currentStatus, timestamp: ip.lastUpdated, uptime: ip.uptime, downtime: ip.downtime }
            : { status: "down", timestamp: new Date(), uptime: 0, downtime: 0 }; // Default to "down" if no status is provided
          return acc;
        }, {});

        setStatuses(initialStatuses);
      })
      .catch((err) => {
        console.error("Error fetching IPs:", err);
      });

    // Listen for real-time updates via socket
    socket.on("status-update", (data) => {
      const ipKey = data.ip?.trim();
      console.log("Received status update:", data);

      setStatuses((prev) => ({
        ...prev,
        [ipKey]: {
          status: data.status,
          timestamp: data.timestamp,
          uptime: data.uptime,
          downtime: data.downtime,
          packetDrops: data.packetDrops,
        },
      }));
    });

    socket.emit("request-initial-status");

    return () => {
      socket.off("status-update");
    };
  }, []);

  // Function to get status color based on status
  const getStatusColor = (status) => {
    return status === "up" ? "rgba(204, 249, 215, 0.59)" : "rgba(253, 209, 209, 0.59)";
  };

  // Function to render status icons
  const renderStatusIcon = (status) => {
    return (
      <FontAwesomeIcon
        icon={status === "up" ? faCircleUp : faCircleDown}
        color={status === "up" ? "green" : "red"}
        size="lg"
      />
    );
  };

  // Function to return status text color
  const statustext = (status) => {
    return status === "up" ? "green" : "red";
  };

  return (
    <div className="network-map-page">
     <div className="network-map-header">
      <div className="network-map-title">
        <BackToDashboard/>
        <h3>Network Map</h3>
      </div>
     </div>

      <div className="network-map-container">
        {/* NKN Network */}
        <div className="network-map network-map-1">
          <div className="bandwidth-provider">
            <h2>PGCIL CORE NETWORK</h2>
          </div>
          <div className="map-containers">
            {ips
              .filter((ip) => ip.provider === "BSNL")
              .map((ip) => {
                const statusInfo = statuses[ip.ipAddress?.trim()] || {};
                return (
                  <div
                    className="ip-address-status"
                    key={ip._id}
                    style={{ backgroundColor: getStatusColor(statusInfo.status) }}
                  >
                    <span className="institute-icon">
                      <FontAwesomeIcon icon={faBuildingColumns} />
                    </span>
                    <div className="ip-status-details">
                      <h3>{ip.organisation}</h3>
                      <p>{ip.ipAddress}</p>
                      <p>{ip.bandwidth}</p>
                    </div>
                    <div className="ip-status">
                      {renderStatusIcon(statusInfo.status)}
                      <span id="up-down" style={{ color: statustext(statusInfo.status) }}>
                        {statusInfo.status || "down"}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* BSNL Network */}
        <div className="network-map network-map-2">
          <div className="bandwidth-provider">
            <h2>BSNL NETWORK</h2>
          </div>
          <div className="map-containers">
            {ips
              .filter((ip) => ip.provider === "PGCIL")
              .map((ip) => {
                const statusInfo = statuses[ip.ipAddress?.trim()] || {};
                return (
                  <div
                    className="ip-address-status"
                    key={ip._id}
                    style={{ backgroundColor: getStatusColor(statusInfo.status) }}
                  >
                    <span className="institute-icon">
                      <FontAwesomeIcon icon={faBuildingColumns} />
                    </span>
                    <div className="ip-status-details">
                      <h3>{ip.organisation}</h3>
                      <p>{ip.ipAddress}</p>
                      <p>{ip.bandwidth}</p>
                    </div>
                    <div className="ip-status">
                      {renderStatusIcon(statusInfo.status)}
                      <span id="up-down" style={{ color: statustext(statusInfo.status) }}>
                        {statusInfo.status || "down"}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Railtel Network */}
        <div className="network-map network-map-3">
          <div className="bandwidth-provider">
            <h2>RAILTEL NETWORK</h2>
          </div>
          <div className="map-containers">
            {ips
              .filter((ip) => ip.provider === "RAILTEL")
              .map((ip) => {
                const statusInfo = statuses[ip.ipAddress?.trim()] || {};
                return (
                  <div
                    className="ip-address-status"
                    key={ip._id}
                    style={{ backgroundColor: getStatusColor(statusInfo.status) }}
                  >
                    <span className="institute-icon">
                      <FontAwesomeIcon icon={faBuildingColumns} />
                    </span>
                    <div className="ip-status-details">
                      <h3>{ip.organisation}</h3>
                      <p>{ip.ipAddress}</p>
                      <p>{ip.bandwidth}</p>
                    </div>
                    <div className="ip-status">
                      {renderStatusIcon(statusInfo.status)}
                      <span id="up-down" style={{ color: statustext(statusInfo.status) }}>
                        {statusInfo.status || "down"}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkMap;
