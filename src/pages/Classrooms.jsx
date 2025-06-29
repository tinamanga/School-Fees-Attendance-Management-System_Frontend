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

    const updated = await fetch("http://localhost:5000/classrooms").then((r) =>
      r.json()
    );
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
    return (
      <p className="text-red-500 text-center mt-10 text-lg font-medium">
        Access denied. Admins only.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Manage Classrooms</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md space-y-4 max-w-xl"
      >
        <h3 className="text-xl font-semibold text-gray-700">
          {editingId ? "Edit Classroom" : "Add New Classroom"}
        </h3>

        <input
          type="text"
          value={name}
          placeholder="Classroom Name"
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {editingId ? "Update" : "Add"} Classroom
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setName("");
                setEditingId(null);
              }}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        {error && <p className="text-red-500 font-medium">{error}</p>}
      </form>

      {/* Classroom Cards */}
      <h3 className="text-xl font-semibold text-gray-700">
        Existing Classrooms
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {classrooms.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between transition hover:shadow-lg"
          >
            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">{c.name}</h4>
              <p className="text-gray-600">
                <strong>Students:</strong> {c.student_count}
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleEdit(c)}
                className="bg-yellow-500 text-white px-3 py-1.5 rounded-md hover:bg-yellow-600 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Classrooms;
