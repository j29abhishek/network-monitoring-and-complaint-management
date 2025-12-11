import React, { useEffect, useState } from "react";
import "../css/updowntrack.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faCircleDown,
  faCircleUp,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import BackToDashboard from "../components/BackToDashboard";
import { useNavigate } from "react-router-dom";

const UpNdownTracking = () => {
  const [ipdata, setIpdata] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  const navigate = useNavigate();
  useEffect(() => {
    axios.get("http://localhost:2001/getIP").then((res) => {
      setIpdata(res.data);
    });
  }, []);

  const handleStatusFilter = (status) => {
    setSearchQuery(status);
    setSearchInput(""); // Clear the visible input field
    setCurrentPage(1); // Optional: reset to page 1
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value); // Update input box
    setSearchQuery(value); // Apply filter
    setCurrentPage(1); // Reset to first page
  };

  const filteredList = ipdata.filter((item) =>
    Object.values(item).some(
      (val) =>
        typeof val === "string" &&
        val.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredList.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredList.length / rowsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
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

  return (
    <div className="up-down-tracking-page">
      <div className="heading-tracking">
        <div className="heading-tracking-title">
          <BackToDashboard />
          <h2>Network Status</h2>
        </div>
        <div className="heading-tracking-subtext">
          Here is the status of all networks
        </div>
      </div>

      <div className="navigation-n-search">
        <div className="navigation-group">
          {/* <button className="search-icon-block">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </button> */}
          <button
            className="down-links"
            onClick={() => handleStatusFilter("down")}
          >
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
              name="searchInput"
              value={searchInput}
              onChange={handleInputChange}
              id="search"
              placeholder="Enter to search"
            />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </div>
        </div>
      </div>

      <div className="ip-status-tracking-data">
        <table className="status-tracking-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>IP Address</th>
              <th>Institute/Organization</th>
              <th>Bandwidth</th>
              <th>Provider</th>
              <th>Status</th>
              <th>Uptime (hours)</th>
              <th>Downtime (hours)</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((item, index) => (
              <tr key={index}>
                <td>{indexOfFirstRow + index + 1}</td>
                <td>{item.ipAddress}</td>
                <td>{item.organisation}</td>
                <td>{item.bandwidth}</td>
                <td>{item.provider}</td>
                <td className="status-text-icon">
                  {item.currentStatus}{" "}
                  <span>{renderStatusIcon(item.currentStatus)}</span>
                </td>
                <td>
                  {(() => {
                    const hrs = Math.floor(item.uptime / 3600);
                    const mins = Math.floor((item.uptime % 3600) / 60);
                    const secs = item.uptime % 60;
                    return `${hrs}h ${mins}m ${secs}s`;
                  })()}
                </td>
                <td>
                  {(() => {
                    const hrs = Math.floor(item.downtime / 3600);
                    const mins = Math.floor((item.downtime % 3600) / 60);
                    const secs = item.downtime % 60;
                    return `${hrs}h ${mins}m ${secs}s`;
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button onClick={handlePrev} disabled={currentPage === 1} id="prev">
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          id="next"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UpNdownTracking;
