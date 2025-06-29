// src/components/Sidebar.jsx
import { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../UserContext";

export default function Sidebar() {
  const { user, setUser } = useContext(UserContext);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 bg-primary text-white h-full p-6 fixed top-16 left-0">
      <h2 className="text-xl font-bold mb-6">MACMILLAN SCHOOL</h2>
      <nav className="flex flex-col gap-3">
        <Link to="/dashboard" className="hover:bg-white hover:text-primary p-2 rounded">🏠 Dashboard</Link>
        {user.role === "admin" && (
          <>
            <Link to="/students" className="hover:bg-white hover:text-primary p-2 rounded">👨‍🎓 Students</Link>
            <Link to="/classrooms" className="hover:bg-white hover:text-primary p-2 rounded">🏫 Classrooms</Link>
            <Link to="/payments" className="hover:bg-white hover:text-primary p-2 rounded">💳 Payments</Link>
          </>
        )}
        {user.role === "teacher" && (
          <Link to="/attendance" className="hover:bg-white hover:text-primary p-2 rounded">📝 Attendance</Link>
        )}
        {(user.role === "admin" || user.role === "teacher") && (
          <Link to="/attendance-history" className="hover:bg-white hover:text-primary p-2 rounded">📜 History</Link>
        )}
        <button onClick={logout} className="mt-4 bg-secondary text-white py-2 px-4 rounded hover:bg-primary">
          Logout
        </button>
      </nav>
    </aside>
  );
}
