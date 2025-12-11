import React, { useState, useEffect } from "react";
import "../css/navbar.css";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    const type = localStorage.getItem("userType");

    if (token && type) {
      setIsLoggedIn(true);
      setUserType(type);
    } else {
      setIsLoggedIn(false);
      setUserType("");
    }
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  // Navigate to Dashboard based on userType
  const goToDashboard = () => {
    if (userType === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/userDashboard");
    }
  };

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  return (
    <div className="navbar" id="pagetop">
      <div className="logo">NETWORK MONITORING SYSTEM</div>

      <div className="menu-icon" onClick={toggleMenu}>
        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
      </div>

      <div className={`page-links ${menuOpen ? "open" : ""}`}>
        <ul className="nav-links" onClick={closeMenu}>
          <li><HashLink smooth to="/#">Home</HashLink></li>
          <li><HashLink smooth to="/#features">Features</HashLink></li>
          <li><HashLink smooth to="/#nms-tools">Tools</HashLink></li>
          <li><HashLink smooth to="/#about-the-system">About</HashLink></li>
          <li><RouterLink to="/complaint-form">Complaint</RouterLink></li>
        </ul>

        <div className="login-signup" onClick={closeMenu}>
          {!isLoggedIn ? (
            <>
              <RouterLink to="/login">Login</RouterLink>
              <RouterLink to="/signup">
                <button className="sign-up">Sign Up</button>
              </RouterLink>
            </>
          ) : (
            <>
              <RouterLink to="#" onClick={handleLogout}>Logout</RouterLink>
              <button className="sign-up" onClick={goToDashboard}>Dashboard</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
