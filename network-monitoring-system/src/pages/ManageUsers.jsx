import React, { useEffect, useState } from "react";
import "../css/manageusers.css";
import BackButton from "../components/BackButton";
import axios from "axios";
import BackToDashboard from "../components/BackToDashboard";
const ManageUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userRequest, setUserRequest] = useState([]);
  const token = localStorage.getItem("token");
  const fetchUserRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:2001/user-registration-requests",
        {
          headers: {
            Authorization: `Bearer ${token}`, // 👈 Include the token
          },
        }
      );
      setUserRequest(response.data);
    } catch (error) {
      console.error("Error in fetching data", error);
    }
  };

  useEffect(() => {
    fetchUserRequests();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await axios.put(
        `http://localhost:2001/approve-user/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // 👈 Include the token
          },
        }
      );
      await fetchUserRequests();
    } catch (error) {
      console.log("Error approving user:", error);
    }
  };

  // ✅ Filtered users based on search input
  const filteredUsers = userRequest.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.number?.toString().includes(query)
    );
  });

  return (
    <div className="manage-user-page">
      <div className="manage-user-header">
        <div className="manage-user-header-title">
          <BackToDashboard />
          <h3>Manage User</h3>
        </div>

        <div className="manage-user-header-subtext">
          Manage users by approve their registrations.
        </div>
      </div>

      <div className="search-for-user-relative">
        <div className="search-for-user">
          <div className="input">
            <input
              type="text"
              name="searchUser"
              id="search-user"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter name, contact, or gmail to search"
            />
          </div>
          <button className="search-user">Search</button>
        </div>
      </div>

      <div className="user-registration-requests">
        <div className="user-registration-requests-wrapper">
          <table className="user-registration-requests-table">
            <colgroup>
              <col className="col-serial" />
              <col className="col-name" />
              <col className="col-contact" />
              <col className="col-email" />
              <col className="col-action" />
            </colgroup>
            <thead>
              <tr>
                <th>S. No</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>
                    {user.name.charAt(0).toUpperCase() +
                      user.name.slice(1).toLowerCase()}
                  </td>
                  <td>{user.number}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      className="approve-user-registration"
                      onClick={() => handleApprove(user._id)}
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
