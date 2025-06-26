
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <ul>
        <li><Link to="/admin-dashboard">Dashboard</Link></li>
        <li><Link to="/students">Students</Link></li>
        <li><Link to="/teachers">Teachers</Link></li>
        <li><Link to="/attendance">Attendance</Link></li>
        <li><Link to="/fees">Fees</Link></li>
      </ul>
    </div>
  );
}
