export default function StudentDetailsPage() {
    // Replace this with actual fetch logic
    const fees = [
      { id: 1, amount: 5000, term: 'Term 1' }
    ];
    const attendance = [
      { date: '2025-06-01', status: 'Present' }
    ];
  
    return (
      <div>
        <h2>Student Details</h2>
        <h3>Fees</h3>
        <ul>
          {fees.map((f) => (
            <li key={f.id}>{f.term}: {f.amount}</li>
          ))}
        </ul>
        <h3>Attendance</h3>
        <ul>
          {attendance.map((a, i) => (
            <li key={i}>{a.date}: {a.status}</li>
          ))}
        </ul>
      </div>
    );
  }