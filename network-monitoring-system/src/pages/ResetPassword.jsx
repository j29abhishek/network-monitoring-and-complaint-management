import React, { useState } from "react";
import '../css/resetpassword.css'
import axios from "axios";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const {token}=useParams();
  const [message,setMessage]=useState("");

  const handleResetPassword = async() => {
    const response=await axios.post("http://localhost:2001/reset-password",{token,
      newPassword:confirmPassword,
    });

    setMessage(response.data.message);
  };
  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-heading">
          <h3>Reset Password</h3>
        </div>
        <form className="reset-password" onSubmit={handleResetPassword}>
          <div className="inputs">
            <div className="input">
              <label htmlFor="">New password</label>
              <input
                type="text"
                name="newPassword"
                id="newPassword"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
              />
            </div>
            <div className="input">
              <label htmlFor="">Confirm password</label>
              <input
                type="text"
                name="confirmPassword"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </div>
          </div>
          <button type="submit" className="reset-password-button">Reset Password</button>
          <div className="reset-message">{message}</div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
