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

import "./App.css";

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
        <div className={`app-container ${!user ? "login-mode" : ""}`}>
          {user && (
            <aside className="sidebar">
              <h2 className="school-title">MACMILLAN SCHOOL</h2>
              <nav className="sidebar-nav">
                <ul>
                  <li><a href="/dashboard">Dashboard</a></li>
                  {user.role === "admin" && <li><a href="/students">Students</a></li>}
                  {user.role === "admin" && <li><a href="/classrooms">Classrooms</a></li>}
                  {user.role === "teacher" && <li><a href="/attendance">Attendance</a></li>}
                  {user.role === "admin" && <li><a href="/payments">Payments</a></li>}
                  {(user.role === "admin" || user.role === "teacher") && (
                    <li><a href="/attendance-history">History</a></li>
                  )}
                  <li>
                    <button
                      className="logout-btn"
                      onClick={() => {
                        setUser(null);
                        localStorage.removeItem("user");
                        window.location.href = "/login";
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </nav>
            </aside>
          )}

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
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
          </main>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
