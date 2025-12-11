import React, { useEffect, useState } from "react";
import "../css/complaint.css";
import image1 from "../assets/dashboard.jpg";
import { Link } from "react-router-dom";
import axios from "axios";

const ComplaintDashboard = () => {
  // Initializing the state
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  //for menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [selectedComplaint, setSelectedComplaints] = useState(null); // stored clicked complaints

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    navigate("/signup");
  };

  // Fetch Pending complaints by default when page loads
  useEffect(() => {
    // Initially fetching Pending complaints on page load
    axios
      .get("http://localhost:2001/getPendingComplaints")
      .then((response) => {
        setComplaints(response.data);
        setFilteredComplaints(response.data); // Set filtered complaints to pending complaints initially
      })
      .catch((error) => {
        console.log("Error fetching pending complaints:", error);
      });
  }, []);

  // open modal with selected complaint details
  const handleViewClick = (complaint) => {
    setSelectedComplaints(complaint);
  };

  // Update complaint status to Resolved or Pending
  const handleStatusToggle = (id, currentStatus) => {
    const newStatus = currentStatus === "Resolved" ? "Pending" : "Resolved";
    const confirmUpdate = window.confirm(
      `Are you sure you want to mark this as ${newStatus}?`
    );
    if (!confirmUpdate) return;

    axios
      .put(`http://localhost:2001/updateComplaintStatus/${id}`, {
        status: newStatus,
      })
      .then(() => {
        setComplaints((prevComplaints) =>
          prevComplaints.map((complaint) =>
            complaint._id === id
              ? { ...complaint, status: newStatus }
              : complaint
          )
        );
        // Re-filter complaints after update
        setFilteredComplaints((prevFilteredComplaints) =>
          prevFilteredComplaints.map((complaint) =>
            complaint._id === id
              ? { ...complaint, status: newStatus }
              : complaint
          )
        );
      })
      .catch((error) => console.error("Error updating status", error));

    // send mail details for nodemailer
    if (newStatus === "Resolved") {
      axios
        .post("http://localhost:2001/send-mail", {
          selectedIssue: selectedComplaint.selectedIssue,
          gmail: selectedComplaint.gmail,
          userName: selectedComplaint.userName,
        })
        .then(() => {
          alert("Complaint marked as resolved and email sent!");
        })
        .catch((err) => {
          console.error("Error sending email", err);
        });
      alert("Complaint marked as resolved and email sent!");
    }

    // Close modal after status is toggled
    setSelectedComplaints(null);
  };

  // close modal
  const handleClose = () => {
    setSelectedComplaints(null);
  };

  // Filter complaints based on the Username
  const filteredByName = filteredComplaints.filter((complaint) =>
    complaint.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch Pending complaints
  const handleShowPending = () => {
    axios
      .get("http://localhost:2001/getPendingComplaints")
      .then((response) => {
        setFilteredComplaints(response.data);
        setCurrentPage(1); // Reset pagination when switching filters
      })
      .catch((error) => {
        console.log("Error fetching pending complaints:", error);
      });
  };

  // Fetch Resolved complaints
  const handleShowResolved = () => {
    axios
      .get("http://localhost:2001/getResolvedComplaints")
      .then((response) => {
        setFilteredComplaints(response.data);
        setCurrentPage(1); // Reset pagination when switching filters
      })
      .catch((error) => {
        console.log("Error fetching resolved complaints:", error);
      });
  };

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredByName.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredByName.length / rowsPerPage);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    const navlinks = document.querySelector(".complaint-nav-links");
    if (navlinks) {
      navlinks.style.display = !isMenuOpen ? "block" : "none";
    }
  };

  return (
    <div className="complaint-dashboard">
      <div className="complaint-navbar">
        <div className="navbar-brand">COMPLAINT MANAGEMENT DASHBOARD</div>
        <div className="complaint-nav-links">
          <ul className="navlink">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/admin-dashboard">Dashboard</Link>
            </li>
            <li onClick={handleLogout}>
              <Link to="/">Logout</Link>
            </li>
          </ul>
        </div>

        <div className="menu" onClick={toggleMenu}>
          <img
            src={isMenuOpen ? "closedHamberger.svg" : "hamburger.svg"}
            alt=""
          />
        </div>
      </div>

      <div className="complaint-list">
        <div className="complaint-list-left">
          <div className="complaint-table">
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Date</th>
                  <th>User name</th>
                  <th>Phone Number</th>
                  <th>Room Number</th>
                  <th>Status</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {currentRows.map((item, index) => (
                  <tr key={item.id}>
                    <td>{indexOfFirstRow + index + 1}</td>
                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                    <td>{item.userName}</td>
                    <td>{item.phoneNumber}</td>
                    <td>{item.roomNumber}</td>
                    <td>{item.status}</td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => handleViewClick(item)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div class="clearfix"></div>

          <div className="row-number-n-pagination">
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

            <div className="pagination">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                id="prev"
              >
                Prev
              </button>
              <span>
                {" "}
                Page {currentPage} of {totalPages}{" "}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage >= totalPages}
                id="next"
              >
                Next
              </button>
            </div>
          </div>

          {/* Modal for complaint details */}
          {selectedComplaint && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Complaint Details</h3>
                <p>
                  <strong>ID:</strong> {selectedComplaint._id}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedComplaint.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>User:</strong> {selectedComplaint.userName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedComplaint.gmail}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedComplaint.phoneNumber}
                </p>
                <p>
                  <strong>Room:</strong> {selectedComplaint.roomNumber}
                </p>
                <p>
                  <strong>Status:</strong> {selectedComplaint.status}
                </p>
                <div className="complaint-message-box">
                  <p id="message-paragraph">
                    <strong>Issue Type:</strong>{" "}
                    {selectedComplaint.selectedIssue}
                  </p>
                  <p id="message-paragraph">
                    <strong>Description:</strong>{" "}
                    {selectedComplaint.description}
                  </p>
                </div>
                <div className="modal-buttons">
                  <button
                    className="resolved-btn"
                    onClick={() =>
                      handleStatusToggle(
                        selectedComplaint._id,
                        selectedComplaint.status
                      )
                    }
                  >
                    {selectedComplaint.status === "Resolved"
                      ? "Mark as Pending"
                      : "Mark as Resolved"}
                  </button>
                  <button className="close-btn" onClick={handleClose}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="complaint-list-right">
          <div className="complaint-list-right-content">
            <div className="complaint-search">
              Search:
              <input
                type="text"
                placeholder="search name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-box"
              />
            </div>

            <div className="filter-by-status">
              <button id="statusPending" onClick={handleShowPending}>
                Pending
              </button>
              <button id="statusResolved" onClick={handleShowResolved}>
                Resolved
              </button>
            </div>
          </div>
          <div className="complaint-list-right-image">
            <img src={image1} alt="image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDashboard;
