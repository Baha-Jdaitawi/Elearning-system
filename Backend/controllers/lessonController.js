import {
  createLesson,
  getLessonById,
  getLessonsByModule,
  updateLesson,
  deleteLesson,
  reorderLessons,
  getNextLessonPosition,
  lessonTitleExistsInModule,
  getLessonWithCourseInfo,
  getAdjacentLessons,
  getLessonStats,
  duplicateLesson,
  toggleLessonPublishStatus,
  getCourseLessonsNavigation,
  searchLessonsInCourse
} from '../models/lessonModel.js';

import {
  getModuleWithCourse
} from '../models/moduleModel.js';

import { getCourseById } from '../models/courseModel.js';

// 🆕 Import progress tracking models
import { 
  markLessonComplete,
  getLessonProgress,
  getUserLessonProgress,
  calculateCourseProgress,
  updateEnrollmentProgress
} from '../models/progressModel.js';

import { generateCertificate } from '../utils/certificateGenerator.js';
import { successResponse, errorResponse } from '../utils/helpers.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { HTTP_STATUS, MESSAGES, USER_ROLES } from '../utils/constants.js';

// ✅ Create new lesson
export const createLessonController = asyncHandler(async (req, res) => {
  const {
    module_id,
    title,
    content,
    video_url,
    video_duration,
    position,
    is_published = true
  } = req.body;
  const user = req.user;

  const moduleWithCourse = await getModuleWithCourse(module_id);
  if (!moduleWithCourse) {
    throw new AppError('Module not found', HTTP_STATUS.NOT_FOUND);
  }

  if (user.role !== USER_ROLES.ADMIN && moduleWithCourse.instructor_id !== user.id) {
    throw new AppError('Access denied. You can only add lessons to your own modules.', HTTP_STATUS.FORBIDDEN);
  }

  const titleExists = await lessonTitleExistsInModule(title, module_id);
  if (titleExists) {
    throw new AppError('Lesson title already exists in this module', HTTP_STATUS.CONFLICT);
  }

  const lessonPosition = position || await getNextLessonPosition(module_id);

  const lessonData = {
    module_id,
    title: title.trim(),
    content: content?.trim(),
    video_url,
    video_duration: video_duration || null,
    position: lessonPosition,
    is_published
  };

  const lesson = await createLesson(lessonData);

  res.status(HTTP_STATUS.CREATED).json(successResponse(
    lesson,
    'Lesson created successfully'
  ));
});

// ✅ Get lesson by ID
export const getLessonByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { includeAssessments = false } = req.query;
  const user = req.user;

  const lesson = await getLessonById(parseInt(id), includeAssessments === 'true');
  if (!lesson) {
    throw new AppError('Lesson not found', HTTP_STATUS.NOT_FOUND);
  }

  if (user.role === USER_ROLES.STUDENT && !lesson.is_published) {
    throw new AppError('Lesson not available', HTTP_STATUS.FORBIDDEN);
  }

  if (user.role === USER_ROLES.INSTRUCTOR && lesson.instructor_id !== user.id) {
    throw new AppError('Access denied', HTTP_STATUS.FORBIDDEN);
  }

  // 🆕 Get user's progress for this lesson
  let userProgress = null;
  if (user.role === USER_ROLES.STUDENT) {
    try {
      userProgress = await getUserLessonProgress(user.id, parseInt(id));
    } catch (progressError) {
      console.warn('Could not fetch user lesson progress:', progressError.message);
    }
  }

  const adjacentLessons = await getAdjacentLessons(parseInt(id));

  res.status(HTTP_STATUS.OK).json(successResponse(
    { 
      ...lesson, 
      navigation: adjacentLessons,
      userProgress: userProgress
    },
    'Lesson retrieved successfully'
  ));
});

