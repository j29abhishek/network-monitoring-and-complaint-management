import React, { useEffect, useState } from "react";
import "../css/admindashboard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const UsersSettings = () => {
  const [editMode, setEditMode] = useState(false);
  const [accountData, setAccountData] = useState({
    name: "",
    email: "",
    number: "",
  });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:2001/user-details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAccountData(res.data);
        console.log(res.data);
      })
      .catch((error) => console.log("Token error", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSave = () => {
    const updatedData = {
    ...accountData,
    number: parseInt(accountData.number, 10), // convert string to number
  };
    axios
      .put(
        `http://localhost:2001/updateUserDetailsById/${accountData._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => setEditMode(false))
      .catch((err) => console.log("Update error", err));
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  return (
    <div className="user-settings">
      <div className="user-setting-header">
        <h2>Settings</h2>
        <p>Update your personal information and preferences</p>
        <button className="back-to-dashboard" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      <div className="account-setting">
        <h2>Account Setting</h2>
        <div className="edit-account-details">
          <p>Update Profile Details</p>
          <form
            className={`account-setting-form ${editMode ? "edit-mode" : ""}`}
          >
            <div className="account-setting-input">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={accountData.name}
                readOnly={!editMode}
                onChange={handleInputChange}
              />
            </div>

            <div className="account-setting-input">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={accountData.email}
                readOnly={!editMode}
                onChange={handleInputChange}
              />
            </div>

            <div className="account-setting-input">
              <label>Contact</label>
              <input
                type="text"
                name="number"
                value={accountData.number}
                readOnly={!editMode}
                onChange={handleInputChange}
              />
            </div>

            <div className="account-buttons">
              {!editMode ? (
                <button
                  type="button"
                  className="edit-btn"
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </button>
              ) : (
                <div className="cancel-and-save">
                  <button
                    type="button"
                    className="save-btn"
                    onClick={handleSave}
                  >
                   Save
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={handleCancel}
                  >
                  Cancel
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* <Link to="" className="">Change password</Link> */}
      </div>
    </div>
  );
};

export default UsersSettings;
