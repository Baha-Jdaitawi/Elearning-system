// models/progressModel.js
import { query } from '../database/connection.js';

// Mark lesson as complete for a user
export const markLessonComplete = async (userId, lessonId, timeSpent = 0) => {
  const result = await query(
    `INSERT INTO lesson_progress (user_id, lesson_id, completed, completed_at, time_spent)
     VALUES ($1, $2, true, CURRENT_TIMESTAMP, $3)
     ON CONFLICT (user_id, lesson_id) 
     DO UPDATE SET 
       completed = true,
       completed_at = CURRENT_TIMESTAMP,
       time_spent = GREATEST(lesson_progress.time_spent, $3),
       updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [userId, lessonId, timeSpent]
  );
  return result.rows[0];
};

// Get user's progress for a specific lesson
export const getUserLessonProgress = async (userId, lessonId) => {
  const result = await query(
    `SELECT lp.*, l.title as lesson_title, l.video_duration
     FROM lesson_progress lp
     JOIN lessons l ON lp.lesson_id = l.id
     WHERE lp.user_id = $1 AND lp.lesson_id = $2`,
    [userId, lessonId]
  );
  return result.rows[0] || null;
};

// Get all progress data for a lesson (for instructors)
export const getLessonProgress = async (lessonId) => {
  const result = await query(
    `SELECT lp.*, u.name as student_name, u.email as student_email
     FROM lesson_progress lp
     JOIN users u ON lp.user_id = u.id
     WHERE lp.lesson_id = $1
     ORDER BY lp.completed_at DESC`,
    [lessonId]
  );
  return result.rows;
};

// Calculate course progress for a user
export const calculateCourseProgress = async (userId, courseId) => {
  const result = await query(
    `WITH course_lessons AS (
       SELECT l.id as lesson_id
       FROM lessons l
       JOIN modules m ON l.module_id = m.id
       WHERE m.course_id = $2 AND l.is_published = true
     ),
     completed_lessons AS (
       SELECT cl.lesson_id
       FROM course_lessons cl
       JOIN lesson_progress lp ON cl.lesson_id = lp.lesson_id
       WHERE lp.user_id = $1 AND lp.completed = true
     )
     SELECT 
       (SELECT COUNT(*) FROM course_lessons) as total_lessons,
       (SELECT COUNT(*) FROM completed_lessons) as completed_lessons,
       CASE 
         WHEN (SELECT COUNT(*) FROM course_lessons) = 0 THEN 0
         ELSE ROUND(
           (SELECT COUNT(*) FROM completed_lessons)::numeric / 
           (SELECT COUNT(*) FROM course_lessons)::numeric * 100, 2
         )
       END as percentage`,
    [userId, courseId]
  );
  
  const progressData = result.rows[0];
  const isCompleted = progressData.total_lessons > 0 && 
                     progressData.completed_lessons >= progressData.total_lessons;
  
  return {
    totalLessons: parseInt(progressData.total_lessons),
    completedLessons: parseInt(progressData.completed_lessons),
    percentage: parseFloat(progressData.percentage),
    completed: isCompleted
  };
};

// Update enrollment progress
export const updateEnrollmentProgress = async (userId, courseId, progressData) => {
  const result = await query(
    `UPDATE enrollments 
     SET 
       progress = $3,
       completed = $4,
       completed_at = CASE 
         WHEN $4 = true AND completed = false THEN CURRENT_TIMESTAMP
         WHEN $4 = false THEN NULL
         ELSE completed_at
       END
     WHERE user_id = $1 AND course_id = $2
     RETURNING *`,
    [userId, courseId, progressData.percentage, progressData.completed]
  );
  return result.rows[0];
};

// Get user's progress for all lessons in a course
export const getUserCourseProgress = async (userId, courseId) => {
  const result = await query(
    `SELECT 
       l.id as lesson_id,
       l.title as lesson_title,
       l.position as lesson_position,
       m.title as module_title,
       m.position as module_position,
       lp.completed,
       lp.completed_at,
       lp.time_spent
     FROM lessons l
     JOIN modules m ON l.module_id = m.id
     LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = $1
     WHERE m.course_id = $2 AND l.is_published = true
     ORDER BY m.position, l.position`,
    [userId, courseId]
  );
  return result.rows;
};

// Get course completion statistics (for instructors)
export const getCourseCompletionStats = async (courseId) => {
  const result = await query(
    `WITH course_lessons AS (
       SELECT COUNT(*) as total_lessons
       FROM lessons l
       JOIN modules m ON l.module_id = m.id
       WHERE m.course_id = $1 AND l.is_published = true
     ),
     enrollment_progress AS (
       SELECT 
         e.user_id,
         u.name as student_name,
         u.email as student_email,
         e.progress,
         e.completed,
         e.completed_at,
         e.enrolled_at,
         COUNT(lp.id) as completed_lessons
       FROM enrollments e
       JOIN users u ON e.user_id = u.id
       LEFT JOIN lesson_progress lp ON e.user_id = lp.user_id 
         AND lp.lesson_id IN (
           SELECT l.id FROM lessons l 
           JOIN modules m ON l.module_id = m.id 
           WHERE m.course_id = $1 AND l.is_published = true
         )
         AND lp.completed = true
       WHERE e.course_id = $1
       GROUP BY e.user_id, u.name, u.email, e.progress, e.completed, e.completed_at, e.enrolled_at
     )
     SELECT 
       ep.*,
       cl.total_lessons,
       CASE 
         WHEN cl.total_lessons = 0 THEN 0
         ELSE ROUND(ep.completed_lessons::numeric / cl.total_lessons::numeric * 100, 2)
       END as calculated_progress
     FROM enrollment_progress ep
     CROSS JOIN course_lessons cl
     ORDER BY ep.progress DESC, ep.enrolled_at DESC`,
    [courseId]
  );
  return result.rows;
};

// Get user's overall learning statistics
export const getUserLearningStats = async (userId) => {
  const result = await query(
    `SELECT 
       COUNT(DISTINCT e.course_id) as total_courses_enrolled,
       COUNT(DISTINCT CASE WHEN e.completed = true THEN e.course_id END) as courses_completed,
       COUNT(DISTINCT lp.lesson_id) as total_lessons_completed,
       COALESCE(SUM(lp.time_spent), 0) as total_time_spent,
       COUNT(DISTINCT c.id) as certificates_earned
     FROM enrollments e
     LEFT JOIN lesson_progress lp ON e.user_id = lp.user_id AND lp.completed = true
     LEFT JOIN certificates c ON e.user_id = c.user_id
     WHERE e.user_id = $1`,
    [userId]
  );
  return result.rows[0];
};

// Check if user has completed all prerequisites for a lesson
export const checkLessonPrerequisites = async (userId, lessonId) => {
  // Get all previous lessons in the same course
  const result = await query(
    `WITH lesson_course AS (
       SELECT m.course_id, l.module_id, l.position as lesson_position, m.position as module_position
       FROM lessons l
       JOIN modules m ON l.module_id = m.id
       WHERE l.id = $2
     ),
     prerequisite_lessons AS (
       SELECT l.id as prereq_lesson_id
       FROM lessons l
       JOIN modules m ON l.module_id = m.id
       JOIN lesson_course lc ON m.course_id = lc.course_id
       WHERE l.is_published = true
         AND (
           m.position < lc.module_position 
           OR (m.position = lc.module_position AND l.position < lc.lesson_position)
         )
     ),
     completed_prerequisites AS (
       SELECT COUNT(*) as completed_count
       FROM prerequisite_lessons pl
       JOIN lesson_progress lp ON pl.prereq_lesson_id = lp.lesson_id
       WHERE lp.user_id = $1 AND lp.completed = true
     )
     SELECT 
       (SELECT COUNT(*) FROM prerequisite_lessons) as total_prerequisites,
       cp.completed_count,
       CASE 
         WHEN (SELECT COUNT(*) FROM prerequisite_lessons) = cp.completed_count 
         THEN true 
         ELSE false 
       END as prerequisites_met
     FROM completed_prerequisites cp`,
    [userId, lessonId]
  );
  
  return result.rows[0] || { 
    total_prerequisites: 0, 
    completed_count: 0, 
    prerequisites_met: true 
  };
};

// Reset lesson progress (for testing or admin purposes)
export const resetLessonProgress = async (userId, lessonId) => {
  const result = await query(
    `DELETE FROM lesson_progress 
     WHERE user_id = $1 AND lesson_id = $2
     RETURNING *`,
    [userId, lessonId]
  );
  return result.rows[0];
};

// Get recent learning activity for a user
export const getRecentLearningActivity = async (userId, limit = 10) => {
  const result = await query(
    `SELECT 
       lp.completed_at,
       l.title as lesson_title,
       m.title as module_title,
       c.title as course_title,
       c.id as course_id,
       l.id as lesson_id
     FROM lesson_progress lp
     JOIN lessons l ON lp.lesson_id = l.id
     JOIN modules m ON l.module_id = m.id
     JOIN courses c ON m.course_id = c.id
     WHERE lp.user_id = $1 AND lp.completed = true
     ORDER BY lp.completed_at DESC
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
};

export default {
  markLessonComplete,
  getUserLessonProgress,
  getLessonProgress,
  calculateCourseProgress,
  updateEnrollmentProgress,
  getUserCourseProgress,
  getCourseCompletionStats,
  getUserLearningStats,
  checkLessonPrerequisites,
  resetLessonProgress,
  getRecentLearningActivity
};