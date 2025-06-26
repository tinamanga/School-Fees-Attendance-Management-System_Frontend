import { useEffect, useState } from "react";

function AttendanceForm() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    student_id: "",
    teacher_id: "", // Later you can derive this from logged-in user
    status: "Present",
  });

  useEffect(() => {
    fetch("http://127.0.0.1:5000/students")
      .then((r) => r.json())
      .then(setStudents);
  }, []);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetch("http://127.0.0.1:5000/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((r) => {
        if (r.ok) {
          alert("Attendance recorded successfully");
          setFormData({ ...formData, student_id: "", status: "Present" });
        } else {
          alert("Error recording attendance");
        }
      });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label>
        Student:
        <select name="student_id" value={formData.student_id} onChange={handleChange}>
          <option value="">Select Student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Teacher ID:
        <input
          type="number"
          name="teacher_id"
          value={formData.teacher_id}
          onChange={handleChange}
          placeholder="Enter your ID"
        />
      </label>

      <label>
        Status:
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
      </label>

      <button type="submit">Submit Attendance</button>
    </form>
  );
}

export default AttendanceForm;
