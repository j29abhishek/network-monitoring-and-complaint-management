import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

import "../css/dnstoip.css";
import BackToDashboard from "../components/BackToDashboard";

const DNStoIP = () => {
  const [copied, setCopied] = useState(false);
  const [dns, setDns] = useState("");
  const [ipv4, setIpv4] = useState([]);
  const [ipv6, setIpv6] = useState([]);
 const [error,setError]=useState("");
  const handleChange = (e) => {
    setDns(e.target.value);
  };

  const navigate=useNavigate();
  const handleCopy = async (ip) => {
    try {
      await navigator.clipboard.writeText(ip);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.log("Failed to copy!", error);
    }
  };

  const handleGoToDashbaord=()=>{
   const userType=localStorage.getItem("userType");
   if(userType==="admin"){
    navigate('/admin-dashboard')
   }else{
    navigate('/userDashboard')
   }
    
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    const cleanDns = dns.replace(/^https?:\/\//, ""); // strip http/https
    setIpv4([]);
    setIpv6([]);
    try {
      const response = await axios.post("http://localhost:2001/convertDNS", {
        dns: cleanDns,
      });
      setIpv4(response.data.ipv4 || []);
      setIpv6(response.data.ipv6 || []);
    } catch (error) {
      setError("Check URL and Enter again.")
      setTimeout(()=>{
        setError("");
      },1000)
      console.log(error);
    }

    console.log("Cleaned Domain:", cleanDns);
  };

  return (
    <div className="dns-lookup-page">
      <div className="dns-navbar">
        
        <div className="dns-logo">DNS TO IP CONVERTER</div>
        <ul className="dns-links">
          
          <li>
           <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/ping-testing">Ping Test</Link>
          </li>
          <li  className="dnsip-to-dashboard" onClick={handleGoToDashbaord}>Dashbaord</li>
          
        </ul>
      </div>
      <div className="dns-contents">
        <div className="dns-lookup-area">
          <form onSubmit={handleSubmit} className="dns-form">
            <div className="dns-input">
              <input
                type="text"
                value={dns}
                placeholder="Enter URL or Domain name"
                onChange={handleChange}
              />
              <button className="dns-button" type="submit">
                Find IP address
              </button>
            </div>
          </form>
        </div>
        <div className="dns-about-area">
          <p>
           Find all IP addresses associated with a website using DNSxIP. For example, enter facebook.com or google.com to view their IP addresses.
          </p>
        </div>
        <div className="dns-info">
          <p className="error-message">{error}</p>
          {ipv4.length > 0 && (
            <div className="dnsipcopy">
              <h4>IPv4 Addresses:</h4>
              {ipv4.map((ip, index) => (
                <div key={index} className="dns-ip-entry">
                  <p className="dns-ip-address">{ip} </p>
                  <button onClick={() =>handleCopy(ip)}>
                    <FontAwesomeIcon icon={faCopy} className="copy-to-clip" />
                  </button>
                </div>
              ))}
              {copied &&<span className="copied-message">✅ Copied!</span>}
            </div>
          )}
          {ipv6.length > 0 && (
            <div>
              <h4>IPv6 Addresses:</h4>
              {ipv6.map((ip, index) => (
                <div key={index} className="dns-ip-entry">
                  <p className="dns-ip-address">{ip} </p>
                  
                  <button onClick={()=> handleCopy(ip)}>
                    <FontAwesomeIcon icon={faCopy} className="copy-to-clip" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* <div className="dns-footer">
        Developed By- Abhishek Jaiswal
      </div> */}
    </div>
  );
};

export default DNStoIP;
