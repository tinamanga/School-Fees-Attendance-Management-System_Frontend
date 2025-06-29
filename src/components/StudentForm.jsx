import React, { useRef, useEffect, useState, useContext } from "react";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import UserContext from "../UserContext";

const StudentReport = () => {
  const componentRef = useRef();
  const { user } = useContext(UserContext);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [feePayments, setFeePayments] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  useEffect(() => {
    if (user?.role === "admin") {
      fetch("http://localhost:5000/attendance-records")
        .then((res) => res.json())
        .then(setAttendanceRecords);

      fetch("http://localhost:5000/fee-payments")
        .then((res) => res.json())
        .then(setFeePayments);
    }
  }, [user]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleDownloadPDF = () => {
    html2canvas(componentRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save("Student_Report.pdf");
    });
  };

  const sendEmail = async () => {
    const selected = attendanceRecords.find(
      (r) => r.student_name === selectedStudent
    );
    const guardianEmail = selected?.guardian_email;

    if (!guardianEmail) {
      alert("No guardian email found for this student.");
      return;
    }

    const response = await fetch("http://localhost:5000/email-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: guardianEmail,
        message: "Attached is your child's attendance and fee report.",
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Email sent successfully!");
    } else {
      alert(`Failed to send email: ${data.error}`);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <p className="text-red-500 text-center mt-10 text-lg font-semibold">
        Access denied. Admins only.
      </p>
    );
  }

  const filteredAttendance = attendanceRecords.filter(
    (r) =>
      (selectedClass ? r.class === selectedClass : true) &&
      (selectedStudent ? r.student_name === selectedStudent : true)
  );

  const filteredFees = feePayments.filter(
    (p) =>
      (selectedClass ? p.class === selectedClass : true) &&
      (selectedStudent ? p.student_name === selectedStudent : true)
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex gap-2">
          <select
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Classes</option>
            {[...new Set(attendanceRecords.map((r) => r.class))].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Students</option>
            {[...new Set(attendanceRecords.map((r) => r.student_name))].map(
              (s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              )
            )}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Print
          </button>

          <button
            onClick={handleDownloadPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Download PDF
          </button>

          <button
            onClick={sendEmail}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Email to Parent
          </button>
        </div>
      </div>

      <div ref={componentRef} className="bg-white p-6 shadow-md rounded">
        <h2 className="text-2xl font-bold mb-6">Student Report</h2>

        {/* Attendance Table */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Attendance Records</h3>
          {filteredAttendance.length === 0 ? (
            <p className="text-gray-500">No attendance data available.</p>
          ) : (
            <table className="min-w-full text-sm text-left border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Student</th>
                  <th className="px-4 py-2 border">Class</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((record) => {
                  const dt = new Date(record.date);
                  return (
                    <tr key={record.id}>
                      <td className="border px-4 py-2">
                        {record.student_name}
                      </td>
                      <td className="border px-4 py-2">{record.class}</td>
                      <td className="border px-4 py-2">
                        {dt.toLocaleDateString()}
                      </td>
                      <td className="border px-4 py-2">{record.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Fee Table */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Fee Payment Records</h3>
          {filteredFees.length === 0 ? (
            <p className="text-gray-500">No fee data available.</p>
          ) : (
            <table className="min-w-full text-sm text-left border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Student</th>
                  <th className="px-4 py-2 border">Class</th>
                  <th className="px-4 py-2 border">Term</th>
                  <th className="px-4 py-2 border">Amount</th>
                  <th className="px-4 py-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredFees.map((payment) => {
                  const dt = new Date(payment.payment_date);
                  return (
                    <tr key={payment.id}>
                      <td className="border px-4 py-2">
                        {payment.student_name}
                      </td>
                      <td className="border px-4 py-2">{payment.class}</td>
                      <td className="border px-4 py-2">{payment.term}</td>
                      <td className="border px-4 py-2">KES {payment.amount}</td>
                      <td className="border px-4 py-2">
                        {dt.toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentReport;
