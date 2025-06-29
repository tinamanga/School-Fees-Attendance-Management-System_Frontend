✅ Frontend User Instructions
🧑‍🎓 STUDENT
Login:

Use the credentials assigned by the admin (username, default password: student123).

You will be redirected to the Student Dashboard.

Dashboard View Includes:

Personal info (name, classroom).

Fee Installments Table: Each fee payment listed with amount, date, and term.

Attendance Table: View attendance history showing dates and status ("Present"/"Absent").

Functionalities:

✅ View all past fee payments.

✅ View attendance history.

🚫 Cannot edit any data or access other parts of the system.


🧑‍🏫 TEACHER
Login:


Use your teacher credentials.

Redirected to the Teacher Dashboard.

Dashboard View Includes:

Attendance stats: Total records submitted.

List of students whose attendance has been marked by this teacher.

Functionalities:

Submit Attendance:

Navigate to the Attendance page.

Weekly table layout (Mon–Fri).

Mark Present/Absent per student per day.

Submit bulk weekly records to backend.

View Attendance History:

Navigate to Attendance History.

See submitted attendance grouped by date and student.

Note:

Teachers can only interact with attendance-related features.

They cannot add/edit students, classrooms, or payments.


👨‍💼 ADMIN
Login:


Use your admin credentials.

Redirected to the Admin Dashboard.

Dashboard View Includes:

Total Students

Total Fee Collected

Total Attendance Records Logged

Functionalities:

Students Management

Add, edit, or delete students.

Assign students to classrooms.

Automatically creates a student login with a default password.

Classrooms Management

Add, rename, or delete classrooms.

Only Admins have access to this functionality.

Fee Payments

View all payments.

Add new payments per student.

Filter or view payments per term.

Attendance History

View attendance logs submitted by all teachers.



Project Setup Instructions (For New Developers)

git clone https://github.com/School-Fees-Attendance-Management-System_Frontend.git
cd School-Fees-Attendance-Management-System_Frontend/frontend


Install Dependencies

npm install


Start the React Frontend

npm start

This will start the app on: http://localhost:3000


Ensure your Flask backend is also running at http://localhost:5000



Configurations

React Router DOM v6+ is used for routing.
Fetch is used for API requests.



Test frontend login as:

student1 → password: student123

teacher1 → password: teacher123

admin → password: admin123