import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import the FontAwesomeIcon component
import { faTowerBroadcast,faFileLines,faScrewdriverWrench } from "@fortawesome/free-solid-svg-icons";
import '../css/components.css'

const Tools = (props) => {
  return (
    <div className="feature-card">
      <div className="card-icon">
        <FontAwesomeIcon icon={props.icon} />
      </div>
      <div className="card-content">
        <h2>{props.heading}</h2>
        <p>{props.description}</p>
      </div>
    </div>
  );
};

export default Tools;
