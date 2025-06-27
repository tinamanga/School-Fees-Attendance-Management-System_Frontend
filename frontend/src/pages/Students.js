import { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";

function Students() {
    const { user } = useContext(UserContext);
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
            fetch("http://localhost:5000/students")
                .then((res) => res.json())
                .then(setStudents);

            fetch("http://localhost:5000/classrooms")
                .then((res) => res.json())
                .then(setClassrooms);
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setCreatedCredentials(null); // Reset any previous credentials shown

        const method = editingId ? "PATCH" : "POST";
        const url = editingId
            ? `http://localhost:5000/students/${editingId}`
            : "http://localhost:5000/students";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "Something went wrong");
            return;
        }

        // Refresh list
        const updated = await fetch("http://localhost:5000/students").then((r) => r.json());
        setStudents(updated);

        // Reset form
        setForm({
            name: "",
            guardian_name: "",
            guardian_contact: "",
            classroom_id: "",
        });
        setEditingId(null);

        // If user credentials were returned (only on POST)
        if (!editingId && data.login_username) {
            setCreatedCredentials({
                username: data.login_username,
                password: data.default_password
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

        await fetch(`http://localhost:5000/students/${id}`, {
            method: "DELETE",
        });

        setStudents((prev) => prev.filter((s) => s.id !== id));
    };

    if (!user || user.role !== "admin") {
        return <p style={{ color: "red" }}>Access denied. Admins only.</p>;
    }

    return (
        <div style={{ maxWidth: 700, margin: "auto" }}>
            <h2>Student Management</h2>

            <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
                <h3>{editingId ? "Edit Student" : "Add New Student"}</h3>
                <input
                    name="name"
                    placeholder="Student Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <br />
                <input
                    name="guardian_name"
                    placeholder="Guardian Name"
                    value={form.guardian_name}
                    onChange={handleChange}
                    required
                />
                <br />
                <input
                    name="guardian_contact"
                    placeholder="Guardian Contact"
                    value={form.guardian_contact}
                    onChange={handleChange}
                    required
                />
                <br />
                <select
                    name="classroom_id"
                    value={form.classroom_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">-- Select Classroom --</option>
                    {classrooms.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
                <br />
                <button type="submit">{editingId ? "Update" : "Add"} Student</button>
                {editingId && (
                    <button type="button" onClick={() => setEditingId(null)}>
                        Cancel
                    </button>
                )}
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>

            {createdCredentials && (
                <div style={{ backgroundColor: "#e0ffe0", padding: 10, marginBottom: 20 }}>
                    <strong>Login created for student:</strong><br />
                    Username: <code>{createdCredentials.username}</code><br />
                    Default Password: <code>{createdCredentials.password}</code><br />
                    ⚠️ Please provide these credentials to the student.
                </div>
            )}

            <h3>All Students</h3>
            {students.length === 0 ? (
                <p>No students found.</p>
            ) : (
                <table border="1" cellPadding="6">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Guardian</th>
                            <th>Contact</th>
                            <th>Classroom</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((s) => (
                            <tr key={s.id}>
                                <td>{s.name}</td>
                                <td>{s.guardian_name}</td>
                                <td>{s.guardian_contact}</td>
                                <td>{s.classroom.name}</td>
                                <td>
                                    <button onClick={() => handleEdit(s)}>Edit</button>{" "}
                                    <button onClick={() => handleDelete(s.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Students;
