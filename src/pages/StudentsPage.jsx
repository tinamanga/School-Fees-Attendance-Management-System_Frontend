import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStudents } from "../services/api";
import "../styles/StudentsPage.css";

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classroomFilter, setClassroomFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const url = classroomFilter
      ? `/students?classroom_id=${classroomFilter}`
      : "/students";

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load students.");
        setLoading(false);
      });
  }, [classroomFilter]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFiltered(
      students.filter((s) => s.name.toLowerCase().includes(term))
    );
  }, [searchTerm, students]);

  const handleClick = (id) => {
    navigate(`/students/${id}`);
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="students-page">
      <h2 className="title">Student List</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="classroom-select"
          value={classroomFilter}
          onChange={(e) => setClassroomFilter(e.target.value)}
        >
          <option value="">All Classes</option>
          <option value="1">Class 1</option>
          <option value="2">Class 2</option>
          <option value="3">Class 3</option>
          {/* Add more as needed */}
        </select>
      </div>

      <ul className="student-list">
        {filtered.map((student) => (
          <li
            key={student.id}
            className="student-card"
            onClick={() => handleClick(student.id)}
          >
            <h3>{student.name}</h3>
            <p><strong>Class:</strong> {student.classroom_name || "N/A"}</p>
            <p><strong>Guardian:</strong> {student.guardian_name} ({student.guardian_contact})</p>
            <p><strong>Fees Paid:</strong> KES {student.fees_paid} / {student.expected_fees}</p>
            <p><strong>Balance:</strong> KES {student.fee_balance}</p>
            <p><strong>Attendance:</strong> {student.attendance_percentage}%</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentsPage;
