
import React, { useEffect, useState } from "react";
import "../styles/AttendancePage.css";

function AttendancePage() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch students on load
  useEffect(() => {
    fetch("http://127.0.0.1:5000/students")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        // Initialize attendance state
        const initial = {};
        data.forEach((student) => {
          initial[student.id] = "Present"; // default status
        });
        setAttendance(initial);
        setLoading(false);
      });
  }, []);

  const handleChange = (studentId, status) => {
    setAttendance({ ...attendance, [studentId]: status });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const studentId in attendance) {
      const res = await fetch("http://127.0.0.1:5000/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: parseInt(studentId),
          teacher_id: user.id, // from localStorage
          status: attendance[studentId],
        }),
      });

      if (!res.ok) {
        console.error(`Failed to record attendance for student ${studentId}`);
      }
    }

    alert("Attendance submitted successfully!");
  };

  if (loading) return <p>Loading students...</p>;

  return (
    <div className="attendance-container">
      <h1 className="attendance-title">Mark Attendance</h1>
      <form onSubmit={handleSubmit} className="attendance-form">
        {students.map((student) => (
          <div key={student.id} className="attendance-row">
            <span>{student.name}</span>
            <select
              value={attendance[student.id]}
              onChange={(e) => handleChange(student.id, e.target.value)}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
        ))}
        <button type="submit" className="attendance-submit">Submit Attendance</button>
      </form>
    </div>
  );
}

export default AttendancePage;
