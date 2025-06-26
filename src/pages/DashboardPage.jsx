
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import "../styles/DashboardPage.css";

function DashboardPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const [stats, setStats] = useState({ total_students: 0, total_fees_collected: 0 });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (role === "admin") {
      fetch("http://127.0.0.1:5000/dashboard")
        .then((res) => res.json())
        .then((data) => setStats(data))
        .catch((err) => console.error("Failed to fetch dashboard stats:", err));
    }
  }, [navigate, role]);

  const renderDashboard = () => {
    switch (role) {
      case "admin":
        return (
          <>
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <div className="dashboard-cards">
              <div className="card">
                <h2>Total Students</h2>
                <p>{stats.total_students}</p>
              </div>
              <div className="card">
                <h2>Fees Collected</h2>
                <p>KES {stats.total_fees_collected.toLocaleString()}</p>
              </div>
              <div className="card">
                <h2>Attendance Today</h2>
                <p>98%</p> {/* You can fetch real attendance later */}
              </div>
            </div>
          </>
        );
      case "teacher":
        return (
          <>
            <h1 className="dashboard-title">Teacher Dashboard</h1>
            <p className="dashboard-info">Take attendance and review student performance here.</p>
          </>
        );
      case "parent":
        return (
          <>
            <h1 className="dashboard-title">Parent Dashboard</h1>
            <p className="dashboard-info">View your child’s attendance and payment history.</p>
          </>
        );
      default:
        return <p className="dashboard-info">Unauthorized or unknown role.</p>;
    }
  };

  return <DashboardLayout>{renderDashboard()}</DashboardLayout>;
}

export default DashboardPage;
