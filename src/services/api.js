const BASE_URL = import.meta.env.VITE_API_URL;

// GET all students
export const fetchStudents = async () => {
  const res = await fetch(`${BASE_URL}/students`);
  return res.json();
};

// POST new student
export const createStudent = async (data) => {
  const res = await fetch(`${BASE_URL}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

// GET attendance
export const fetchAttendance = async () => {
  const res = await fetch(`${BASE_URL}/attendance`);
  return res.json();
};

// POST attendance
export const submitAttendance = async (data) => {
  const res = await fetch(`${BASE_URL}/attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

// GET dashboard data
export const fetchDashboardData = async () => {
  const res = await fetch(`${BASE_URL}/dashboard`);
  return res.json();
};
