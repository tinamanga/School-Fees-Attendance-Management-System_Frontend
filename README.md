## School Fees Attendance Management System – Frontend

  #### User Instructions

   1. Student Login:
   Use the credentials assigned by the admin

   Default password: student123

   - After login, you’ll be redirected to the Student Dashboard.

##### Dashboard View Includes:
- Personal info (name, classroom)

- Fee Installments Table

- Lists each fee payment with:

- Amount

- Date

- Term

- Attendance Table

- Displays attendance history with:

- Date

- Status: "Present" or "Absent"

##### Functionalities:
- View all past fee payments

- View attendance history

Note: Cannot edit data or access other parts of the system

2. Teacher Login
   - Use your teacher credentials

   - Redirects to the Teacher Dashboard

##### Dashboard View Includes:
   - Attendance stats: Total records submitted

   - List of students with marked attendance

##### Functionalities:
   - Submit Attendance

   - Go to the Attendance page

   - Mark Present/Absent for each student, Mon–Fri

   - Submit weekly records in bulk

   - View Attendance History

   - Go to the Attendance History page

   - View past submissions grouped by:

   - Date

   - Student

##### Limitations:
 - Teachers can only interact with attendance

 - Cannot add/edit students, classrooms, or payments

3.  Admin Login
   - Use your admin credentials

   - Redirects to the Admin Dashboard

##### Dashboard View Includes:
   - Total Students

   - Total Fee Collected

    - Total Attendance Records 

##### Functionalities:
- Students Management
- Add, edit, delete students

- Assign students to classrooms

- Auto-generates student login with default password

- Classrooms Management
- Add, rename, delete classrooms

Note: Only Admins can access this section

##### Fee Payments
 - View all fee records

 - Add new payment per student

 - Filter or view by academic term

##### Attendance History
- View all attendance logs submitted by teachers

## Project Setup Instructions (For New Developers)
1. Clone the Repository
```bash
    git clone https://github.com/School-Fees-Attendance-Management-System_Frontend.

    cd School-Fees-Attendance-Management-System_Frontend/frontend
```
2. Install Dependencies
```bash
    npm install
```
3. Start the React Frontend
```bash
    npm run dev
```
   - App will run on:
    http://localhost:5174

   -  Make sure your Flask backend is running at:
    http://localhost:5000

4. Configurations
    - Routing: React Router DOM v6+

    - API Calls: Handled using the native fetch() API

5. Test Login Credentials

    | Role    | Username   | Password     |
| ------- | ---------- | ------------ |
| Student | `student1` | `student123` |
| Teacher | `teacher1` | `teacher123` |
| Admin   | `admin`    | `admin123`   |


### Netlify  Website URL
 copy the url below and open it on your browser:
 - venerable-bienenstitch-f6efef.netlify.app