import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import "../css/admindashboard.css";
import { useNavigate } from "react-router-dom";

const BackToDashboard = () => {
    const navigate=useNavigate();
  return (
    <button className="go-to-dashboard" onClick={() => navigate(-1)}>
      <FontAwesomeIcon icon={faArrowLeftLong} className="back-icon" />
    </button>
  );
};

export default BackToDashboard;
