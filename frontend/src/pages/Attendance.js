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
        <div className="student-dashboard">
            <h2>Weekly Attendance</h2>

            <div className="dashboard-cards" style={{ flexDirection: "column" }}>
                {students.map((s) => (
                    <div key={s.id} className="card" style={{ paddingBottom: 15 }}>
                        <h4>{s.name}</h4>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {days.map((d) => (
                                <div key={d} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <label style={{ fontWeight: "bold", color: "#555" }}>{d}</label>
                                    <select
                                        style={{
                                            padding: "6px",
                                            borderRadius: "6px",
                                            border: "1px solid #ccc",
                                            minWidth: "100px",
                                            marginTop: "5px"
                                        }}
                                        value={attendanceData[s.id]?.[d] || ""}
                                        onChange={(e) => handleStatusChange(s.id, d, e.target.value)}
                                    >
                                        <option value="">--</option>
                                        <option value="Present">Present</option>
                                        <option value="Absent">Absent</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                style={{
                    marginTop: 20,
                    padding: "10px 20px",
                    backgroundColor: "#194279",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
            >
                Submit Attendance
            </button>
        </div>
    );
}

export default Attendance;
