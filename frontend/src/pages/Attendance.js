import { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";

function Attendance() {
    const { user } = useContext(UserContext);
    const [students, setStudents] = useState([]);
    const [attendanceData, setAttendanceData] = useState({});

    useEffect(() => {
        if (user?.role === "teacher") {
            fetch("http://localhost:5000/students")
                .then((res) => res.json())
                .then(setStudents);
        }
    }, [user]);

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

    const handleStatusChange = (studentId, day, status) => {
        setAttendanceData((prev) => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [day]: status,
            },
        }));
    };

    const handleSubmit = async () => {
        const payload = {
            teacher_id: user.id,
            records: Object.entries(attendanceData).map(([student_id, week]) => ({
                student_id: parseInt(student_id),
                week,
            })),
        };

        try {
            const res = await fetch("http://localhost:5000/attendance-records/bulk-weekly", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Attendance submitted!");
                setAttendanceData({});
            } else {
                alert(data.error || "Error submitting attendance.");
            }
        } catch {
            alert("Server error");
        }
    };

    if (!user || user.role !== "teacher") {
        return <p style={{ color: "red" }}>Access denied</p>;
    }

    return (
        <div style={{ maxWidth: "1000px", margin: "auto" }}>
            <h2>Attendance (Weekly)</h2>
            <table border="1" cellPadding="6">
                <thead>
                    <tr>
                        <th>Student</th>
                        {days.map((d) => (
                            <th key={d}>{d}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {students.map((s) => (
                        <tr key={s.id}>
                            <td>{s.name}</td>
                            {days.map((d) => (
                                <td key={d}>
                                    <select
                                        value={attendanceData[s.id]?.[d] || ""}
                                        onChange={(e) =>
                                            handleStatusChange(s.id, d, e.target.value)
                                        }
                                    >
                                        <option value="">--</option>
                                        <option value="Present">Present</option>
                                        <option value="Absent">Absent</option>
                                    </select>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            <button onClick={handleSubmit}>Submit Attendance</button>
        </div>
    );
}

export default Attendance;

