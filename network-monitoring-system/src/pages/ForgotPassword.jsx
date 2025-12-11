import React from "react";
import { useState } from "react";
import "../css/resetpassword.css";
import axios from "axios";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const handleForgotPassword = async(e) => {
    e.preventDefault();
    const response=await axios.post("http://localhost:2001/forgot-password",{email})
    setMessage(response.data.message);
  };
  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-heading">
          <h3>Forgot password</h3>
        </div>
        <form className="forgot-password" onSubmit={handleForgotPassword}>
          <div className="input">
            <label htmlFor="">Enter your email</label>
            <input
              type="text"
              name="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Enter your gmail"
            />
          </div>
          <button className="forgot-password-button" onClick={handleForgotPassword}>Forgot Password</button>
          <div className="forgot-message" >{message}</div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
