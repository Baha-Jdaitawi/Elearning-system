// controllers/recommendationController.js - FIXED VERSION
import {
  trackUserInteraction,
  getUserLearningProfile,
  getSmartRecommendationsWithFallback,
  cacheRecommendations,
  getCachedRecommendations
} from '../services/aiRecommendationService.js';

import { query } from '../database/connection.js'; // 🔧 Added missing import
import { successResponse, errorResponse } from '../utils/helpers.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { HTTP_STATUS, USER_ROLES } from '../utils/constants.js';

// Get personalized course recommendations
export const getRecommendationsController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { limit = 5, refresh = false } = req.query;

  let recommendations;

  // Check for cached recommendations first (unless refresh requested)
  if (!refresh) {
    recommendations = await getCachedRecommendations(userId);
  }

  // Generate new recommendations if no cache or refresh requested
  if (!recommendations || recommendations.length === 0 || refresh) {
    recommendations = await getSmartRecommendationsWithFallback(userId, parseInt(limit));
    
    // Cache the new recommendations
    if (recommendations.length > 0) {
      await cacheRecommendations(userId, recommendations);
    }
  }

  res.status(HTTP_STATUS.OK).json(successResponse(
    {
      recommendations,
      total: recommendations.length,
      cached: !refresh && recommendations.length > 0
    },
    'Recommendations retrieved successfully'
  ));
});

// Track user interaction for better recommendations
export const trackInteractionController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { courseId, lessonId, interactionType, metadata } = req.body;

  if (!interactionType) {
    throw new AppError('Interaction type is required', HTTP_STATUS.BAD_REQUEST);
  }

  await trackUserInteraction(userId, {
    courseId: courseId || null,
    lessonId: lessonId || null,
    interactionType,
    metadata: metadata || {}
  });

  res.status(HTTP_STATUS.OK).json(successResponse(
    null,
    'Interaction tracked successfully'
  ));
});

// 🔧 FIXED: Get user's learning profile
export const getLearningProfileController = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const requestingUser = req.user;

  // 🔧 FIX: Allow users to access their own profile
  if (requestingUser.role !== USER_ROLES.ADMIN && requestingUser.id !== parseInt(userId)) {
    throw new AppError('Access denied', HTTP_STATUS.FORBIDDEN);
  }

  const profile = await getUserLearningProfile(parseInt(userId));

  // 🔧 FIX: Return default profile if none exists
  const defaultProfile = {
    name: requestingUser.name,
    email: requestingUser.email,
    role: requestingUser.role,
    completed_courses: 0,
    total_enrollments: 0,
    avg_completion_rate: 0,
    studied_categories: [],
    total_interactions: 0,
    avg_engagement: 0,
    interaction_types: [],
    learning_goals: [],
    preferred_difficulty: 'intermediate',
    time_availability: 5,
    interests: [],
    preferred_topics: [],
    learning_style: 'mixed'
  };

  res.status(HTTP_STATUS.OK).json(successResponse(
    profile || defaultProfile,
    'Learning profile retrieved successfully'
  ));
});

// 🔧 FIXED: Update user preferences
export const updatePreferencesController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const {
    learning_goals,
    preferred_difficulty,
    time_availability,
    interests,
    preferred_topics,
    learning_style
  } = req.body;

  // 🔧 FIX: Use query function properly
  await query(`
    INSERT INTO user_preferences 
    (user_id, learning_goals, preferred_difficulty, time_availability, interests, preferred_topics, learning_style, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id) 
    DO UPDATE SET
      learning_goals = EXCLUDED.learning_goals,
      preferred_difficulty = EXCLUDED.preferred_difficulty,
      time_availability = EXCLUDED.time_availability,
      interests = EXCLUDED.interests,
      preferred_topics = EXCLUDED.preferred_topics,
      learning_style = EXCLUDED.learning_style,
      updated_at = CURRENT_TIMESTAMP
  `, [userId, learning_goals, preferred_difficulty, time_availability, interests, preferred_topics, learning_style]);

  res.status(HTTP_STATUS.OK).json(successResponse(
    null,
    'Preferences updated successfully'
  ));
});

export default {
  getRecommendationsController,
  trackInteractionController,
  getLearningProfileController,
  updatePreferencesController
};