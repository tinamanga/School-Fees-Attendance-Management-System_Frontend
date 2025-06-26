import { Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import AdminDashboard from "./pages/AdminDashboard"
import TeacherDashboard from "./pages/TeacherDashboard"
import StudentDetailsPage from "./pages/StudentDetailsPage"
import NotFound from "./pages/NotFound"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard/admin" element={<AdminDashboard />} />
      <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
      <Route path="/students/:id" element={<StudentDetailsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
