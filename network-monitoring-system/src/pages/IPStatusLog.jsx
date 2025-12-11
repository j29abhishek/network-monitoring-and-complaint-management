import React, { useEffect, useState } from "react";
import "../css/updowntrack.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faCircleDown,
  faCircleUp,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackToDashboard from "../components/BackToDashboard";

const IPStatusLog = () => {
  const [combinedData, setCombinedData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const navigate=useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ipRes, statusRes] = await Promise.all([
          axios.get("http://localhost:2001/getIP"),
          axios.get("http://localhost:2001/get-ip-status"),
        ]);

        const ipMap = {};
        ipRes.data.forEach((ipInfo) => {
          ipMap[ipInfo.ipAddress] = { ...ipInfo };
        });

        const mergedData = statusRes.data.map((statusItem) => {
          const baseInfo = ipMap[statusItem.ipAddress] || {};
          return {
            ...baseInfo,
            ...statusItem,
          };
        });

        setCombinedData(mergedData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  // Combined filter logic
  const filteredList = combinedData.filter((item) => {
    const matchesSearch = Object.values(item).some(
      (val) =>
        typeof val === "string" &&
        val.toLowerCase().includes(searchInput.toLowerCase())
    );
    const matchesStatus =
      statusFilter === "" || item.status?.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const renderStatusIcon = (status) => {
    return (
      <FontAwesomeIcon
        icon={status === "up" ? faCircleUp : faCircleDown}
        color={status === "up" ? "green" : "red"}
        size="lg"
      />
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="up-down-tracking-page">
      <div className="heading-tracking">
        <div className="heading-tracking-title">
          <BackToDashboard/>
 <h2>IP Status Logs</h2>
        </div>
        <div className="heading-tracking-subtext">
          Here is the all record of IP health
        </div>
       
      </div>

      <div className="navigation-n-search">
        <div className="navigation-group">
          <button className="down-links" onClick={() => handleStatusFilter("down")}>
            Down Links
          </button>
          <button className="up-links" onClick={() => handleStatusFilter("up")}>
            Up Links
          </button>
          <button className="all-links" onClick={() => handleStatusFilter("")}>
            All Links
          </button>
        </div>

        <div className="filter-search">
          <div className="input-track">
            <input
              type="text"
              value={searchInput}
              onChange={handleInputChange}
              placeholder="Enter to search"
            />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </div>
        </div>
      </div>

      <div className="ip-status-log-data">
        <table className="status-tracking-table">
          <thead className="tracking-table-head">
            <tr>
              <th>S.No</th>
              <th>IP Address</th>
              <th>Organization</th>
              <th>Bandwidth</th>
              <th>Provider</th>
              <th>Status</th>
              <th>Packet Drops</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody className="status-tracking-table-body">
            {filteredList.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.ipAddress}</td>
                <td>{item.organisation}</td>
                <td>{item.bandwidth}</td>
                <td>{item.provider}</td>
                <td className="status-text-icon">
                  {item.status} <span>{renderStatusIcon(item.status)}</span>
                </td>
                <td>{item.packetDrops}</td>
                <td>{formatTimestamp(item.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IPStatusLog;
