import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoutes = ({ allowedRoles }) => {
  const [authStatus, setAuthStatus] = useState("loading"); // 'loading' | 'unauthorized' | 'authorized'
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkUserRole = async () => {
      if (!token) {
        setAuthStatus("unauthorized");
        return;
      }

      try {
        const response = await axios.get("http://localhost:2001/check-role", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userRole = response.data.role;

        if (allowedRoles.includes(userRole)) {
          setAuthStatus("authorized");
        } else {
          setAuthStatus("unauthorized");
        }
      } catch (err) {
        setAuthStatus("unauthorized");
      }
    };

    checkUserRole();
  }, [allowedRoles, token]);

  if (authStatus === "loading") {
    return <div>Loading...</div>; // 
  }

  if (authStatus === "unauthorized") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
