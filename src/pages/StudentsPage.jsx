import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StudentsPage.css";

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classroomFilter, setClassroomFilter] = useState("");
  const [minBalance, setMinBalance] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL("http://localhost:5000/students");
    if (classroomFilter) url.searchParams.append("classroom_id", classroomFilter);
    if (minBalance) url.searchParams.append("min_balance", minBalance);

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
  }, [classroomFilter, minBalance]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFiltered(
      students.filter((s) => s.name.toLowerCase().includes(term))
    );
  }, [searchTerm, students]);

  const handleClick = (id) => {
    navigate(`/students/${id}`);
  };

  const handleDownloadPDF = () => {
    if (!classroomFilter) {
      alert("Please select a class first.");
      return;
    }
    window.open(`http://localhost:5000/reports/classroom/${classroomFilter}/pdf`, "_blank");
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
        </select>

        <select
          className="classroom-select"
          value={minBalance}
          onChange={(e) => setMinBalance(e.target.value)}
        >
          <option value="">All Fee Balances</option>
          <option value="1000">Balance ≥ 1,000</option>
          <option value="5000">Balance ≥ 5,000</option>
          <option value="10000">Balance ≥ 10,000</option>
        </select>

        <button onClick={handleDownloadPDF} className="pdf-btn">
          Download Class PDF
        </button>
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
