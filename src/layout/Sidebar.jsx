import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Layout.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
        <NavLink to="/students" className="nav-link">Students</NavLink>
        <NavLink to="/attendance" className="nav-link">Attendance</NavLink>
        <NavLink to="/fees" className="nav-link">Fees</NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
