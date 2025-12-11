import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import "../css/complaint.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";

const SignUp = () => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [email,setEmail]=useState("");
  const navigate = useNavigate();

  const passwordFormat = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    return regex.test(password);
  };

  //To ensure mobile number must be exactly 10 digit, for max i have used maxlength={10}, property in the input:type=tel in number field
  useEffect(() => {
    if (number.length > 0 && number.length < 10) {
      setMessage("Mobile number must be exactly 10 digits");
    } else {
      setMessage(""); // Clear message when valid
    }
  }, [number]);

  // to use handle change we can use onchange
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!passwordFormat(password)) {
      setMessage(
        "Password must contain at least one uppercase letter, one digit, one special character, and be atleast 6 digits long. "
      );
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:2001/signup", {
        name,
        number,
        password,
        email,
      });

      console.log(response); // to check respons status

      if (response.status === 201) {
        setMessage("Signup successful!");
        console.log("Details:", name, number, password);
        navigate("/login"); //redirect to login page
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage("Mobile number already exists!");
      } else {
        setMessage("Signup failed! Please try again.");
      }
    }
  };
  const showPassword = () => {
    let btn = document.getElementById("password");
    let imgurl = document.getElementById("show-icon");
    let show = "showpassword.png";
    let hide = "hidepassword.png";

    // Extract the image filename from the full URL
    let img = imgurl.src.split("/").pop();

    if (btn.type === "password" && img === show) {
      btn.type = "text";
      imgurl.src = hide; //Update imgurl.src instead of img
    } else {
      btn.type = "password";
      imgurl.src = show; //Update imgurl.src instead of img
    }
  };

  return (
    <div className="sign-up-page">
      <div className="sign-up-container">
        <div className="sign-up-title">
          <FontAwesomeIcon
            icon={faArrowLeftLong}
            onClick={() => navigate(-1)}
            className="back-button"
          />
          <h3>Create Account</h3>
        </div>

        <form action="" onSubmit={handleSignUp} className="sign-up-form">
          <div className="sign-up-inputs">
            <div className="input">
              <label htmlFor="Name">
                Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="input">
              <label htmlFor="Mobile Number">
                Mobile Number <span class="required">*</span>
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
                // pattern="[0-9]{10}"
                placeholder="Enter your mobile number"
                required
              />
            </div>

            <div className="input">
              <label htmlFor="gmail">
                Email <span class="required"></span>
              </label>
              <input
                type="text"
                name="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Enter your name"
                // required
              />
            </div>

            <div className="input s-input">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Enter new password"
                required
              />
              {/* <div className="password-show"> */}
              <img
                src="showpassword.png"
                alt="show-password-icon"
                id="show-icon"
                onClick={showPassword}
                className="password-show"
              />
              {/* </div> */}
            </div>
            <div className="input">
              <label htmlFor="Name">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                id="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="confirm password"
                required
              />
            </div>
          </div>
          <div className="message">{message}</div>
          <div className="sign-up-submit">
            <button type="submit" className="sign-up-button">
              Sign Up
            </button>
            <div className="login-link">
              <p>
                Already have an account?{" "}
                <Link to="/login">
                  <span>login</span>
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
