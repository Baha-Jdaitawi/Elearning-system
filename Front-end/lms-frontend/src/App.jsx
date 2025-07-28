import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
import Layout from './components/layout/Layout';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

// Pages - General
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import DashboardRedirect from './pages/DashboardRedirect';

// Pages - Course Related
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import CreateCourse from './pages/CreateCourse';
import EditCourse from './pages/EditCourse';

// Pages - Lesson Related
import LessonDetail from './pages/LessonDetail';
import CreateLesson from './pages/CreateLesson';

// Pages - Assignment Related
import AssignmentDetail from './pages/AssignmentDetail';
import CreateAssignment from './pages/CreateAssignment';
import AssignmentUpload from './pages/AssignmentUpload';

// Pages - Quiz Related
import QuizTaking from './pages/QuizTaking';
import CreateQuiz from './pages/CreateQuiz';

// Pages - Module Related
import CreateModule from './pages/CreateModule';

// Pages - Instructor Related
import InstructorDashboard from './pages/InstructorDashboard';
import InstructorCourseManage from './pages/InstructorCourseManage';
import InstructorLessonManagement from './pages/InstructorLessonManagement';
import InstructorStudents from './pages/InstructorStudents';

// Instructor Components
import QuizResponsesDashboard from './components/instructor/QuizResponsesDashboard';
import SubmissionDashboard from './pages/SubmissionDashboard';

// Pages - Admin Related
import AdminUserList from './pages/AdminUserList';
import AdminUserActivity from './pages/AdminUserActivity';
import AdminUserStats from './pages/AdminUserStats';

// 🆕 AI Recommendation System Pages
import RecommendationsWidget from './pages/RecommendationsWidget';
import UserPreferences from './pages/UserPreferences';
import LearningAnalytics from './pages/LearningAnalytics';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses />} />

            {/* Role-Based Dashboard Redirect */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              }
            />

            {/* 🆕 AI Recommendation System Routes */}
            <Route
              path="/recommendations"
              element={
                <ProtectedRoute>
                  <RecommendationsWidget />
                </ProtectedRoute>
              }
            />
            <Route
              path="/preferences"
              element={
                <ProtectedRoute>
                  <UserPreferences />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <LearningAnalytics />
                </ProtectedRoute>
              }
            />

            {/* Course Routes */}
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route
              path="/courses/create"
              element={
                <ProtectedRoute requiredRole="instructor">
                  <CreateCourse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:id/edit"
              element={
                <ProtectedRoute requiredRole="instructor">
                  <EditCourse />
                </ProtectedRoute>
              }
            />

            {/* Lesson Routes */}
            <Route
              path="/courses/:courseId/lessons/:lessonId"
              element={
                <ProtectedRoute>
                  <LessonDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:courseId/modules/:moduleId/lessons/create"
              element={
                <ProtectedRoute requiredRole="instructor">
                  <CreateLesson />
                </ProtectedRoute>
              }
            />

            {/* Quiz Routes */}
            <Route
              path="/courses/:courseId/lessons/:lessonId/quiz"
              element={
                <ProtectedRoute requiredRole="student">
                  <QuizTaking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:courseId/lessons/:lessonId/quizzes/create"
              element={
                <ProtectedRoute requiredRole="instructor">
                  <CreateQuiz />
                </ProtectedRoute>
              }
            />

            {/* Assignment Routes */}
            <Route
              path="/courses/:courseId/assignments/:assignmentId"
              element={
                <ProtectedRoute>
                  <AssignmentDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:courseId/lessons/:lessonId/assignments/create"
              element={
                <ProtectedRoute requiredRole="instructor">
                  <CreateAssignment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assignments/upload"
              element={
                <ProtectedRoute requiredRole="student">
                  <AssignmentUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/assignments/:assignmentId/submissions"
              element={
                <ProtectedRoute requiredRole="instructor">
                  <SubmissionDashboard />
                </ProtectedRoute>
              }
            />

            {/* Module Routes */}
            <Route
              path="/courses/:courseId/modules/create"
              element={
                <ProtectedRoute requiredRole="instructor">
                  <CreateModule />
                </ProtectedRoute>
              }
            />

            {/* Instructor Routes */}
            <Route
              path="/instructor/dashboard"
              element={
                <ProtectedRoute requiredRole="instructor">
                  <InstructorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses/:id/manage"
              element={
                <ProtectedRoute requiredRole="instructor">
                  <InstructorCourseManage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses/:courseId/lessons/:lessonId"
              element={
                <ProtectedRoute requiredRole="instructor">
                  <InstructorLessonManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses/:id/students"
              element={
                <ProtectedRoute requiredRole="instructor">
                  <InstructorStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses/:courseId/lessons/:lessonId/quiz-responses"
              element={
                <ProtectedRoute requiredRole="instructor">
                  <QuizResponsesDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminUserList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/:id/activity"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminUserActivity />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stats"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminUserStats />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={<Navigate to="/admin/users" replace />}
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;





