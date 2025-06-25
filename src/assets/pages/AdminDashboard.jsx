import StudentForm from '../components/StudentForm';
import FeeForm from '../components/FeeForm';

export default function AdminDashboard() {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <StudentForm onSubmit={() => {}} />
      <FeeForm onSubmit={() => {}} />
    </div>
  );
}
