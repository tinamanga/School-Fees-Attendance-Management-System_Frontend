import { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";

function AttendanceHistory() {
    const { user } = useContext(UserContext);
    const [records, setRecords] = useState([]);

    useEffect(() => {
        if (user && (user.role === "admin" || user.role === "teacher")) {
            fetch("http://localhost:5000/students")
                .then((res) => res.json())
                .then((students) => {
                    Promise.all(
                        students.map((s) =>
                            fetch(`http://localhost:5000/attendance/student/${s.id}`).then((r) =>
                                r.json().then((data) => ({ student: s.name, records: data }))
                            )
                        )
                    ).then(setRecords);
                });
        }
    }, [user]);

    if (!user || (user.role !== "admin" && user.role !== "teacher")) {
        return <p style={{ color: "red" }}>Access denied.</p>;
    }

    return (
        <div style={{ maxWidth: 800, margin: "auto" }}>
            <h2>Attendance History</h2>
            {records.map(({ student, records }) => (
                <div key={student} style={{ marginBottom: 20 }}>
                    <h4>{student}</h4>
                    <ul>
                        {records.map((r) => (
                            <li key={r.id}>
                                {r.date} - {r.status} (by {r.teacher.username})
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default AttendanceHistory;
