import React from "react";
import "../styles/Layout.css";

function Navbar() {
  return (
    <header className="navbar">
      <h1 className="navbar-title">School Management System</h1>
      <button className="logout-button">Logout</button>
    </header>
  );
}

export default Navbar;
