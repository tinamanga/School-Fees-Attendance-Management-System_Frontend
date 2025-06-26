import React, { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import UserForm from "../components/UserForm";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedClassroom, setSelectedClassroom] = useState("");

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

  const downloadClassReport = () => {
    if (!selectedClassroom) return alert("Please select a class first.");
    const url = `/reports/classroom/${selectedClassroom}/pdf`;
    window.open(url, "_blank");
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

          <div className="admin-dashboard-actions">
            <button onClick={sendFeeAlerts} className="alert-btn">
              Send SMS Fee Alerts
            </button>

            <select
              className="classroom-select"
              value={selectedClassroom}
              onChange={(e) => setSelectedClassroom(e.target.value)}
            >
              <option value="">Select class for PDF report</option>
              <option value="1">Class 1</option>
              <option value="2">Class 2</option>
              <option value="3">Class 3</option>
              {/* Add more as needed */}
            </select>

            <button onClick={downloadClassReport} className="pdf-btn">
              Download Class Report PDF
            </button>
          </div>

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
