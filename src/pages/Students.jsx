import { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Students() {
  const { user, logout } = useContext(UserContext);
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
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

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    guardian_name: Yup.string().required("Guardian name is required"),
    guardian_contact: Yup.string()
      .matches(/^07\d{8}$/, "Invalid Kenyan phone number")
      .required("Guardian contact is required"),
    classroom_id: Yup.string().required("Classroom is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
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
      body: JSON.stringify(values),
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
    resetForm();
    setEditingId(null);

    if (!editingId && data.login_username) {
      setCreatedCredentials({
        username: data.login_username,
        password: data.default_password,
      });
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
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
        <Formik
          initialValues={{
            name: "",
            guardian_name: "",
            guardian_contact: "",
            classroom_id: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, handleChange }) => (
            <Form className="space-y-4">
              <h3 className="text-xl font-semibold">
                {editingId ? "Edit Student" : "Add New Student"}
              </h3>

              <Field
                name="name"
                placeholder="Student Name"
                className="w-full border border-gray-300 rounded p-2"
              />
              <ErrorMessage name="name" component="div" className="text-red-500" />

              <Field
                name="guardian_name"
                placeholder="Guardian Name"
                className="w-full border border-gray-300 rounded p-2"
              />
              <ErrorMessage
                name="guardian_name"
                component="div"
                className="text-red-500"
              />

              <Field
                name="guardian_contact"
                placeholder="Guardian Contact"
                className="w-full border border-gray-300 rounded p-2"
              />
              <ErrorMessage
                name="guardian_contact"
                component="div"
                className="text-red-500"
              />

              <Field
                as="select"
                name="classroom_id"
                className="w-full border border-gray-300 rounded p-2"
              >
                <option value="">-- Select Classroom --</option>
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="classroom_id"
                component="div"
                className="text-red-500"
              />

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
            </Form>
          )}
        </Formik>
      </div>

      {/* Credentials */}
      {createdCredentials && (
        <div className="bg-green-100 border border-green-300 p-4 rounded shadow">
          <strong className="block mb-2">Login created for student:</strong>
          <p>
            Username: <code className="bg-white px-2 py-1 rounded">{createdCredentials.username}</code>
          </p>
          <p>
            Password: <code className="bg-white px-2 py-1 rounded">{createdCredentials.password}</code>
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
