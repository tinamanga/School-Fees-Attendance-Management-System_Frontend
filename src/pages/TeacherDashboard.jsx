import { useEffect, useState } from "react";
import "../styles/TeacherDashboard.css";

export default function TeacherDashboard() {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState({});
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/students")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        const initial = {};
        data.forEach((s) => {
          initial[s.id] = "Present";
        });
        setSelected(initial);
      })
      .catch(() => setMessage("Failed to load students."));
  }, []);

  const handleChange = (id, status) => {
    setSelected((prev) => ({ ...prev, [id]: status }));
  };

  const handleSubmit = async () => {
    const teacher = JSON.parse(localStorage.getItem("user"));
    if (!teacher) return setMessage("User not found.");

    try {
      const attendanceData = students.map((s) => ({
        student_id: s.id,
        teacher_id: teacher.id,
        status: selected[s.id],
      }));

      for (const record of attendanceData) {
        await fetch("http://127.0.0.1:5000/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(record),
        });
      }

      setMessage("Attendance recorded successfully.");
    } catch {
      setMessage("Failed to submit attendance.");
    }
  };

  return (
    <div className="teacher-dashboard">
      <h1 className="dashboard-title">Teacher Dashboard</h1>

      {message && <p className="message">{message}</p>}

      <table className="student-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Present</th>
            <th>Absent</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>
                <input
                  type="radio"
                  name={`status-${s.id}`}
                  value="Present"
                  checked={selected[s.id] === "Present"}
                  onChange={() => handleChange(s.id, "Present")}
                />
              </td>
              <td>
                <input
                  type="radio"
                  name={`status-${s.id}`}
                  value="Absent"
                  checked={selected[s.id] === "Absent"}
                  onChange={() => handleChange(s.id, "Absent")}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="submit-button" onClick={handleSubmit}>
        Submit Attendance
      </button>
    </div>
  );
}
