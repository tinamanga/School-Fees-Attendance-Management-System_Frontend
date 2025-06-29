import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import UserContext from "./UserContext";
import DashboardLayout from "./components/DashboardLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Attendance from "./pages/Attendance";
import Payments from "./pages/Payments";
import Classrooms from "./pages/Classrooms";
import AttendanceHistory from "./pages/AttendanceHistory";
import StudentReport from "./components/StudentReport";

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

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {user && (
            <>
              <Route
                path="/dashboard"
                element={
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                }
              />

              <Route
                path="/students"
                element={
                  user.role === "admin" ? (
                    <DashboardLayout>
                      <Students />
                    </DashboardLayout>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route
                path="/classrooms"
                element={
                  user.role === "admin" ? (
                    <DashboardLayout>
                      <Classrooms />
                    </DashboardLayout>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route
                path="/payments"
                element={
                  user.role === "admin" ? (
                    <DashboardLayout>
                      <Payments />
                    </DashboardLayout>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route
                path="/attendance"
                element={
                  user.role === "teacher" ? (
                    <DashboardLayout>
                      <Attendance />
                    </DashboardLayout>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route
                path="/attendance-history"
                element={
                  user.role === "admin" || user.role === "teacher" ? (
                    <DashboardLayout>
                      <AttendanceHistory />
                    </DashboardLayout>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route
                path="/student-report"
                element={
                  user.role === "admin" ? (
                    <DashboardLayout>
                      <StudentReport />
                    </DashboardLayout>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            </>
          )}
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
