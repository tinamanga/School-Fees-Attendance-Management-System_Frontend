import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Layout.css"; 

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <h1 className="navbar-title">School Management System</h1>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}

export default Navbar;
