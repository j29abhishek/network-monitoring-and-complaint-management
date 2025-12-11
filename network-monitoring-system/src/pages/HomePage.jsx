import React from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import FeatureCard from "../components/FeatureCard";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faReact,faNodeJs,faSquareJs} from "@fortawesome/free-brands-svg-icons"

import {
  faChartSimple,
  faFileLines,
  faTowerBroadcast,
  faWrench,
  faServer,
  faSignal
} from "@fortawesome/free-solid-svg-icons";
import "../css/homepage.css";
import introImage from "../assets/introduction-image.jpeg";
import nms from "../assets/nms.png"
import Footer from "../components/Footer";
import Tools from "../components/Tools";
const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className="website-introduction">
        <div className="introduction-contents">
          <h1>
          Platform for Real-Time Network Monitoring & Complaint Resolution
          </h1>
          <p>Streamline your operations with a centralized system that empowers you to monitor network activity in real-time, report issues instantly, and resolve complaints efficiently — all from one intuitive interface.</p>
          <p>  Monitor. Report. Resolve. — All from a Single Dashboard.</p>
          <Link to="/complaint-form">
          <button className="report-issue">Report an issue</button>
          </Link>
          
        </div>
        <div className="intro-image">
          <img src={introImage} alt="" />
        </div>
      </div>
      <div className="homepage-feature" id="features">
        <div className="feature-heading">
          <h2 className="m-10">Features</h2>
        </div>
        <div className="feature-container">
          <FeatureCard
            icon={faTowerBroadcast}
            heading="Live Network Monitoring"
            description="Real-time pinging of network nodes to monitor availability, latency, and overall network health."
          />
          <FeatureCard
            icon={faFileLines}
            heading="Complaint Management"
            description="A simple complaint management system where users can easily submit issues through an online complaint form for quick tracking and resolution."
          />
           <FeatureCard
            icon={faWrench}
            heading="Analytics"
            description="Admins take-action, track status, generate reports, and analyze performance"
          />
          <FeatureCard
            icon={faChartSimple}
            heading="Built-in-Tools"
            description="Built-in tools empower teams to diagnose issues, perform IP lookups, monitor uptime, and convert DNS records with ease."
          />
        </div>
      </div>

      <div className="homepage-feature">
        <div className="feature-heading">
           <h2 className="m-10">Tools</h2>
        </div>
        <div className="feature-container" id="nms-tools">
           <Tools
            icon={faServer}
            heading="DNSxIP"
            description="dnsxip is a built-in, lightweight tool that instantly converts domain names into their corresponding IP addresses, making network checks quick and easy."
          />

          <Tools
            icon={faSignal}
            heading="Ping IP"
            description="Ping IP is a lightweight tool that checks the reachability and response time of any IP address, making network monitoring simple and reliable."
          />
        </div>
      </div>

      <div className="about-the-system" id="about-the-system">
          <div className="about-system-image">
            <img src={nms} alt="network monitoring system demo" />
          </div>
          <div className="about-description">
            <h2 className="about-heading">About the System</h2>
            <p className="system-description">
              The Network Monitoring System is designed to continuously monitor the status of institutional IP addresses in real-time. It automatically pings each IP at regular intervals, detects connectivity issues, and logs any status changes along with timestamps. The system offers a clear and organized view of network health, enabling administrators to quickly identify and respond to any outages or downtime across different institutions.
            </p>
            <div className="tech-icons">
              <FontAwesomeIcon icon={faReact} className="react-icon"/>
              <FontAwesomeIcon icon={faNodeJs} className="node-icon"/>
              <FontAwesomeIcon icon={faSquareJs} className="js-icon"/>
            </div>
          </div>
      </div>

      <Footer/>
    </>
  );
};

export default HomePage;