// ✅ Get adjacent lessons
export const getAdjacentLessonsController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const lesson = await getLessonById(parseInt(id));
  if (!lesson) {
    throw new AppError('Lesson not found', HTTP_STATUS.NOT_FOUND);
  }

  const adjacentLessons = await getAdjacentLessons(parseInt(id));

  res.status(HTTP_STATUS.OK).json(successResponse(
    adjacentLessons,
    'Adjacent lessons retrieved successfully'
  ));
});

// ✅ Get lessons by module
export const getLessonsByModuleController = asyncHandler(async (req, res) => {
  const { module_id } = req.params;
  const { includeUnpublished = false, includeAssessments = false } = req.query;
  const user = req.user;

  const moduleWithCourse = await getModuleWithCourse(parseInt(module_id));
  if (!moduleWithCourse) {
    throw new AppError('Module not found', HTTP_STATUS.NOT_FOUND);
  }

  const canIncludeUnpublished = user.role === USER_ROLES.ADMIN || 
    (user.role === USER_ROLES.INSTRUCTOR && moduleWithCourse.instructor_id === user.id);

  const options = {
    includeUnpublished: includeUnpublished === 'true' && canIncludeUnpublished,
    includeAssessments: includeAssessments === 'true'
  };

  const lessons = await getLessonsByModule(parseInt(module_id), options);

  res.status(HTTP_STATUS.OK).json(successResponse(
    {
      moduleId: parseInt(module_id),
      moduleTitle: moduleWithCourse.title,
      courseTitle: moduleWithCourse.course_title,
      lessons
    },
    'Lessons retrieved successfully'
  ));
});

// 🆕 LESSON COMPLETION CONTROLLER - Production Ready
export const markLessonCompleteController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { timeSpent = 0 } = req.body;
  const userId = req.user.id;

  // Verify lesson exists
  const lesson = await getLessonById(parseInt(id));
  if (!lesson) {
    throw new AppError('Lesson not found', HTTP_STATUS.NOT_FOUND);
  }

  // Only students can mark lessons as complete
  if (req.user.role !== USER_ROLES.STUDENT) {
    throw new AppError('Only students can mark lessons as complete', HTTP_STATUS.FORBIDDEN);
  }

  try {
    // Mark lesson as complete
    const progressData = await markLessonComplete(userId, parseInt(id), timeSpent);
    
    // Calculate updated course progress  
    const courseProgress = await calculateCourseProgress(userId, lesson.course_id);
    
    // Update enrollment progress
    await updateEnrollmentProgress(userId, lesson.course_id, courseProgress);

    // 🎯 Auto-generate certificate if course is 100% complete
    let certificateGenerated = false;
    if (courseProgress.percentage >= 100 && courseProgress.completed) {
      try {
        await generateCertificate(userId, lesson.course_id);
        certificateGenerated = true;
        console.log(`🎓 Certificate auto-generated for user ${userId}, course ${lesson.course_id}`);
      } catch (certError) {
        console.warn('⚠️ Certificate generation failed:', certError.message);
        // Don't fail the lesson completion if certificate generation fails
      }
    }

    res.status(HTTP_STATUS.OK).json(successResponse(
      {
        lessonProgress: progressData,
        courseProgress: courseProgress,
        certificateGenerated: certificateGenerated
      },
      certificateGenerated 
        ? 'Lesson completed successfully! 🎓 Certificate generated!' 
        : 'Lesson completed successfully'
    ));

  } catch (error) {
    console.error('❌ Error in markLessonCompleteController:', error);
    throw new AppError('Failed to mark lesson as complete: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
});

// 🆕 GET USER'S PROGRESS FOR A LESSON
export const getUserLessonProgressController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const lesson = await getLessonById(parseInt(id));
  if (!lesson) {
    throw new AppError('Lesson not found', HTTP_STATUS.NOT_FOUND);
  }

  const progress = await getUserLessonProgress(userId, parseInt(id));

  res.status(HTTP_STATUS.OK).json(successResponse(
    {
      lessonId: parseInt(id),
      userId: userId,
      progress: progress
    },
    'Lesson progress retrieved successfully'
  ));
});

