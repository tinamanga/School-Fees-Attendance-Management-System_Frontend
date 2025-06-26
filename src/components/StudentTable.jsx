function StudentTable({ students }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th><th>Guardian</th><th>Contact</th>
        </tr>
      </thead>
      <tbody>
        {students.map(s => (
          <tr key={s.id}>
            <td>{s.name}</td>
            <td>{s.guardian_name}</td>
            <td>{s.guardian_contact}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default StudentTable
