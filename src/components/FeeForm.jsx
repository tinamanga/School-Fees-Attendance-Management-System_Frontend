<Formik
  initialValues={{ amount: '', term: '' }}
  validationSchema={Yup.object({
    amount: Yup.number().required('Amount required'),
    term: Yup.string().required('Term is required'),
  })}
  onSubmit={(values) => {
    postFee(values);
  }}
>
  {({ handleChange, handleSubmit, errors }) => (
    <form onSubmit={handleSubmit}>
      <input
        name="amount"
        onChange={handleChange}
        className="border rounded p-2"
        placeholder="Amount"
      />
      {errors.amount && <p className="text-red-500">{errors.amount}</p>}

      <select name="term" onChange={handleChange} className="border p-2">
        <option value="">Select Term</option>
        <option value="Term 1">Term 1</option>
        <option value="Term 2">Term 2</option>
      </select>
      {errors.term && <p className="text-red-500">{errors.term}</p>}

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Submit
      </button>
    </form>
  )}
</Formik>
