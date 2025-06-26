import React from "react";
import Navbar from "../layout/Navbar"; 
import "../styles/AdminDashboard.css"; 

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user?.role ?? "Admin"}</h1>
        
        <div className="space-y-4">
          <p className="text-gray-700">From this dashboard, you can:</p>
          <ul className="list-disc pl-5 text-gray-600">
            <li>Register new teachers or parents</li>
            <li>Enroll new students</li>
            <li>View school-wide statistics</li>
            <li>Monitor fee payments and attendance</li>
          </ul>
        </div>
      </div>
    </>
  );
}
