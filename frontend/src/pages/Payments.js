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
        <div style={{ maxWidth: 800, margin: "auto" }}>
            <h2>All Fee Payment Records</h2>

            {payments.length === 0 ? (
                <p>No payments recorded yet.</p>
            ) : (
                <table border="1" cellPadding="6">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Amount (KES)</th>
                            <th>Term</th>
                            <th>Date</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((p) => {
                            const dt = new Date(p.payment_date);
                            return (
                                <tr key={p.id}>
                                    <td>{p.student_name}</td>
                                    <td>{p.amount}</td>
                                    <td>{p.term}</td>
                                    <td>{dt.toLocaleDateString()}</td>
                                    <td>{dt.toLocaleTimeString()}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Payments;
