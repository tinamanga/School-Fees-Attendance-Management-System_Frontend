import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/StudentDetailsPage.css";

export default function StudentDetailsPage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/students/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setStudent(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!student) return <p className="p-4 text-red-500">Student not found.</p>;

  return (
    <div className="student-details">
      <h2>{student.name}</h2>
      <p><strong>Class:</strong> {student.classroom_name}</p>
      <p><strong>Guardian:</strong> {student.guardian_name} ({student.guardian_contact})</p>
      <p><strong>Total Paid:</strong> KES {student.total_paid}</p>
      <p><strong>Expected:</strong> KES {student.expected_total}</p>
      <p><strong>Balance:</strong> KES {student.balance}</p>

      <h3>Fees</h3>
      <ul>
        {student.fees.map((f, i) => (
          <li key={i}>{f.term} - KES {f.amount} on {f.payment_date}</li>
        ))}
      </ul>

      <h3>Attendance</h3>
      <ul>
        {student.attendance.map((a, i) => (
          <li key={i}>{a.date} - {a.status}</li>
        ))}
      </ul>
    </div>
  );
}
