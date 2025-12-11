import React from "react";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faLongArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../css/ipmanagement.css";
import BackToDashboard from "../components/BackToDashboard"

const IpAssignedList = () => {
  const [iplist, setIPlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:2001/get-ipAddress")
      .then((res) => res.json())
      .then((data) => setIPlist(data))
      .catch((error) => console.log("Error fetching data:", error));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this IP record?")) {
      try {
        await axios.delete(`http://localhost:2001/ip-users/${id}`);
        setIPlist(iplist.filter((item) => item._id !== id));
      } catch (error) {
        console.error("Error deleting record:", error);
        alert("Failed to delete. Try again");
      }
    }
  };
  // Filter data based on search input
  const filteredList = iplist.filter((item) =>
    Object.values(item).some(
      (val) =>
        typeof val === "string" &&
        val.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredList.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredList.length / rowsPerPage);

  // Handle Pagination
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle rows per page change
  const handleChange = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  return (
    <div className="ipaddress-list-container">
      <div className="ip-address-list-area">
        <div className="table-title">
          <div className="table-title-heading">
            <BackToDashboard />
            <h2>Manage IP Address</h2>
          </div>
          <div className="table-title-subtext">
            Manage your IP And Users Details
          </div>
        </div>

        <div className="ip-listing-filter-option">
          {/* Search Input */}
          <div className="ip-search">
            Search:
            <input
              type="text"
              placeholder="Search by department, IP, username, etc."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-box"
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="ip-table">
            <thead className="table-head">
              <tr>
                <th>S.No</th>
                <th>Room No</th>
                <th>Username</th>
                <th>IP Address</th>
                <th>Switch Port</th>
                <th>VLAN</th>
                <th>Switch IP</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {currentRows.map((item, index) => (
                <tr key={index}>
                  <td>{indexOfFirstRow + index + 1}</td>
                  <td>{item.room}</td>
                  <td>{item.username}</td>
                  <td>{item.ip}</td>
                  <td>{item.port}</td>
                  <td>{item.vlan}</td>
                  <td>{item.switchIp}</td>
                  <td>
                    <div className="edit-delete">
                      <Link to={`/ip/edit/${item._id}`}>
                        <FontAwesomeIcon icon={faPenToSquare} className="f-update"/>
                      </Link>

                      <Link to="" onClick={() => handleDelete(item._id)}>
                        <FontAwesomeIcon icon={faTrash} className="f-delete" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="row-number-n-pagination">
          {/* Rows per Page Dropdown */}
          <div className="rowNumbers">
            <select
              className="rows-per-page"
              value={rowsPerPage}
              onChange={handleChange}
              required
            >
              <option value={10}>10 Rows</option>
              <option value={25}>25 Rows</option>
              <option value={30}>30 Rows</option>
              <option value={50}>50 Rows</option>
              <option value={100}>100 Rows</option>
            </select>
          </div>

          {/* Pagination Controls */}
          <div className="pagination">
            <button onClick={handlePrev} disabled={currentPage === 1} id="prev">
              Prev
            </button>
            <span>
              {" "}
              Page {currentPage} of {totalPages}{" "}
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
      </div>
    </div>
  );
};

export default IpAssignedList;
