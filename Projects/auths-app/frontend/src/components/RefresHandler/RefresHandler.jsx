import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RefresHandler = ({ setIsAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsAuthenticated(true);
      if (
        location.pathname === "/" ||
        location.pathname === "/login" ||
        location.pathname === "/signup"
      ) {
        navigate("/home", { replace: false });
      }
    }
  }, [location, setIsAuthenticated, navigate]);

  return null;
};

export default RefresHandler;
