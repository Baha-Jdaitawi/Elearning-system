// API base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api';

// API endpoints - matching your backend routes exactly
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    GOOGLE: '/auth/google',
    GOOGLE_CALLBACK: '/auth/google/callback',
    PROFILE: '/auth/profile',
    UPDATE_PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    REFRESH: '/auth/refresh',
    VALIDATE: '/auth/validate',
    CHECK_EMAIL: '/auth/check-email',
    STATS: '/auth/stats'
  },

  // User endpoints
  USERS: {
    BASE: '/users',
    DASHBOARD: '/users/dashboard',
    SEARCH: '/users/search',
    BY_ROLE: (role) => `/users/role/${role}`,
    BY_ID: (id) => `/users/${id}`,
    STATS: '/users/stats',
    ACTIVITY: (id) => `/users/${id}/activity`,
    PROMOTE: (id) => `/users/${id}/promote`,
    DEMOTE: (id) => `/users/${id}/demote`,
    BULK_UPDATE: '/users/bulk-update'
  },

  // Course endpoints
  COURSES: {
    BASE: '/courses',
    FEATURED: '/courses/featured',
    SEARCH: '/courses/search',
    BY_CATEGORY: (categoryId) => `/courses/category/${categoryId}`,
    BY_ID: (id) => `/courses/${id}`,
    INSTRUCTOR: '/courses/instructor',
    INSTRUCTOR_BY_ID: (instructorId) => `/courses/instructor/${instructorId}`,
    PUBLISH: (id) => `/courses/${id}/publish`,
    DUPLICATE: (id) => `/courses/${id}/duplicate`,
    STATS: (id) => `/courses/${id}/stats`,
    PROGRESS: (id) => `/courses/${id}/progress`
  },

  // Category endpoints
  CATEGORIES: {
    BASE: '/categories',
    POPULAR: '/categories/popular',
    SEARCH: '/categories/search',
    BY_ID: (id) => `/categories/${id}`,
    OVERVIEW: '/categories/admin/overview',
    DISTRIBUTION: '/categories/admin/distribution',
    STATS: (id) => `/categories/${id}/stats`,
    BULK_DELETE: '/categories/bulk/delete',
    BULK_MERGE: '/categories/bulk/merge'
  },

  // Enrollment endpoints
  ENROLLMENTS: {
    BASE: '/enrollments',
    MY: '/enrollments/my',
    STATS: '/enrollments/stats',
    RECENT: '/enrollments/recent',
    RECOMMENDED: '/enrollments/recommended',
    INSTRUCTOR: '/enrollments/instructor',
    INSTRUCTOR_BY_ID: (instructorId) => `/enrollments/instructor/${instructorId}`,
    COURSE_STUDENTS: (courseId) => `/enrollments/course/${courseId}/students`,
    COURSE_TOP_STUDENTS: (courseId) => `/enrollments/course/${courseId}/top-students`,
    COURSE_ANALYTICS: (courseId) => `/enrollments/course/${courseId}/analytics`,
    COURSE_STATUS: (courseId) => `/enrollments/course/${courseId}/status`,
    COURSE_PROGRESS: (courseId) => `/enrollments/course/${courseId}/progress`,
    BY_ID: (id) => `/enrollments/${id}`,
    UPDATE_PROGRESS: (courseId) => `/enrollments/course/${courseId}/progress`,
    UNENROLL: (courseId) => `/enrollments/course/${courseId}`,
    BULK: '/enrollments/bulk'
  },

  // Module endpoints
  MODULES: {
    BASE: '/modules',
    BY_COURSE: (courseId) => `/modules/course/${courseId}`,
    BY_ID: (id) => `/modules/${id}`,
    PUBLISH: (id) => `/modules/${id}/publish`,
    DUPLICATE: (id) => `/modules/${id}/duplicate`,
    STATS: (id) => `/modules/${id}/stats`,
    REORDER: (courseId) => `/modules/course/${courseId}/reorder`
  },

  // Lesson endpoints
  LESSONS: {
    BASE: '/lessons',
    BY_MODULE: (moduleId) => `/lessons/module/${moduleId}`,
    COURSE_NAVIGATION: (courseId) => `/lessons/course/${courseId}/navigation`,
    COURSE_SEARCH: (courseId) => `/lessons/course/${courseId}/search`,
    BY_ID: (id) => `/lessons/${id}`,
    PUBLISH: (id) => `/lessons/${id}/publish`,
    DUPLICATE: (id) => `/lessons/${id}/duplicate`,
    STATS: (id) => `/lessons/${id}/stats`,
    REORDER: (moduleId) => `/lessons/module/${moduleId}/reorder`
  },

  // Quiz endpoints
  QUIZZES: {
    BASE: '/quizzes',
    BY_LESSON: (lessonId) => `/quizzes/lesson/${lessonId}`,
    BY_COURSE: (courseId) => `/quizzes/course/${courseId}`,
    COURSE_SEARCH: (courseId) => `/quizzes/course/${courseId}/search`,
    COURSE_RANDOM: (courseId) => `/quizzes/course/${courseId}/random`,
    SUBMIT: (lessonId) => `/quizzes/lesson/${lessonId}/submit`,
    BY_ID: (id) => `/quizzes/${id}`,
    BULK: (lessonId) => `/quizzes/lesson/${lessonId}/bulk`,
    DUPLICATE: (id) => `/quizzes/${id}/duplicate`,
    STATS: (lessonId) => `/quizzes/lesson/${lessonId}/stats`
  },

  // Assignment endpoints
  ASSIGNMENTS: {
    BASE: '/assignments',
    BY_LESSON: (lessonId) => `/assignments/lesson/${lessonId}`,
    BY_COURSE: (courseId) => `/assignments/course/${courseId}`,
    BY_ID: (id) => `/assignments/${id}`,
    STATS: (id) => `/assignments/${id}/stats`
  },

  // Submission endpoints
  SUBMISSIONS: {
    BASE: '/submissions',
    SUBMIT: (assignmentId) => `/submissions/assignment/${assignmentId}`,
    MY: '/submissions/my',
    BY_ASSIGNMENT: (assignmentId) => `/submissions/assignment/${assignmentId}`,
    BY_ID: (id) => `/submissions/${id}`,
    GRADE: (id) => `/submissions/${id}/grade`,
    BULK_GRADE: (assignmentId) => `/submissions/assignment/${assignmentId}/bulk-grade`,
    STATS: (assignmentId) => `/submissions/assignment/${assignmentId}/stats`
  }
};

// HTTP methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
};

// Request headers
export const REQUEST_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};