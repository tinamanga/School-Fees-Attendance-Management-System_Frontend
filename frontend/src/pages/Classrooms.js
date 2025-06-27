import { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";

function Classrooms() {
    const { user } = useContext(UserContext);
    const [classrooms, setClassrooms] = useState([]);
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/classrooms")
            .then((res) => res.json())
            .then(setClassrooms);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const method = editingId ? "PATCH" : "POST";
        const url = editingId
            ? `http://localhost:5000/classrooms/${editingId}`
            : "http://localhost:5000/classrooms";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.error || "Something went wrong");
            return;
        }

        const updated = await fetch("http://localhost:5000/classrooms").then((r) => r.json());
        setClassrooms(updated);
        setName("");
        setEditingId(null);
    };

    const handleEdit = (classroom) => {
        setName(classroom.name);
        setEditingId(classroom.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this classroom?")) return;

        await fetch(`http://localhost:5000/classrooms/${id}`, {
            method: "DELETE",
        });

        setClassrooms((prev) => prev.filter((c) => c.id !== id));
    };

    if (!user || user.role !== "admin") {
        return <p style={{ color: "red" }}>Access denied. Admins only.</p>;
    }

    return (
        <div className="student-dashboard">
            <h2>Manage Classrooms</h2>

            <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
                <h3>{editingId ? "Edit Classroom" : "Add New Classroom"}</h3>
                <input
                    type="text"
                    value={name}
                    placeholder="Classroom Name"
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <br />
                <button type="submit">{editingId ? "Update" : "Add"} Classroom</button>
                {editingId && (
                    <button type="button" onClick={() => { setName(""); setEditingId(null); }}>
                        Cancel
                    </button>
                )}
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>

            <h3>Existing Classrooms</h3>
            <div className="dashboard-summary">
                {classrooms.map((c) => (
                    <div key={c.id} className="dashboard-card">
                        <h4>{c.name}</h4>
                        <p><strong>Students:</strong> {c.student_count}</p>
                        <div>
                            <button onClick={() => handleEdit(c)}>Edit</button>{" "}
                            <button onClick={() => handleDelete(c.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Classrooms;
