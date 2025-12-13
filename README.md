# LearnHub LMS

LearnHub is a full-stack **Learning Management System (LMS)** built with **Node.js**, **Express.js**, **PostgreSQL**, and a **React.js frontend**. It enables instructors to create and manage courses, modules, and lessons, while students can browse, enroll, track their learning progress, and earn downloadable certificates upon course completion.

---



---

## **Features**

### **Instructor**
- Secure login & role-based authorization.
- Create, update, and manage:
  - Courses (title, price, categories, etc.)
  - Modules (linked to courses)
  - Lessons (video/text/content linked to modules)
- View dashboard metrics (total students enrolled, published courses count).
- Edit existing courses, modules, and lessons.

### **Student**
- Browse and filter courses by search term, category, or title.
- View course details (fetched dynamically using `useParams` and `useEffect`).
- Enroll in courses (secure **POST** request using token + `courseId`).
- Access a personalized dashboard listing enrolled courses.
- Track progress:
  - Lesson completion status saved in the database.
  - Dynamic progress bars update automatically using **GET** requests.
- Attempt quizzes (time-bound with hints, bookmarking, and retake options).
- Receive and download **certificates (PDF)** upon course completion.

### **Certificate Management**
- Certificates are generated automatically when a student completes a course.
- Uses **pdfkit** to generate a styled PDF containing:
  - Student name
  - Course title
  - Instructor name
  - Completion date
  - Unique certificate ID
- Certificates are stored in `/uploads/certificates` and can be re-downloaded.

---

## **Tech Stack**

### **Frontend**
- React.js (Vite)
- Material-UI (MUI)
- React Router (useParams, useNavigate)
- Axios for API calls
- Context API for authentication (AuthContext)

### **Backend**
- Node.js + Express.js
- PostgreSQL with `pg` library (raw SQL queries)
- Middleware:
  - **CORS**: Handles cross-origin requests
  - **Morgan**: Logs incoming HTTP requests
  - **Helmet**: Secures HTTP headers
  - **Compression**: Improves performance by compressing responses
  - **ErrorHandler**: Centralized error handling with `asyncHandler`
- JSON Web Token (JWT) for authentication

### **Others**
- **pdfkit**: Generates certificates as PDFs
- **date-fns**: Formats dates in certificates
- **dotenv**: Loads environment variables
