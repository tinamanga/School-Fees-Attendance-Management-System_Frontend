import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiFetch } from "../api"

function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const data = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify(form)
      })
      if (data.role === "admin") navigate("/dashboard/admin")
      else if (data.role === "teacher") navigate("/dashboard/teacher")
    } catch (err) {
      setError("Login failed")
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            onChange={handleChange}
            placeholder="Username"
            className="input-field"
          />
          <input
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="Password"
            className="input-field"
          />
          <button className="login-btn">Login</button>
          {error && <p className="error-text">{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default LoginPage