// 🆕 GET ALL PROGRESS FOR A LESSON (instructor/admin only)
export const getLessonProgressController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const lessonWithCourse = await getLessonWithCourseInfo(parseInt(id));
  if (!lessonWithCourse) {
    throw new AppError('Lesson not found', HTTP_STATUS.NOT_FOUND);
  }

  // Only instructor of the course or admin can view all progress
  if (user.role !== USER_ROLES.ADMIN && lessonWithCourse.instructor_id !== user.id) {
    throw new AppError('Access denied', HTTP_STATUS.FORBIDDEN);
  }

  const progressData = await getLessonProgress(parseInt(id));

  res.status(HTTP_STATUS.OK).json(successResponse(
    {
      lessonId: parseInt(id),
      lessonTitle: lessonWithCourse.title,
      progressData: progressData
    },
    'Lesson progress data retrieved successfully'
  ));
});

// ✅ Update lesson
export const updateLessonController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const user = req.user;

  const lessonWithCourse = await getLessonWithCourseInfo(parseInt(id));
  if (!lessonWithCourse) {
    throw new AppError('Lesson not found', HTTP_STATUS.NOT_FOUND);
  }

  if (user.role !== USER_ROLES.ADMIN && lessonWithCourse.instructor_id !== user.id) {
    throw new AppError('Access denied', HTTP_STATUS.FORBIDDEN);
  }

  if (updates.title) {
    const titleExists = await lessonTitleExistsInModule(updates.title, lessonWithCourse.module_id, parseInt(id));
    if (titleExists) {
      throw new AppError('Lesson title already exists in this module', HTTP_STATUS.CONFLICT);
    }
    updates.title = updates.title.trim();
  }

  if (updates.content !== undefined) updates.content = updates.content?.trim();

  const updatedLesson = await updateLesson(parseInt(id), updates);

  res.status(HTTP_STATUS.OK).json(successResponse(
    updatedLesson,
    'Lesson updated successfully'
  ));
});

// ✅ Delete lesson
export const deleteLessonController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const lessonWithCourse = await getLessonWithCourseInfo(parseInt(id));
  if (!lessonWithCourse) {
    throw new AppError('Lesson not found', HTTP_STATUS.NOT_FOUND);
  }

  if (user.role !== USER_ROLES.ADMIN && lessonWithCourse.instructor_id !== user.id) {
    throw new AppError('Access denied', HTTP_STATUS.FORBIDDEN);
  }

  await deleteLesson(parseInt(id));

  res.status(HTTP_STATUS.OK).json(successResponse(null, 'Lesson deleted successfully'));
});

// ✅ Reorder lessons
export const reorderLessonsController = asyncHandler(async (req, res) => {
  const { module_id } = req.params;
  const { lessonPositions } = req.body;
  const user = req.user;

  const moduleWithCourse = await getModuleWithCourse(parseInt(module_id));
  if (!moduleWithCourse) {
    throw new AppError('Module not found', HTTP_STATUS.NOT_FOUND);
  }

  if (user.role !== USER_ROLES.ADMIN && moduleWithCourse.instructor_id !== user.id) {
    throw new AppError('Access denied', HTTP_STATUS.FORBIDDEN);
  }

  await reorderLessons(parseInt(module_id), lessonPositions);

  res.status(HTTP_STATUS.OK).json(successResponse(null, 'Lessons reordered successfully'));
});

// ✅ Get lesson stats
export const getLessonStatsController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const lessonWithCourse = await getLessonWithCourseInfo(parseInt(id));
  if (!lessonWithCourse) {
    throw new AppError('Lesson not found', HTTP_STATUS.NOT_FOUND);
  }

  if (user.role !== USER_ROLES.ADMIN && lessonWithCourse.instructor_id !== user.id) {
    throw new AppError('Access denied', HTTP_STATUS.FORBIDDEN);
  }

  const stats = await getLessonStats(parseInt(id));

  res.status(HTTP_STATUS.OK).json(successResponse(
    {
      lessonId: parseInt(id),
      lessonTitle: lessonWithCourse.title,
      moduleTitle: lessonWithCourse.module_title,
      courseTitle: lessonWithCourse.course_title,
      stats
    },
    'Lesson statistics retrieved successfully'
  ));
});

