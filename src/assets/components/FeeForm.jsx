export default function FeeForm({ onSubmit }) {
    return (
      <form onSubmit={onSubmit} className="fee-form">
        <input name="amount" placeholder="Fee Amount" required type="number" />
        <input name="payment_date" type="date" required />
        <select name="term">
          <option>Term 1</option>
          <option>Term 2</option>
        </select>
        <button type="submit">Submit Payment</button>
      </form>
    );
  }