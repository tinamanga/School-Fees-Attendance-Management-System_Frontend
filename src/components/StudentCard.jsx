
import React from "react";
import "../styles/StudentCard.css";

export default function StudentCard({ student, onView }) {
  return (
    <div className="student-card">
      <h3 className="student-name">{student.name}</h3>
      <p><strong>Class:</strong> {student.classroom_name || "N/A"}</p>
      <p><strong>Guardian:</strong> {student.guardian_name}</p>
      <p><strong>Contact:</strong> {student.guardian_contact}</p>
      <p><strong>Fees:</strong> {student.fee_status || "Not Available"}</p>
      <p><strong>Attendance:</strong> {student.attendance_percent || "N/A"}%</p>

      <button className="view-button" onClick={() => onView(student.id)}>
        View Details
      </button>
    </div>
  );
}