// ✅ Duplicate lesson
export const duplicateLessonController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { targetModuleId } = req.body;
  const user = req.user;

  const lessonWithCourse = await getLessonWithCourseInfo(parseInt(id));
  if (!lessonWithCourse) {
    throw new AppError('Lesson not found', HTTP_STATUS.NOT_FOUND);
  }

  if (user.role !== USER_ROLES.ADMIN && lessonWithCourse.instructor_id !== user.id) {
    throw new AppError('Access denied', HTTP_STATUS.FORBIDDEN);
  }

  const targetModule = await getModuleWithCourse(targetModuleId);
  if (!targetModule) {
    throw new AppError('Target module not found', HTTP_STATUS.NOT_FOUND);
  }

  if (user.role !== USER_ROLES.ADMIN && targetModule.instructor_id !== user.id) {
    throw new AppError('Access denied to target module', HTTP_STATUS.FORBIDDEN);
  }

  const newLessonId = await duplicateLesson(parseInt(id), targetModuleId);
  const newLesson = await getLessonById(newLessonId);

  res.status(HTTP_STATUS.CREATED).json(successResponse(
    newLesson,
    'Lesson duplicated successfully'
  ));
});

// ✅ Toggle publish
export const toggleLessonPublishStatusController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const lessonWithCourse = await getLessonWithCourseInfo(parseInt(id));
  if (!lessonWithCourse) {
    throw new AppError('Lesson not found', HTTP_STATUS.NOT_FOUND);
  }

  if (user.role !== USER_ROLES.ADMIN && lessonWithCourse.instructor_id !== user.id) {
    throw new AppError('Access denied', HTTP_STATUS.FORBIDDEN);
  }

  const updatedLesson = await toggleLessonPublishStatus(parseInt(id));
  const action = updatedLesson.is_published ? 'published' : 'unpublished';

  res.status(HTTP_STATUS.OK).json(successResponse(updatedLesson, `Lesson ${action} successfully`));
});

// ✅ Navigation lessons
export const getCourseLessonsNavigationController = asyncHandler(async (req, res) => {
  const { course_id } = req.params;
  const user = req.user;

  const course = await getCourseById(parseInt(course_id));
  if (!course) {
    throw new AppError(MESSAGES.COURSE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const navigation = await getCourseLessonsNavigation(parseInt(course_id), user.id);

  res.status(HTTP_STATUS.OK).json(successResponse(
    { courseId: parseInt(course_id), courseTitle: course.title, navigation },
    'Course navigation retrieved successfully'
  ));
});

// ✅ Search lessons in course
export const searchLessonsInCourseController = asyncHandler(async (req, res) => {
  const { course_id } = req.params;
  const { q: searchTerm } = req.query;
  const user = req.user;

  if (!searchTerm || searchTerm.trim().length < 2) {
    throw new AppError('Search term must be at least 2 characters', HTTP_STATUS.BAD_REQUEST);
  }

  const course = await getCourseById(parseInt(course_id));
  if (!course) {
    throw new AppError(MESSAGES.COURSE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const lessons = await searchLessonsInCourse(parseInt(course_id), searchTerm.trim());

  res.status(HTTP_STATUS.OK).json(successResponse(
    {
      courseId: parseInt(course_id),
      searchTerm: searchTerm.trim(),
      results: lessons
    },
    `Found ${lessons.length} lessons matching "${searchTerm}"`
  ));
});

// ✅ FINAL EXPORTS - Enhanced with progress tracking
export default {
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
  // 🆕 NEW PROGRESS TRACKING CONTROLLERS
  markLessonCompleteController,
  getLessonProgressController,
  getUserLessonProgressController
};