import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import StudentDetailPage from './pages/StudentDetailPage';
import AttendancePage from './pages/AttendancePage';
import FeesPage from './pages/FeesPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ParentDashboard from './pages/ParentDashboard';
import Navbar from './layout/Navbar';
function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Admin-only */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/fees" element={<FeesPage />} />
      </Route>

      {/* Teacher-only */}
      <Route element={<ProtectedRoute role="teacher" />}>
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/attendance" element={<AttendancePage />} />
      </Route>

      {/* Parent-only */}
      <Route element={<ProtectedRoute role="parent" />}>
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/students/:id" element={<StudentDetailPage />} />
      </Route>

      {/* Shared Auth Route (optional) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}

export default App;
