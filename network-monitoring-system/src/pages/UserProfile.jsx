import React, { useState, useEffect } from "react";
import "../css/admindashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({});
  const [ipDetails, setIpDetails] = useState({});
  const navigate = useNavigate();

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

  console.log(userInfo.number);
  useEffect(() => {
     const token = localStorage.getItem("token");
    if (!userInfo.number) return; // Prevents API call if number is empty or undefined

    const fetchIpDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:2001/getUsersIpDetailsByContact/${userInfo.number}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIpDetails(res.data[0]);
        console.log("Fetched IP details:", res.data[0]);
      } catch (error) {
        console.error("Error in fetching details", error);
      }
    };

    fetchIpDetails();
  }, [userInfo.number]);

  return (
    <div className="users-profile">
      <div className="user-profile-header">
        <h2>User Profile |</h2>
        <p>
          Review your personal information. Editing is available in Settings.
        </p>
        <button
          className="back-to-dashboard"
          onClick={() => {
            navigate(-1);
          }}
        >
          Back
        </button>
      </div>

      <div className="user-information-body">
        <div className="user-profile-card">
          {/* Left Panel */}
          <div className="profile-avatar-section">
            <div className="avatar-circle">
              {userInfo.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="name-and-dept">
              <div className="profile-name">{userInfo.name}</div>
              <div className="profile-department">
                Department: {ipDetails?.department}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="profile-info-section">
            <div className="info-row">
              <div>
                <strong>Contact:</strong> {userInfo.number}
              </div>
              <div>
                <strong>Email:</strong> {userInfo.email}
              </div>
            </div>
            <div className="info-row">
              <div>
                <strong>Department:</strong> {ipDetails?.department || "N/A"}
              </div>
              <div>
                <strong>IP Address:</strong> {ipDetails.ip || "N/A"}
              </div>
            </div>
            <div className="info-row">
              <div>
                <strong>MAC Address:</strong> {ipDetails.mac || "N/A"}
              </div>
              <div>
                <strong>Port:</strong> {ipDetails.port || "N/A"}
              </div>
            </div>
            <div className="info-row">
              <div>
                <strong>Switch IP:</strong> {ipDetails.switchIp || "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
