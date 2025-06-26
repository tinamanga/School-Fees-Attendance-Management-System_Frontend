import React, { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import UserForm from '../components/UserForm';
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setSummary(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const sendFeeAlerts = () => {
    fetch("/alerts/fees-due", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        alert(`${data.length} SMS alerts sent.`);
      })
      .catch(() => alert("Failed to send alerts."));
  };

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

          <button onClick={sendFeeAlerts} className="alert-btn">
            Send SMS Fee Alerts
          </button>

          {loading ? <p>Loading summary...</p> : (
            <div className="summary-cards">
              <div className="card">Total Students: <strong>{summary?.total_students}</strong></div>
              <div className="card">Total Fees Collected: <strong>KES {summary?.total_fees_collected}</strong></div>
            </div>
          )}
        </div>

        <div className="admin-dashboard-form-section">
          <h2>Create New User</h2>
          <UserForm />
        </div>
      </div>
    </>
  );
}
