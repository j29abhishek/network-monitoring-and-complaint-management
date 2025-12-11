import React, { useEffect, useState } from "react";
import "../css/ipmanagement.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowLeft } from "@fortawesome/free-solid-svg-icons";
import BackToDashboard from "../components/BackToDashboard";
const IPAddressList = () => {
  const [iplist, setIPlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 30;
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:2001/get-ipAddress")
      .then((res) => res.json())
      .then((data) => setIPlist(data))
      .catch((error) => console.log("Error fetching data:", error));
  }, []);

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

  return (
    <div className="ipaddress-list-container">
      <div className="table-title">
        <div className="table-title-heading">
          <BackToDashboard />
          <h2>Users Assigned Ip Details</h2>
        </div>

        <div className="table-title-subtext">
          Here is the details of IP assigned to the users
        </div>
      </div>

      <div className="admin-listing-filter-option">
        {/* Search Input */}
        <div className="admin-listing-search">
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

      <div className="table-container">
        <table className="ip-table">
          <thead className="table-head">
            <tr>
              <th>S.No</th>
              <th>Department</th>
              <th>Room No</th>
              <th>Contact No.</th>
              <th>Email Id</th>
              <th>Username</th>
              <th>IP Address</th>
              <th>Device MAC ID</th>
              <th>Engineer Name</th>
              <th>VLAN</th>
              <th>Switch IP</th>
              <th>Port No</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {currentRows.map((item, index) => (
              <tr key={index}>
                <td>{indexOfFirstRow + index + 1}</td>
                <td>{item.department}</td>
                <td>{item.room}</td>
                <td>{item.contact}</td>
                <td>{item.email}</td>
                <td>{item.username}</td>
                <td>{item.ip}</td>
                <td>{item.mac}</td>
                <td>{item.engineer}</td>
                <td>{item.vlan}</td>
                <td>{item.switchIp}</td>
                <td>{item.port}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
  );
};

export default IPAddressList;
