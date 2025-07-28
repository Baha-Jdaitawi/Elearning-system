// routes/recommendationRoutes.js
import express from 'express';
import {
  getRecommendationsController,
  trackInteractionController,
  getLearningProfileController,
  updatePreferencesController
} from '../controllers/recommendationController.js';

import { authenticate } from '../middleware/auth.js';
import { body, query, param } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get personalized recommendations
router.get(
  '/',
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 20 })
      .withMessage('Limit must be between 1 and 20'),
    query('refresh')
      .optional()
      .isBoolean()
      .withMessage('Refresh must be boolean'),
    handleValidationErrors
  ],
  getRecommendationsController
);

// Track user interaction
router.post(
  '/track',
  [
    body('interactionType')
      .isIn(['view', 'search', 'enroll', 'start_lesson', 'complete_lesson', 'complete_course', 'rate'])
      .withMessage('Invalid interaction type'),
    body('courseId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Course ID must be a positive integer'),
    body('lessonId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Lesson ID must be a positive integer'),
    handleValidationErrors
  ],
  trackInteractionController
);

// Get learning profile
router.get(
  '/profile/:userId',
  [
    param('userId')
      .isInt({ min: 1 })
      .withMessage('User ID must be a positive integer'),
    handleValidationErrors
  ],
  getLearningProfileController
);

// Update user preferences
router.put(
  '/preferences',
  [
    body('learning_goals')
      .optional()
      .isArray()
      .withMessage('Learning goals must be an array'),
    body('preferred_difficulty')
      .optional()
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Invalid difficulty level'),
    body('time_availability')
      .optional()
      .isInt({ min: 1, max: 168 })
      .withMessage('Time availability must be between 1-168 hours per week'),
    body('interests')
      .optional()
      .isArray()
      .withMessage('Interests must be an array'),
    body('learning_style')
      .optional()
      .isIn(['visual', 'text', 'hands-on', 'mixed'])
      .withMessage('Invalid learning style'),
    handleValidationErrors
  ],
  updatePreferencesController
);

export default router;