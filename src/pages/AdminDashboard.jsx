import { useEffect, useState } from "react"
import { apiFetch } from "../api"
import StudentTable from "../components/StudentTable"
import StudentForm from "../components/StudentForm"

function AdminDashboard() {
  const [students, setStudents] = useState([])
  const [dashboard, setDashboard] = useState({})

  useEffect(() => {
    apiFetch("/students").then(setStudents)
    apiFetch("/dashboard").then(setDashboard)
  }, [])

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Students</h3>
          <p>{dashboard.total_students}</p>
        </div>
        <div className="stat-card">
          <h3>Total Fees Collected</h3>
          <p>KES {dashboard.total_fees_collected}</p>
        </div>
      </div>
      <div className="dashboard-content">
        <StudentForm onNewStudent={student => setStudents(prev => [...prev, student])} />
        <StudentTable students={students} />
      </div>
    </div>
  )
}

export default AdminDashboard
