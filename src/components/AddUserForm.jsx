
import { useState } from "react";

export default function AddUserForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "teacher"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://127.0.0.1:5000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    alert("User added!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Username" value={formData.username}
        onChange={e => setFormData({ ...formData, username: e.target.value })} />
      <input placeholder="Email" value={formData.email}
        onChange={e => setFormData({ ...formData, email: e.target.value })} />
      <input type="password" placeholder="Password" value={formData.password}
        onChange={e => setFormData({ ...formData, password: e.target.value })} />
      <select value={formData.role}
        onChange={e => setFormData({ ...formData, role: e.target.value })}>
        <option value="admin">Admin</option>
        <option value="teacher">Teacher</option>
        <option value="parent">Parent</option>
      </select>
      <button type="submit">Add User</button>
    </form>
  );
}
