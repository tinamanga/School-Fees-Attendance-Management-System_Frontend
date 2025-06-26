export default function AttendanceForm({ students, onMark }) {
    return (
      <form onSubmit={onMark} className="attendance-form">
        {students.map((student) => (
          <div key={student.id}>
            <label>{student.name}</label>
            <select name={`status_${student.id}`}>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
        ))}
        <button type="submit">Save Attendance</button>
      </form>
    );
  }