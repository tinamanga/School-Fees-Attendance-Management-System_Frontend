import { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";

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

    if (!user) return <p>Please log in first.</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="main-content">
            <h2>Welcome, {user.username} ({user.role})</h2>

            {user.role === "admin" && data && (
                <>
                    <h3>Admin Summary</h3>
                    <div className="dashboard-cards">
                        <div className="dashboard-card">
                            <h4>Total Students</h4>
                            <p>{data.total_students}</p>
                        </div>
                        <div className="dashboard-card">
                            <h4>Total Fees Paid</h4>
                            <p>KES {data.total_fees}</p>
                        </div>
                        <div className="dashboard-card">
                            <h4>Total Attendance Records</h4>
                            <p>{data.total_attendance_records}</p>
                        </div>
                    </div>
                </>
            )}

            {user.role === "student" && studentData && (
                <div className="student-dashboard">
                    <h3>Student Dashboard</h3>

                    <div className="dashboard-card">
                        <p><strong>Name:</strong> {studentData.name}</p>
                        <p><strong>Guardian:</strong> {studentData.guardian_name} ({studentData.guardian_contact})</p>
                        <p><strong>Classroom:</strong> {studentData.classroom.name}</p>
                    </div>

                    <div className="dashboard-card">
                        <h4>Make a Fee Payment</h4>
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
                                    const updated = await fetch(`http://localhost:5000/students/${studentData.id}`).then(r => r.json());
                                    setStudentData(updated);
                                } else {
                                    alert("Payment failed.");
                                }
                            }}
                        >
                            <button type="submit">Pay Fees</button>
                        </form>
                    </div>

                    <div className="dashboard-card">
                        <h4>Fee Payments</h4>
                        {studentData.fee_payments.length === 0 ? (
                            <p>No fee payments found.</p>
                        ) : (
                            <ul>
                                {studentData.fee_payments.map((f) => (
                                    <li key={f.id}>
                                        {f.payment_date}: KES {f.amount} ({f.term})
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="dashboard-card">
                        <h4>Attendance Records</h4>
                        {studentData.attendance_records.length === 0 ? (
                            <p>No attendance records.</p>
                        ) : (
                            <ul>
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
