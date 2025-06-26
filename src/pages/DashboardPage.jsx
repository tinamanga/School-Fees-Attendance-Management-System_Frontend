import React from "react";
import DashboardLayout from "../layout/DashboardLayout"; 

function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Welcome to the Dashboard</h1>

        <div className="dashboard-cards">
          <div className="card">
            <h2>Total Students</h2>
            <p>125</p>
          </div>
          <div className="card">
            <h2>Fees Collected</h2>
            <p>KES 300,000</p>
          </div>
          <div className="card">
            <h2>Attendance Today</h2>
            <p>98%</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;
