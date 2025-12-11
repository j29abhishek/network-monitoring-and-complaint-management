import React, { useEffect, useState } from "react";
import "../css/ipmanagement.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowLeft } from "@fortawesome/free-solid-svg-icons";
const IPCollectionForm = ({ isEdit = false, onSubmit }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    department: "",
    room: "",
    contact: "",
    email: "",
    username: "",
    ip: "",
    mac: "",
    engineer: "",
    vlan: "",
    switchIp: "",
    port: "",
  });

  // Fetch data in edit mode
  useEffect(() => {
    const fetchData = async () => {
      if (isEdit && id) {
        try {
          const res = await axios.get(`http://localhost:2001/ip-users/${id}`);
          console.log("Fetched data:", res.data); // check what backend sends

          setFormData({
            department: res.data.department || "",
            room: res.data.room || "",
            contact: res.data.contact || "",
            email: res.data.email || "",
            username: res.data.username || "",
            ip: res.data.ip || "",
            mac: res.data.mac || "",
            engineer: res.data.engineer || "",
            vlan: res.data.vlan || "",
            switchIp: res.data.switchIp || "",
            port: res.data.port || "",
            _id: res.data._id,
          });
        } catch (err) {
          console.error("Error fetching form data:", err);
        }
      }
    };
    fetchData();
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contact" && !/^\d{0,10}$/.test(value)) return;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (isEdit && formData._id) {
        const res = await axios.put(
          `http://localhost:2001/ip-users/${formData._id}`,
          formData
        );
        setMessage("Form updated successfully ✅");
        if (onSubmit) onSubmit(res.data);

        setTimeout(() => {
          setMessage("");
          navigate("/assigned-ips");
        }, 1500);
      } else {
        const response = await fetch("http://localhost:2001/ip-users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        console.log("Response from server:", result);
        setMessage("Form submitted successfully ✅");

        setFormData({
          department: "",
          room: "",
          contact: "",
          email: "",
          username: "",
          ip: "",
          mac: "",
          engineer: "",
          vlan: "",
          switchIp: "",
          port: "",
        });

        setTimeout(() => setMessage(""), 10000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="ipcollection-page">
      <div className="ip-collection">
        <div className="heading">
          <FontAwesomeIcon
            icon={faLongArrowLeft}
            className="back-from-add-ip"
            onClick={() => {
              navigate(-1);
            }}
          />
          <p>
            {isEdit ? "Edit IP Address Request" : "IP Address Request Form"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="ip-request-form">
          <div className="select-department">
            <select
              name="department"
              id="department-name"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              <option value="Network">Network Department</option>
              <option value="Finance">Finance Department</option>
              <option value="Agriculture">Agriculture Department</option>
            </select>
          </div>

          <div className="form-area">
            <div className="form-area1">
              <div className="input">
                <label htmlFor="room">Address/Room No:</label>
                <input
                  type="text"
                  name="room"
                  id="room"
                  onChange={handleChange}
                  value={formData.room}
                  placeholder="Enter room or office number"
                  required
                />
              </div>

              <div className="input">
                <label htmlFor="contact">Contact No:</label>
                <input
                  type="tel"
                  name="contact"
                  id="contact"
                  onChange={handleChange}
                  value={formData.contact}
                  placeholder="Enter your contact number"
                  required
                />
              </div>

              <div className="input">
                <label htmlFor="email">Email Id:</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleChange}
                  value={formData.email}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="input">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  onChange={handleChange}
                  value={formData.username}
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="input">
                <label htmlFor="ip">IP Address:</label>
                <input
                  type="text"
                  name="ip"
                  id="ip"
                  onChange={handleChange}
                  value={formData.ip}
                  placeholder="Enter assigned IP address"
                  required
                />
              </div>
            </div>

            <div className="form-area2">
              <div className="input">
                <label htmlFor="mac">Device MAC ID:</label>
                <input
                  type="text"
                  name="mac"
                  id="mac"
                  onChange={handleChange}
                  value={formData.mac}
                  placeholder="Enter device MAC address"
                  required
                />
              </div>

              <div className="input">
                <label htmlFor="engineer">Engineer Name:</label>
                <input
                  type="text"
                  name="engineer"
                  id="engineer"
                  onChange={handleChange}
                  value={formData.engineer}
                  placeholder="Enter engineer's name"
                  required
                />
              </div>

              <div className="input">
                <label htmlFor="vlan">VLAN:</label>
                <input
                  type="text"
                  name="vlan"
                  id="vlan"
                  onChange={handleChange}
                  value={formData.vlan}
                  placeholder="Enter VLAN ID"
                  required
                />
              </div>

              <div className="input">
                <label htmlFor="switch-ip">Switch IP:</label>
                <input
                  type="text"
                  name="switchIp"
                  id="switchIp"
                  onChange={handleChange}
                  value={formData.switchIp}
                  placeholder="Enter switch IP address"
                  required
                />
              </div>

              <div className="input">
                <label htmlFor="port">Port No:</label>
                <input
                  type="number"
                  name="port"
                  id="port"
                  onChange={handleChange}
                  value={formData.port}
                  placeholder="Enter port number"
                  required
                />
              </div>
            </div>
          </div>

          {message && <div className="message">{message}</div>}

          <button type="submit" className="submit-button">
            {isEdit ? "Update" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default IPCollectionForm;
