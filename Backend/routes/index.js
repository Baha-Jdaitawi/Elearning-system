// routes/index.js - Complete Route Integration
import express from 'express';

// Auth routes
import authRoutes from './authRoutes.js';

// Core feature routes
import userRoutes from './userRoutes.js';
import courseRoutes from './courseRoutes.js';
import enrollmentRoutes from './enrollmentRoutes.js';
import categoryRoutes from './categoryRoutes.js';

// Learning content routes
import moduleRoutes from './moduleRoutes.js';
import lessonRoutes from './lessonRoutes.js';
import quizRoutes from './quizRoutes.js';
import assignmentRoutes from './assignmentRoutes.js';
import submissionRoutes from './submissionRoutes.js';

// Certificate system routes
import certificateRoutes from './certificateRoutes.js';


import recommendationRoutes from './recommendationRoutes.js';

const router = express.Router();

// API Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LMS API is running successfully',
    timestamp: new Date().toISOString(),
    features: {
      authentication: true,
      courses: true,
      enrollments: true,
      certificates: true,
      ai_recommendations: true, // 🆕 AI feature flag
      progress_tracking: true,
      learning_analytics: true
    }
  });
});

// Authentication routes
router.use('/auth', authRoutes);

// User management routes
router.use('/users', userRoutes);

// Course management routes
router.use('/courses', courseRoutes);
router.use('/categories', categoryRoutes);

// Learning content routes
router.use('/modules', moduleRoutes);
router.use('/lessons', lessonRoutes);
router.use('/quizzes', quizRoutes);

// Assignment and submission routes
router.use('/assignments', assignmentRoutes);
router.use('/submissions', submissionRoutes);

// Enrollment and progress routes
router.use('/enrollments', enrollmentRoutes);

// Certificate generation routes
router.use('/certificates', certificateRoutes);


router.use('/recommendations', recommendationRoutes);

// API Documentation route
router.get('/docs', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LMS API Documentation',
    version: '2.0.0',
    endpoints: {
      authentication: {
        'POST /auth/register': 'User registration',
        'POST /auth/login': 'User login',
        'GET /auth/google': 'Google OAuth login',
        'POST /auth/logout': 'User logout',
        'GET /auth/profile': 'Get user profile'
      },
      users: {
        'GET /users': 'Get all users (admin only)',
        'GET /users/:id': 'Get user by ID',
        'PUT /users/:id': 'Update user',
        'DELETE /users/:id': 'Delete user (admin only)',
        'GET /users/stats': 'Get user statistics',
        'GET /users/:id/activity': 'Get user activity'
      },
      courses: {
        'GET /courses': 'Get all courses',
        'POST /courses': 'Create course (instructor/admin)',
        'GET /courses/:id': 'Get course by ID',
        'PUT /courses/:id': 'Update course',
        'DELETE /courses/:id': 'Delete course',
        'GET /courses/search': 'Search courses'
      },
      enrollments: {
        'POST /enrollments': 'Enroll in course',
        'GET /enrollments/user/:userId': 'Get user enrollments',
        'GET /enrollments/course/:courseId/progress': 'Get course progress'
      },
      lessons: {
        'GET /lessons/:id': 'Get lesson by ID',
        'POST /lessons/:id/complete': '🆕 Mark lesson complete',
        'GET /lessons/:id/progress': '🆕 Get lesson progress',
        'GET /lessons/module/:moduleId': 'Get lessons by module'
      },
      certificates: {
        'POST /certificates/generate/:userId/:courseId': 'Generate certificate',
        'GET /certificates/download/:userId/:courseId': 'Download certificate',
        'GET /certificates/verify/:certificateId': 'Verify certificate',
        'GET /certificates/user/:userId': 'Get user certificates'
      },
      ai_recommendations: {
        'GET /recommendations': '🆕 Get AI-powered course recommendations',
        'POST /recommendations/track': '🆕 Track user interaction for AI',
        'GET /recommendations/profile/:userId': '🆕 Get user learning profile',
        'PUT /recommendations/preferences': '🆕 Update learning preferences'
      },
      analytics: {
        'GET /users/:id/stats': '🆕 Learning analytics',
        'GET /courses/:id/analytics': '🆕 Course analytics',
        'GET /recommendations/insights': '🆕 AI recommendation insights'
      }
    },
    new_features: {
      ai_recommendations: {
        description: 'AI-powered course recommendations based on user behavior',
        endpoints: [
          'GET /recommendations - Get personalized recommendations',
          'POST /recommendations/track - Track user interactions',
          'PUT /recommendations/preferences - Set learning preferences'
        ]
      },
      progress_tracking: {
        description: 'Advanced lesson and course progress tracking',
        endpoints: [
          'POST /lessons/:id/complete - Mark lesson complete with time tracking',
          'GET /lessons/:id/progress - Get detailed progress data'
        ]
      },
      certificate_automation: {
        description: 'Automatic certificate generation on course completion',
        features: [
          'Auto-generation when course 100% complete',
          'Professional PDF certificates',
          'Certificate verification system'
        ]
      },
      learning_analytics: {
        description: 'Comprehensive learning analytics and insights',
        features: [
          'Time spent tracking',
          'Skill development monitoring',
          'Learning pattern analysis',
          'Progress visualization'
        ]
      }
    }
  });
});

// 404 handler for undefined routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.originalUrl} not found`,
    suggestion: 'Check /api/docs for available endpoints',
    available_routes: [
      '/api/auth - Authentication',
      '/api/users - User management', 
      '/api/courses - Course management',
      '/api/lessons - Lesson management',
      '/api/enrollments - Enrollment management',
      '/api/certificates - Certificate system',
      '/api/recommendations - 🆕 AI Recommendations',
      '/api/docs - API documentation',
      '/api/health - Health check'
    ]
  });
});

export default router;