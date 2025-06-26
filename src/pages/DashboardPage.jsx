import React from "react";
import DashboardLayout from "../layout/DashboardLayout";

function DashboardPage() {
  const userRole = localStorage.getItem("role"); // e.g. 'admin', 'teacher', 'parent'

  const renderDashboard = () => {
    switch (userRole) {
      case "admin":
        return (
          <>
            <h1>Admin Dashboard</h1>
            <div className="dashboard-cards">
              <div className="card"><h2>Total Students</h2><p>125</p></div>
              <div className="card"><h2>Fees Collected</h2><p>KES 300,000</p></div>
              <div className="card"><h2>Attendance Today</h2><p>98%</p></div>
            </div>
          </>
        );
      case "teacher":
        return (
          <>
            <h1>Teacher Dashboard</h1>
            <p>Take attendance and review student performance here.</p>
          </>
        );
      case "parent":
        return (
          <>
            <h1>Parent Dashboard</h1>
            <p>View your child’s attendance and payment history.</p>
          </>
        );
      default:
        return <p>Unauthorized or unknown role.</p>;
    }
  };

  return <DashboardLayout>{renderDashboard()}</DashboardLayout>;
}

export default DashboardPage;
