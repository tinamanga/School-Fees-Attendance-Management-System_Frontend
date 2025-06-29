import { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";

function Students() {
  const { user, logout } = useContext(UserContext);
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [form, setForm] = useState({
    name: "",
    guardian_name: "",
    guardian_contact: "",
    classroom_id: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [createdCredentials, setCreatedCredentials] = useState(null);

  useEffect(() => {
    if (user?.role === "admin") {
      fetch("http://localhost:5000/students", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then((res) => {
          if (res.status === 401) {
            logout();
            return [];
          }
          return res.json();
        })
        .then(setStudents);

      fetch("http://localhost:5000/classrooms", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then((res) => {
          if (res.status === 401) {
            logout();
            return [];
          }
          return res.json();
        })
        .then(setClassrooms);
    }
  }, [user, logout]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCreatedCredentials(null);

    const method = editingId ? "PATCH" : "POST";
    const url = editingId
      ? `http://localhost:5000/students/${editingId}`
      : "http://localhost:5000/students";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.status === 401) {
      logout();
      return;
    }

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    const updated = await fetch("http://localhost:5000/students", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }).then((r) => r.json());
    setStudents(updated);

    setForm({
      name: "",
      guardian_name: "",
      guardian_contact: "",
      classroom_id: "",
    });
    setEditingId(null);

    if (!editingId && data.login_username) {
      setCreatedCredentials({
        username: data.login_username,
        password: data.default_password,
      });
    }
  };

  const handleEdit = (student) => {
    setForm({
      name: student.name,
      guardian_name: student.guardian_name,
      guardian_contact: student.guardian_contact,
      classroom_id: student.classroom.id,
    });
    setEditingId(student.id);
    setCreatedCredentials(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    const res = await fetch(`http://localhost:5000/students/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (res.status === 401) {
      logout();
      return;
    }

    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  if (!user || user.role !== "admin") {
    return (
      <p className="text-red-500 text-center mt-10">
        Access denied. Admins only.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>

      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-xl font-semibold">
            {editingId ? "Edit Student" : "Add New Student"}
          </h3>

          <input
            name="name"
            placeholder="Student Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />

          <input
            name="guardian_name"
            placeholder="Guardian Name"
            value={form.guardian_name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />

          <input
            name="guardian_contact"
            placeholder="Guardian Contact"
            value={form.guardian_contact}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />

          <select
            name="classroom_id"
            value={form.classroom_id}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="">-- Select Classroom --</option>
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {editingId ? "Update" : "Add"} Student
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
          </div>

          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>

      {/* Credentials */}
      {createdCredentials && (
        <div className="bg-green-100 border border-green-300 p-4 rounded shadow">
          <strong className="block mb-2">Login created for student:</strong>
          <p>
            Username:{" "}
            <code className="bg-white px-2 py-1 rounded">
              {createdCredentials.username}
            </code>
          </p>
          <p>
            Password:{" "}
            <code className="bg-white px-2 py-1 rounded">
              {createdCredentials.password}
            </code>
          </p>
          <p className="mt-2 text-sm text-red-600">
            ⚠️ Please provide these credentials to the student.
          </p>
        </div>
      )}

      {/* Student List */}
      <h3 className="text-xl font-semibold">All Students</h3>

      {students.length === 0 ? (
        <p className="text-gray-500">No students found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-xl shadow p-4 flex flex-col justify-between"
            >
              <div>
                <h4 className="text-lg font-bold mb-1">{s.name}</h4>
                <p>
                  <strong>Guardian:</strong> {s.guardian_name}
                </p>
                <p>
                  <strong>Contact:</strong> {s.guardian_contact}
                </p>
                <p>
                  <strong>Classroom:</strong> {s.classroom.name}
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(s)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Students;
