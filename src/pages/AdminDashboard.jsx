import React from "react";
import Navbar from "../layout/Navbar"; 
import UserForm from '../components/UserForm';
import "../styles/AdminDashboard.css"; 

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Navbar />
      <div className="admin-dashboard-container">
        <h1 className="admin-dashboard-title">Welcome, {user?.role ?? "Admin"}</h1>
        
        <div className="admin-dashboard-content">
          <p className="admin-dashboard-description">From this dashboard, you can:</p>
          <ul className="admin-dashboard-list">
            <li>Register new teachers or parents</li>
            <li>Enroll new students</li>
            <li>View school-wide statistics</li>
            <li>Monitor fee payments and attendance</li>
          </ul>
        </div>

        {/* Optional: Render the user form component */}
        <div className="admin-dashboard-form-section">
          <h2>Create New User</h2>
          <UserForm />
        </div>
      </div>
    </>
  );
}
