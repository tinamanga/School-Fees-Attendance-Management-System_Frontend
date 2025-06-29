import { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

function Dashboard() {
  const { user } = useContext(UserContext);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    if (!user) return;

    if (user.role === "admin" || user.role === "teacher") {
      const endpoint =
        user.role === "admin"
          ? "http://localhost:5000/dashboard/admin"
          : `http://localhost:5000/dashboard/teacher/${user.id}`;

      fetch(endpoint)
        .then((res) => res.json())
        .then((json) => {
          if (json.error) setError(json.error);
          else setData(json);
        })
        .catch(() => setError("Failed to load dashboard data"));
    }

    if (user.role === "student") {
      fetch(`http://localhost:5000/students/by-user/${user.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Not found");
          return res.json();
        })
        .then((json) => setStudentData(json))
        .catch(() => setError("Student record not found"));
    }
  }, [user]);

  if (!user)
    return (
      <p className="text-center text-red-500 mt-10">Please log in first.</p>
    );
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Welcome, {user.username}{" "}
        <span className="text-sm text-gray-500">({user.role})</span>
      </h2>

      {user.role === "admin" && data && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Admin Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow p-4">
              <h4 className="text-gray-600 font-medium">Total Students</h4>
              <p className="text-2xl font-bold">{data.total_students}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <h4 className="text-gray-600 font-medium">Total Fees Paid</h4>
              <p className="text-2xl font-bold">KES {data.total_fees}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <h4 className="text-gray-600 font-medium">Attendance Records</h4>
              <p className="text-2xl font-bold">
                {data.total_attendance_records}
              </p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-4 rounded-xl shadow">
              <h4 className="font-medium text-gray-800 mb-4">
                Students & Fees Chart
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    {
                      name: "Summary",
                      students: data.total_students,
                      fees: data.total_fees,
                    },
                  ]}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="students" fill="#3b82f6" name="Students" />
                  <Bar dataKey="fees" fill="#10b981" name="Fees (KES)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              <h4 className="font-medium text-gray-800 mb-4">
                Attendance Overview
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={[
                    {
                      name: "Records",
                      attendance: data.total_attendance_records,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="#f97316"
                    name="Attendance Records"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {user.role === "student" && studentData && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Student Dashboard</h3>

          <div className="bg-white rounded-xl shadow p-4 space-y-2">
            <p>
              <strong>Name:</strong> {studentData.name}
            </p>
            <p>
              <strong>Guardian:</strong> {studentData.guardian_name} (
              {studentData.guardian_contact})
            </p>
            <p>
              <strong>Classroom:</strong> {studentData.classroom.name}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h4 className="text-lg font-medium mb-2">Make a Fee Payment</h4>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const amount = prompt("Enter payment amount (KES):");
                const term = prompt("Enter term (e.g., Term 1):");

                if (!amount || !term) return alert("Payment cancelled.");

                const res = await fetch("http://localhost:5000/fee-payments", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    student_id: studentData.id,
                    amount: parseFloat(amount),
                    term,
                  }),
                });

                if (res.ok) {
                  alert("Payment successful!");
                  const updated = await fetch(
                    `http://localhost:5000/students/${studentData.id}`
                  ).then((r) => r.json());
                  setStudentData(updated);
                } else {
                  alert("Payment failed.");
                }
              }}
            >
              <button
                type="submit"
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Pay Fees
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h4 className="text-lg font-medium mb-2">Fee Payments</h4>
            {studentData.fee_payments.length === 0 ? (
              <p className="text-gray-500">No fee payments found.</p>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                {studentData.fee_payments.map((f) => (
                  <li key={f.id}>
                    {f.payment_date}: KES {f.amount} ({f.term})
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h4 className="text-lg font-medium mb-2">Attendance Records</h4>
            {studentData.attendance_records.length === 0 ? (
              <p className="text-gray-500">No attendance records.</p>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                {studentData.attendance_records.map((a) => (
                  <li key={a.id}>
                    {a.date} - {a.status} by {a.teacher.username}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
