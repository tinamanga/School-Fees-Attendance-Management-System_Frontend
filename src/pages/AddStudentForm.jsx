import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const StudentSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  guardian_name: Yup.string().required("Guardian name is required"),
  guardian_contact: Yup.string()
    .matches(/^\d+$/, "Must be digits only")
    .required("Guardian contact is required"),
  classroom_id: Yup.number().required("Select a classroom"),
});

export default function AddStudentForm({ onSubmit }) {
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/classrooms")
      .then((res) => res.json())
      .then(setClassrooms)
      .catch((err) => console.error("Failed to load classrooms:", err));
  }, []);

  return (
    <Formik
      initialValues={{
        name: "",
        guardian_name: "",
        guardian_contact: "",
        classroom_id: "",
      }}
      validationSchema={StudentSchema}
      onSubmit={onSubmit}
    >
      <Form className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <Field name="name" className="border p-2 w-full rounded" />
          <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
        </div>

        <div>
          <label className="block font-medium">Guardian Name</label>
          <Field name="guardian_name" className="border p-2 w-full rounded" />
          <ErrorMessage name="guardian_name" component="div" className="text-red-500 text-sm" />
        </div>

        <div>
          <label className="block font-medium">Guardian Contact</label>
          <Field name="guardian_contact" className="border p-2 w-full rounded" />
          <ErrorMessage name="guardian_contact" component="div" className="text-red-500 text-sm" />
        </div>

        <div>
          <label className="block font-medium">Classroom</label>
          <Field as="select" name="classroom_id" className="border p-2 w-full rounded">
            <option value="">Select Class</option>
            {classrooms.map((classroom) => (
              <option key={classroom.id} value={classroom.id}>
                {classroom.name}
              </option>
            ))}
          </Field>
          <ErrorMessage name="classroom_id" component="div" className="text-red-500 text-sm" />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </Form>
    </Formik>
  );
}
