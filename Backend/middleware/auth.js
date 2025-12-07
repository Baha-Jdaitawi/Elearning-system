import jwt from 'jsonwebtoken';
import { query } from '../database/connection.js';
import { AppError, asyncHandler } from './errorHandler.js';

// Verify JWT token
export const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return next(new AppError('Access denied. No token provided.', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const result = await query(
      'SELECT id, name, email, role, avatar, is_deleted FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return next(new AppError('Token is invalid. User not found.', 401));
    }

    const user = result.rows[0];

    // Check if user is deleted
    if (user.is_deleted) {
      return next(new AppError('User account has been deactivated.', 401));
    }

    // Add user to request
    req.user = user;
    next();

  } catch (error) {
    return next(new AppError('Token is invalid.', 401));
  }
});


export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const result = await query(
        'SELECT id, name, email, role, avatar, is_deleted FROM users WHERE id = $1',
        [decoded.id]
      );

      if (result.rows.length > 0 && !result.rows[0].is_deleted) {
        req.user = result.rows[0];
      }
    } catch (error) {
     
    }
  }

  next();
});


export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Access denied. Authentication required.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(`Access denied. Required role: ${roles.join(' or ')}.`, 403));
    }

    next();
  };
};


export const authorizeOwnerOrAdmin = (userIdField = 'user_id') => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Access denied. Authentication required.', 401));
    }

   
    if (req.user.role === 'admin') {
      return next();
    }

   
    const resourceId = req.params.id || req.body.id;
    const userId = req.user.id;

   
    if (userIdField === 'id' && resourceId && parseInt(resourceId) === userId) {
      return next();
    }

    
    if (req.body[userIdField] && parseInt(req.body[userIdField]) === userId) {
      return next();
    }

    return next(new AppError('Access denied. You can only access your own resources.', 403));
  });
};


export const authorizeInstructor = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Access denied. Authentication required.', 401));
  }


  if (req.user.role === 'admin') {
    return next();
  }

 
  if (req.user.role !== 'instructor') {
    return next(new AppError('Access denied. Instructor role required.', 403));
  }

  
  const courseId = req.params.courseId || req.params.id || req.body.course_id;
  
  if (courseId) {
    const result = await query(
      'SELECT instructor_id FROM courses WHERE id = $1 AND is_deleted = FALSE',
      [courseId]
    );

    if (result.rows.length === 0) {
      return next(new AppError('Course not found.', 404));
    }

    if (result.rows[0].instructor_id !== req.user.id) {
      return next(new AppError('Access denied. You are not the instructor of this course.', 403));
    }
  }

  next();
});


export const authorizeEnrolledStudent = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Access denied. Authentication required.', 401));
  }


  if (req.user.role === 'admin' || req.user.role === 'instructor') {
    return next();
  }

  const courseId = req.params.courseId || req.params.id;
  const userId = req.user.id;

  if (!courseId) {
    return next(new AppError('Course ID is required.', 400));
  }

  // Check enrollment
  const result = await query(
    'SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2',
    [userId, courseId]
  );

  if (result.rows.length === 0) {
    return next(new AppError('Access denied. You are not enrolled in this course.', 403));
  }

  next();
});


export const authorizeEnrolledStudentForLesson = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Access denied. Authentication required.', 401));
  }

  // Admin and instructors can access all content
  if (req.user.role === 'admin' || req.user.role === 'instructor') {
    return next();
  }

  const { lesson_id } = req.params;
  const userId = req.user.id;

  if (!lesson_id) {
    return next(new AppError('Lesson ID is required.', 400));
  }

  try {
    
    const result = await query(
      `SELECT e.id, c.title as course_title
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       JOIN modules m ON c.id = m.course_id
       JOIN lessons l ON m.id = l.module_id
       WHERE e.user_id = $1 AND l.id = $2`,
      [userId, lesson_id]
    );

    if (result.rows.length === 0) {
      return next(new AppError('Access denied. You must be enrolled in this course to access quizzes.', 403));
    }

 
    req.courseEnrollment = result.rows[0];
    next();
  } catch (error) {
    console.error('Enrollment check error:', error);
    return next(new AppError('Error checking enrollment status.', 500));
  }
});

// Generate JWT token
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};


export const extractUserId = (req) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (error) {
    return null;
  }
};

export default {
  authenticate,
  optionalAuth,
  authorize,
  authorizeOwnerOrAdmin,
  authorizeInstructor,
  authorizeEnrolledStudent,
  authorizeEnrolledStudentForLesson,
  generateToken,
  extractUserId
};