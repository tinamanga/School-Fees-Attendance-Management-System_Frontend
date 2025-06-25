import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/students">Students</Link></li>
        <li><Link to="/fees">Fees</Link></li>
        <li><Link to="/attendance">Attendance</Link></li>
      </ul>
    </nav>
  );
}