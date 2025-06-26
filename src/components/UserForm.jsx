
import React, { useState } from 'react';

function UserForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'teacher',
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await fetch('http://127.0.0.1:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ ${formData.role} created successfully!`);
        setFormData({ username: '', email: '', password: '', role: 'teacher' });
      } else {
        setMessage(`❌ ${data.error || 'Failed to create user.'}`);
      }
    } catch (error) {
      setMessage('❌ Network error. Please try again.');
    }
  };

  return (
    <div className="user-form">
      <h3>Create a New User (Teacher/Parent)</h3>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        /><br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        /><br />

        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="teacher">Teacher</option>
          <option value="parent">Parent</option>
        </select><br />

        <button type="submit">Create User</button>
      </form>
    </div>
  );
}

export default UserForm;
