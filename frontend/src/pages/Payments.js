import { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";

function Payments() {
  const { user } = useContext(UserContext);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (user?.role === "admin") {
      fetch("http://localhost:5000/fee-payments")
        .then((res) => res.json())
        .then(setPayments);
    }
  }, [user]);

  if (!user || user.role !== "admin") {
    return <p style={{ color: "red" }}>Access denied. Admins only.</p>;
  }

  return (
    <div className="student-dashboard">
      <h2>All Fee Payment Records</h2>

      {payments.length === 0 ? (
        <p>No payments recorded yet.</p>
      ) : (
        <div className="scroll-container">
          {payments.map((p) => {
            const dt = new Date(p.payment_date);
            return (
              <div key={p.id} className="card student-card" style={{ borderLeft: "6px solid #0f5f5c" }}>
                <h4>{p.student_name}</h4>
                <p><strong>Amount:</strong> KES {p.amount}</p>
                <p><strong>Term:</strong> {p.term}</p>
                <p><strong>Date:</strong> {dt.toLocaleDateString()}</p>
                <p><strong>Time:</strong> {dt.toLocaleTimeString()}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Payments;
