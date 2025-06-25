export default function StudentForm({ onSubmit }) {
    return (
      <form onSubmit={onSubmit} className="student-form">
        <input name="name" placeholder="Student Name" required />
        <input name="guardian_name" placeholder="Guardian Name" required />
        <input name="guardian_contact" placeholder="Contact" required />
        <select name="classroom_id">
          <option>Class 1</option>
          <option>Class 2</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    );
  }
  