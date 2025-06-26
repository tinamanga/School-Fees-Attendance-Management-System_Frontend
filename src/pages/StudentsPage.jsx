import { useEffect, useState } from "react";
import { fetchStudents } from "../services/api";

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents()
      .then(data => {
        setStudents(data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load students.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Student List</h2>
      <ul className="space-y-2">
        {students.map((student) => (
          <li
            key={student.id}
            className="bg-white shadow p-3 rounded hover:bg-gray-50"
          >
            {student.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentsPage;
