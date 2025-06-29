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
              fetch(`http://localhost:5000/attendance/student/${s.id}`).then(
                (r) =>
                  r.json().then((data) => ({ student: s.name, records: data }))
              )
            )
          ).then(setRecords);
        });
    }
  }, [user]);

  if (!user || !["admin", "teacher"].includes(user.role)) {
    return (
      <p className="text-red-500 text-center mt-10 text-lg font-medium">
        Access denied.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Attendance History</h2>

      {records.length === 0 ? (
        <p className="text-gray-500">No attendance records available.</p>
      ) : (
        <div className="space-y-6">
          {records.map(({ student, records }) => (
            <div
              key={student}
              className="bg-white shadow rounded-xl p-6 border border-gray-100"
            >
              <h4 className="text-lg font-semibold text-blue-700 mb-3">
                {student}
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                {records.length === 0 ? (
                  <li className="text-gray-400">No records found.</li>
                ) : (
                  records.map((r) => (
                    <li
                      key={r.id}
                      className="flex justify-between bg-gray-50 p-2 rounded"
                    >
                      <span>{r.date}</span>
                      <span className="capitalize">{r.status}</span>
                      <span className="italic text-gray-500">
                        by {r.teacher.username}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AttendanceHistory;
