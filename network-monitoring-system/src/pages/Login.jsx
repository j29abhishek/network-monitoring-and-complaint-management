import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../css/complaint.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
const Login = () => {
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    if (!number || !password) {
      setMessage("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post("http://localhost:2001/login", {
        number,
        password,
      });

      // Check for response validity

      if (response.status === 200) {
        const { token, userType, userStatus } = response.data;
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("userType", userType);
          if (userType === "user" && userStatus !== "active") {
            return setMessage(
              "Your Account is not activated, kindly wait for activation."
            );
          }
          if (userType === "user") {
            navigate("/userDashboard"); //redirect to dashboard
          } else {
            navigate("/admin-dashboard");
          }
        } else {
          setMessage("Invalid login");
        }
      }
    } catch (error) {
      console.error("Login error:", error);

      // Check if the error has a specific message from the server
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMessage(error.response.data.message); // Use the error message from the server
      } else {
        setMessage("An error occurred during login. Please try again later.");
      }
    }
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible); // Toggle password visibility state
  };

  return (
    <div className="login-page-body">
      <div className="login-page">
        <div className="sign-up-title">
          <FontAwesomeIcon
            icon={faArrowLeftLong}
            onClick={() => navigate(-1)}
            className="back-button"
          />
          <h3>Login to your account</h3>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          <div className="login-inputs">
            <div className="input">
              <label htmlFor="number">
                Mobile Number <span className="required">*</span>
              </label>
              <input
                type="tel"
                name="number"
                id="number"
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, ""); // Removes non-digits
                  setNumber(onlyDigits);
                }}
                value={number}
                maxLength={10}
                placeholder="Enter your mobile number"
                required
              />
            </div>

            <div className="input s-input">
              <label htmlFor="password">
                Password <span className="required">*</span>
              </label>
              <input
                type={isPasswordVisible ? "text" : "password"} // Conditionally set input type
                name="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Enter your password"
                required
              />
              <img
                src={
                  isPasswordVisible ? "hidepassword.png" : "showpassword.png"
                } // Change icon based on visibility
                alt="show-password-icon"
                onClick={togglePasswordVisibility} // Toggle visibility
                className="password-show"
              />
            </div>

            {message && <div className="message">{message}</div>}

            <div className="sign-up-submit">
              <button type="submit" className="sign-up-button">
                Login
              </button>
              <div className="login-link">
                <p>
                  New user?{" "}
                  <Link to="/signup">
                    <span>sign up</span>
                  </Link>
                </p>
              </div>
              <Link to="/forgot-password" className="forget-password">
                Forget password?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
