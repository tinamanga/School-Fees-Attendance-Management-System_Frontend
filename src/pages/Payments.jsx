import { useContext, useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import UserContext from "../UserContext";

function Payments() {
  const { user } = useContext(UserContext);
  const [payments, setPayments] = useState([]);
  const [formData, setFormData] = useState({
    student_id: "",
    term: "",
    amount: "",
    class: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    if (user?.role === "admin") {
      fetch("http://localhost:5000/fee-payments")
        .then((res) => res.json())
        .then(setPayments);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/fee-payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newPayment = await response.json();
        setPayments([newPayment, ...payments]);
        setFormData({ student_id: "", term: "", amount: "", class: "" });
        alert("Payment recorded successfully!");
      } else {
        alert("Failed to record payment");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error recording payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Chart data
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];
  const termChartData = Object.values(
    payments.reduce((acc, p) => {
      if (!acc[p.term]) {
        acc[p.term] = { name: p.term, value: 0 };
      }
      acc[p.term].value += Number(p.amount);
      return acc;
    }, {})
  );

  // Filter by search term
  const filteredPayments = payments.filter(
    (p) =>
      p.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.term?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.class?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.amount?.toString().includes(searchTerm)
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = filteredPayments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (!user || user.role !== "admin") {
    return (
      <p className="text-red-500 text-center mt-10 text-lg font-semibold">
        Access denied. Admins only.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Fee Payment Management
      </h2>

      {/* Form */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Record New Payment
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              name="student_id"
              value={formData.student_id}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Student ID"
            />
            <input
              type="text"
              name="class"
              value={formData.class}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Class"
            />
            <select
              name="term"
              value={formData.term}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select term</option>
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
            </select>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Amount (KES)"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {isSubmitting ? "Recording..." : "Record Payment"}
          </button>
        </form>
      </div>

      {/* Search Bar */}
      {/* Search Bar */}
      <div className="flex justify-end">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search payments by student, class, or term"
          className="bg-white w-full md:w-1/3 mb-4 px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Table */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Payment Records
        </h3>
        {filteredPayments.length === 0 ? (
          <p className="text-gray-500">
            {searchTerm
              ? "No payments match your search."
              : "No payments recorded yet."}
          </p>
        ) : (
          <>
            <div className="overflow-x-auto bg-white shadow rounded-xl">
              <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3">Student Name</th>
                    <th className="px-6 py-3">Student ID</th>
                    <th className="px-6 py-3">Amount (KES)</th>
                    <th className="px-6 py-3">Term</th>
                    <th className="px-6 py-3">Class</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPayments.map((p) => {
                    const dt = new Date(p.payment_date);
                    return (
                      <tr
                        key={p.id}
                        className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-3">{p.student_name}</td>
                        <td className="px-6 py-3">{p.student_id}</td>
                        <td className="px-6 py-3">KES {p.amount}</td>
                        <td className="px-6 py-3">{p.term}</td>
                        <td className="px-6 py-3">{p.class}</td>
                        <td className="px-6 py-3">{dt.toLocaleDateString()}</td>
                        <td className="px-6 py-3">{dt.toLocaleTimeString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {/* Pagination */}
            <div className="flex justify-end items-center gap-4 mt-4">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 text-blue-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                &laquo; Prev
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md text-blue-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next &raquo;
              </button>
            </div>
          </>
        )}
      </div>

      {/* Pie Chart */}
      {termChartData.length > 0 && (
        <div className="bg-white shadow rounded-xl p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Payment Distribution by Term
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={termChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {termChartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default Payments;
