import { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";

function Attendance() {
  const { user } = useContext(UserContext);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  useEffect(() => {
    if (user?.role === "teacher") {
      fetch("http://localhost:5000/students")
        .then((res) => res.json())
        .then(setStudents);
    }
  }, [user]);

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
      const res = await fetch(
        "http://localhost:5000/attendance-records/bulk-weekly",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

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
    return (
      <p className="text-red-600 text-center font-semibold mt-10 text-lg">
        Access denied
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-primary mb-6">
        Attendance (Weekly)
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-md text-sm text-gray-700">
          <thead className="bg-secondary text-white">
            <tr>
              <th className="px-4 py-2 text-left">Student</th>
              {days.map((day) => (
                <th key={day} className="px-4 py-2 text-center">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="even:bg-gray-50 hover:bg-gray-100 transition"
              >
                <td className="px-4 py-2">{student.name}</td>
                {days.map((day) => (
                  <td key={day} className="px-2 py-1 text-center">
                    <select
                      value={attendanceData[student.id]?.[day] || ""}
                      onChange={(e) =>
                        handleStatusChange(student.id, day, e.target.value)
                      }
                      className="px-2 py-1 border border-gray-300 rounded-md text-sm"
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
      </div>

      <div className="text-right mt-6">
        <button
          onClick={handleSubmit}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Submit Attendance
        </button>
      </div>
    </div>
  );
}

export default Attendance;
