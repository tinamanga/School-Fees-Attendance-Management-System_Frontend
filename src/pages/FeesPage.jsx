import { useEffect, useState } from "react";
import "../styles/FeesPage.css";

function FeesPage() {
  const [fees, setFees] = useState([]);
  const [form, setForm] = useState({
    student_id: "",
    amount: "",
    payment_date: "",
    term: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/fees", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch fees");
      const data = await res.json();
      setFees(data);
    } catch (err) {
      setError("Failed to fetch fee records.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://127.0.0.1:5000/fees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Failed to record fee");

      setSuccess("Fee recorded successfully.");
      setForm({
        student_id: "",
        amount: "",
        payment_date: "",
        term: ""
      });
      fetchFees();
    } catch (err) {
      setError("Failed to record fee.");
    }
  };

  return (
    <div className="fees-page">
      <h2 className="page-title">Fee Payments</h2>

      <form onSubmit={handleSubmit} className="fee-form">
        <input
          type="number"
          name="student_id"
          value={form.student_id}
          placeholder="Student ID"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="amount"
          value={form.amount}
          placeholder="Amount"
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="payment_date"
          value={form.payment_date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="term"
          value={form.term}
          placeholder="Term (e.g. Term 1)"
          onChange={handleChange}
          required
        />
        <button type="submit" className="submit-button">Record Fee</button>
      </form>

      {error && <p className="error-msg">{error}</p>}
      {success && <p className="success-msg">{success}</p>}

      <h3 className="list-title">Fee Records</h3>
      <ul className="fee-list">
        {fees.map((fee) => (
          <li key={fee.id} className="fee-item">
            <strong>Student ID:</strong> {fee.student_id} |{" "}
            <strong>Amount:</strong> {fee.amount} |{" "}
            <strong>Date:</strong> {fee.payment_date} |{" "}
            <strong>Term:</strong> {fee.term}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FeesPage;
