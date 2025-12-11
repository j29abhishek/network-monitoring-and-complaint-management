import React, { useEffect, useState } from "react";
import "../css/networkmap.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowLeft } from "@fortawesome/free-solid-svg-icons";

const AddIPAddress = ({ isEdit = false, onSubmit }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ips, setIps] = useState({
    ipAddress: "", // Changed from 'ip'
    organisation: "", // Changed from 'institute'
    bandwidth: "",
    provider: "",
  });

  const [message, setMessage] = useState("");

  //Fetch Data in Edit mode
  useEffect(() => {
    const fetchData = async () => {
      if (isEdit && id) {
        try {
          const res = await axios.get(`http://localhost:2001/saveIp/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          console.log("Fetched data:", res.data);

          setIps({
            ipAddress: res.data.ipAddress || "",
            organisation: res.data.organisation || "",
            bandwidth: res.data.bandwidth || "",
            provider: res.data.provider || "",
            _id: res.data._id,
          });
        } catch (error) {
          console.log("Error Fetching data.", error);
        }
      }
    };
    fetchData();
  }, [isEdit, id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setIps((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page reload
    try {
      if (isEdit && ips._id) {
        const res = await axios.put(
          `http://localhost:2001/saveIp/${ips._id}`,
          ips,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessage("Form updated Successfully.");
        if (onSubmit) onSubmit(res.data);
        setTimeout(() => {
          setMessage("");
          navigate("/manage-network");
        }, 1500);
      } else {
        // Matching the schema by using the right field names
        const response = await axios.post("http://localhost:2001/saveIp", ips);

        const result = response.data;
        console.log("Response from server:", result);
        setMessage("IP SAVED SUCCESSFULLY!");

        // Reset the form data
        setIps({
          ipAddress: "",
          organisation: "",
          bandwidth: "",
          provider: "",
        });

        // Clear message after 10 seconds
        setTimeout(() => setMessage(""), 10000);
      }
    } catch (error) {
      console.log("Error submitting form:", error);
      setMessage("Error in submitting IP data!");
    }
  };

  return (
    <div className="add-ip-address-page">
      <div className="add-ip-form-area">
        <div className="heading">
          <FontAwesomeIcon
            icon={faLongArrowLeft}
            className="back-from-add-ip"
            onClick={() => {
              navigate(-1);
            }}
          />
          {isEdit ? "Edit Information" : "ADD IP ADDRESS TO NETWORK MAP"}
        </div>
        <form action="" className="add-ip-to-map-form" onSubmit={handleSubmit}>
          <div className="inputs">
            <div className="input">
              <label htmlFor="ipaddress">Enter IP Address</label>
              <input
                type="text"
                name="ipAddress"
                id="ipaddress"
                onChange={handleChange}
                value={ips.ipAddress}
                placeholder="Enter Ip address"
              />
            </div>
            <div className="input">
              <label htmlFor="organisation">
                Enter Institute/Organization name
              </label>
              <input
                type="text"
                name="organisation"
                id="organisation"
                onChange={handleChange}
                value={ips.organisation}
                placeholder="Enter Organization name"
              />
            </div>
            <div className="input">
              <label htmlFor="bandwidth">Enter Bandwidth</label>
              <input
                type="text"
                name="bandwidth"
                id="bandwidth"
                onChange={handleChange}
                value={ips.bandwidth}
                placeholder="Enter Bandwidth"
              />
            </div>
            <div className="input">
              <label htmlFor="provider">Select Provider's Name</label>

              <select
                name="provider"
                id="provider"
                onChange={handleChange}
                value={ips.provider}
                required
              >
                <option value="">-- Select Provider --</option>
                <option value="PGCIL">PGCIL</option>
                <option value="RAILTEL">RAILTEL</option>
                <option value="BSNL">BSNL</option>
              </select>
            </div>
          </div>
          {message && <div className="message">{message}</div>}
          <div className="add-ip-button">
            <button type="submit">{isEdit ? "Update" : "Save Ip"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIPAddress;
