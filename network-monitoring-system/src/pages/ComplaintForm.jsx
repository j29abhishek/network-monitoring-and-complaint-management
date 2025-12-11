import React, { useState } from "react";
import "../css/complaint.css";
import BackButton from "../components/BackButton";

const ComplaintForm = () => {
  const [complaintData, setComplaintData] = useState({
    userName: "",
    gmail:"",
    phoneNumber: "",
    roomNumber: "",
    selectedIssue: "",
    description: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComplaintData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitComplain = async (event) => {
    event.preventDefault(); // Prevent page reload
    try {
      const response = await fetch("http://localhost:2001/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Fixed the typo
        },
        body: JSON.stringify(complaintData),
      });

      const result = await response.json();
      console.log("Response from server:", result);
      setMessage("Complaint submitted successfully!");

      // Clear form data after submission
      setComplaintData({
        userName: "",
        gmail:"",
        phoneNumber: "",
        roomNumber: "",
        selectedIssue: "",
        description: "",
      });

      setTimeout(() => setMessage(""), 10000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("Error in submitting complaints");
    }
  };

  return (
    <div className="complaint-form-page">
      <div className="complaint-form-area">
        <div className="comlaint-heading">
          <div className="complaint-back-button">
            <BackButton/>
          </div>
          <h2>User Complaint Form</h2>
        </div>
        <div className="user-complaint-form">
          <form action="" onSubmit={submitComplain}>
            <div className="complain-input input">
              <label htmlFor="Name">Full Name</label>
              <input
                type="text"
                name="userName"
                id="userName"
                value={complaintData.userName}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>

            <div className="complain-input input">
              <label htmlFor="Gmail">Gmail</label>
              <input
                type="email"
                name="gmail"
                id="gmail"
                value={complaintData.gmail}
                onChange={handleChange}
                placeholder="Enter your mail id"
              />
            </div>

            <div className="contact-room">
              <div className="complain-input input c-user-phone-number">
                <label htmlFor="contact">Mobile Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={complaintData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required
                />
              </div>

              <div className="complain-input input c-user-room-number">
                <label htmlFor="room-number">Room Number</label>
                <input
                  type="text"
                  name="roomNumber"
                  id="roomNumber"
                  value={complaintData.roomNumber}
                  onChange={handleChange}
                  placeholder="Enter Room Number"
                />
              </div>
            </div>

            <div className="complain-input input">
              <select
                name="selectedIssue"
                id="selectedIssue"
                value={complaintData.selectedIssue}
                onChange={handleChange}
                required
              >
                <option value="">SELECT ISSUE</option>
                <option value="Network Issue">Network issue</option>
                <option value="LAN Port Issue">Lan Port Issue</option>
                <option value="LAN Cable Issue">LAN cable Issue</option>
                <option value="Blocked Ip Issue">Blocked Ip Issue</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="complain-input input">
              <label htmlFor="Name">Describe Your Problem</label>
              <textarea
                id="description"
                name="description"
                value={complaintData.description}
                onChange={handleChange}
                rows="4"
                cols="50"
                placeholder="Describe your issue in detail..."
              ></textarea>
            </div>
            {message && <div className="message">{message}</div>}
            <button type="submit" className="submit-complaint">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;
