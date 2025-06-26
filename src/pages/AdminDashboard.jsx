import React, { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import UserForm from "../components/UserForm";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/dashboard", {
          credentials: "include",
        });
        const data = await res.json();
        setSummary(data);
      } catch (error) {
        console.error("Failed to fetch dashboard summary", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/classrooms", {
          credentials: "include",
        });
        const data = await res.json();
        setClassrooms(data);
      } catch (error) {
        console.error("Failed to load classrooms", error);
      }
    };

    fetchClassrooms();
  }, []);

  const sendFeeAlerts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/alerts/fees-due", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      alert(`${data.length} SMS alerts sent.`);
    } catch (error) {
      alert("Failed to send alerts.");
      console.error(error);
    }
  };

  const downloadClassReport = () => {
    if (!selectedClassroom) {
      alert("Please select a class first.");
      return;
    }
    const url = `http://127.0.0.1:5000/reports/classroom/${selectedClassroom}/pdf`;
    window.open(url, "_blank");
  };

  const capitalize = (text) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1) : "Admin";

  return (
    <>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div
          className="admin-dashboard-container"
          style={{ marginLeft: "220px", padding: "20px", flexGrow: 1 }}
        >
          <h1 className="admin-dashboard-title">
            Welcome, {capitalize(user?.role)}
          </h1>

          <div className="admin-dashboard-content">
            <p className="admin-dashboard-description">
              From this dashboard, you can:
            </p>
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
                {classrooms.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>

              <button onClick={downloadClassReport} className="pdf-btn">
                Download Class Report PDF
              </button>
            </div>

            {loading ? (
              <p>Loading summary...</p>
            ) : (
              <div className="summary-cards">
                <div className="card">
                  Total Students: <strong>{summary?.total_students}</strong>
                </div>
                <div className="card">
                  Total Fees Collected:{" "}
                  <strong>KES {summary?.total_fees_collected}</strong>
                </div>
                <div className="card">
                  Attendance Today:{" "}
                  <strong>{summary?.attendance_today}%</strong>
                </div>
              </div>
            )}
          </div>

          <div className="admin-dashboard-form-section">
            <h2>Create New User</h2>
            <UserForm />
          </div>
        </div>
      </div>
    </>
  );
}
