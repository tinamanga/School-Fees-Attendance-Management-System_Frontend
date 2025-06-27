import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserContext from "./UserContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Attendance from "./pages/Attendance";
import Payments from "./pages/Payments";
import Classrooms from "./pages/Classrooms";
import AttendanceHistory from "./pages/AttendanceHistory";


function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <div>
          <h1>School Fees & Attendance System</h1>
          <nav>
            <a href="/dashboard">Dashboard</a> |{" "}
            <a href="/students">Students</a> |{" "}
            <a href="/classrooms">Classrooms</a> |{" "}
            <a href="/attendance">Attendance</a> |{" "}
            <a href="/payments">Payments</a> |{" "}
            <a href="/attendance-history">History</a> |{" "}
            <a href="/login">Logout</a>
          </nav>

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* 🔒 Admin only */}
            <Route
              path="/students"
              element={
                user && user.role === "admin" ? (
                  <Students />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* 🔒 Admin only */}
            <Route
              path="/classrooms"
              element={
                user && user.role === "admin" ? (
                  <Classrooms />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* 🔒 Teacher only */}
            <Route
              path="/attendance"
              element={
                user && user.role === "teacher" ? (
                  <Attendance />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* 🔒 Admin only */}
            <Route
              path="/payments"
              element={
                user && user.role === "admin" ? (
                  <Payments />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/attendance-history"
              element={
                user && (user.role === "admin" || user.role === "teacher") ? (
                  <AttendanceHistory />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />


          </Routes>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
