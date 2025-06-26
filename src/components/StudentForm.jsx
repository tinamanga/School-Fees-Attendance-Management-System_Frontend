import { useState } from "react"
import { apiFetch } from "../api"

function StudentForm({ onNewStudent }) {
  const [form, setForm] = useState({
    name: "", classroom_id: 1, guardian_name: "", guardian_contact: ""
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const student = await apiFetch("/students", {
      method: "POST",
      body: JSON.stringify(form)
    })
    onNewStudent(student)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" onChange={handleChange} placeholder="Name" />
      <input name="guardian_name" onChange={handleChange} placeholder="Guardian" />
      <input name="guardian_contact" onChange={handleChange} placeholder="Contact" />
      <button>Add Student</button>
    </form>
  )
}

export default StudentForm
