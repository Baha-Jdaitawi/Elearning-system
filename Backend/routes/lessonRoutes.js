// routes/lessonRoutes.js
import express from 'express';
import {
  createLessonController,
  getLessonByIdController,
  getAdjacentLessonsController,
  getLessonsByModuleController,
  updateLessonController,
  deleteLessonController,
  reorderLessonsController,
  getLessonStatsController,
  duplicateLessonController,
  toggleLessonPublishStatusController,
  getCourseLessonsNavigationController,
  searchLessonsInCourseController,
  markLessonCompleteController,        
  getLessonProgressController,         
  getUserLessonProgressController      
} from '../controllers/lessonController.js';

import { authenticate, authorize } from '../middleware/auth.js';
import {
  validateLessonCreation,
  validateId,
  validateSearch,
  handleValidationErrors
} from '../middleware/validation.js';

import { body, param } from 'express-validator';
import { USER_ROLES } from '../utils/constants.js';

const router = express.Router();


router.use(authenticate);


router.get('/course/:course_id/navigation', validateId, getCourseLessonsNavigationController);
router.get('/course/:course_id/search', validateSearch, searchLessonsInCourseController);


router.get(
  '/module/:module_id',
  [
    param('module_id')
      .isInt({ min: 1 })
      .withMessage('Module ID must be a positive integer'),
    handleValidationErrors
  ],
  getLessonsByModuleController
);


router.post(
  '/:id/complete',
  validateId,
  [
    body('timeSpent')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Time spent must be a non-negative integer'),
    handleValidationErrors
  ],
  markLessonCompleteController
);


router.get(
  '/:id/progress',
  validateId,
  getUserLessonProgressController
);


router.get(
  '/:id/progress/all',
  validateId,
  authorize(USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN),
  getLessonProgressController
);


router.post(
  '/',
  authorize(USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN),
  validateLessonCreation,
  createLessonController
);


router.get('/:id', validateId, getLessonByIdController);


router.get('/:id/adjacent', validateId, getAdjacentLessonsController);


router.put(
  '/:id',
  validateId,
  authorize(USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN),
  [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Lesson title must be between 3 and 200 characters'),
    body('content')
      .optional()
      .trim()
      .isLength({ max: 10000 })
      .withMessage('Content cannot exceed 10000 characters'),
    body('video_url')
      .optional()
      .isURL()
      .withMessage('Video URL must be valid'),
    body('video_duration')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Video duration must be a non-negative integer'),
    body('position')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Position must be a positive integer'),
    body('is_published')
      .optional()
      .isBoolean()
      .withMessage('Published must be boolean'),
    handleValidationErrors
  ],
  updateLessonController
);


router.delete(
  '/:id', 
  validateId, 
  authorize(USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN), 
  deleteLessonController
);


router.put(
  '/:id/toggle-publish', 
  validateId, 
  authorize(USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN), 
  toggleLessonPublishStatusController
);


router.post(
  '/:id/duplicate',
  validateId,
  authorize(USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN),
  [
    body('targetModuleId')
      .isInt({ min: 1 })
      .withMessage('Target module ID is required'),
    handleValidationErrors
  ],
  duplicateLessonController
);


router.get(
  '/:id/stats', 
  validateId, 
  authorize(USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN), 
  getLessonStatsController
);

// 🔃 Reorder lessons within a module (instructor/admin only)
router.put(
  '/module/:module_id/reorder',
  [
    param('module_id')
      .isInt({ min: 1 })
      .withMessage('Module ID must be a positive integer'),
    body('lessonPositions')
      .isArray({ min: 1 })
      .withMessage('Lesson positions array is required'),
    body('lessonPositions.*.id')
      .isInt({ min: 1 })
      .withMessage('Each lesson ID must be a positive integer'),
    body('lessonPositions.*.position')
      .isInt({ min: 1 })
      .withMessage('Each position must be a positive integer'),
    handleValidationErrors
  ],
  authorize(USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN),
  reorderLessonsController
);

export default router;

