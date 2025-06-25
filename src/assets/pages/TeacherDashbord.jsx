import AttendanceForm from '../components/AttendanceForm';

const dummyStudents = [
  { id: 1, name: 'Mary' },
  { id: 2, name: 'John' }
];

export default function TeacherDashboard() {
  return (
    <div>
      <h2>Teacher Dashboard</h2>
      <AttendanceForm students={dummyStudents} onMark={() => {}} />
    </div>
  );
}