import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/StudentDetailsPage.css";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

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
      .catch(() => setLoading(false));
  }, [id]);

  const downloadPDF = () => {
    window.open(`/students/${id}/report`, "_blank");
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (!student) return <p className="p-4 text-red-500">Student not found.</p>;

  const pieData = {
    labels: ["Paid", "Balance"],
    datasets: [
      {
        data: [student.total_paid, student.expected_total - student.total_paid],
        backgroundColor: ["#4caf50", "#f44336"],
      },
    ],
  };

  const barData = {
    labels: student.attendance.map((a) => a.date),
    datasets: [
      {
        label: "Present (1) / Absent (0)",
        data: student.attendance.map((a) => a.status === "Present" ? 1 : 0),
        backgroundColor: "#2196f3",
      },
    ],
  };

  return (
    <div className="student-details">
      <h2>{student.name}</h2>
      <p><strong>Class:</strong> {student.classroom_name}</p>
      <p><strong>Guardian:</strong> {student.guardian_name} ({student.guardian_contact})</p>
      <p><strong>Total Paid:</strong> KES {student.total_paid}</p>
      <p><strong>Expected:</strong> KES {student.expected_total}</p>
      <p><strong>Balance:</strong> KES {student.balance}</p>

      <button onClick={downloadPDF} className="download-btn">Download PDF Report</button>

      <h3>Fee Breakdown</h3>
      <Pie data={pieData} />

      <h3>Attendance Overview</h3>
      <Bar data={barData} />

      <h3>Fee History</h3>
      <ul>
        {student.fees.map((f, i) => (
          <li key={i}>{f.term} - KES {f.amount} on {f.payment_date}</li>
        ))}
      </ul>

      <h3>Attendance History</h3>
      <ul>
        {student.attendance.map((a, i) => (
          <li key={i}>{a.date} - {a.status}</li>
        ))}
      </ul>
    </div>
  );
}
