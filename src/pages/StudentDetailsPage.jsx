import { useParams } from "react-router-dom"

function StudentDetailsPage() {
  const { id } = useParams()

  return (
    <div>
      <h1>Student Details for ID: {id}</h1>
      {/* Here you'd fetch and show attendance + payment history */}
    </div>
  )
}

export default StudentDetailsPage
