// services/aiRecommendationService.js - FIXED VERSION
import { query } from '../database/connection.js';

// Track user interactions for recommendation engine
export const trackUserInteraction = async (userId, interactionData) => {
  const {
    courseId = null,
    lessonId = null,
    interactionType,
    metadata = {}
  } = interactionData;

  // Assign interaction scores
  const interactionScores = {
    'view': 1,
    'search': 1,
    'enroll': 3,
    'start_lesson': 2,
    'complete_lesson': 4,
    'complete_course': 5,
    'rate': 3
  };

  const score = interactionScores[interactionType] || 1;

  await query(
    `INSERT INTO user_interactions 
     (user_id, course_id, lesson_id, interaction_type, metadata, interaction_score)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [userId, courseId, lessonId, interactionType, JSON.stringify(metadata), score]
  );
};

// Get user's learning profile for recommendations
export const getUserLearningProfile = async (userId) => {
  const result = await query(`
    WITH user_stats AS (
      SELECT 
        COUNT(DISTINCT CASE WHEN e.completed = true THEN e.course_id END) as completed_courses,
        COUNT(DISTINCT e.course_id) as total_enrollments,
        AVG(CASE WHEN e.completed = true THEN e.progress END) as avg_completion_rate,
        ARRAY_AGG(DISTINCT c.category_id) FILTER (WHERE c.category_id IS NOT NULL) as studied_categories
      FROM enrollments e
      LEFT JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = $1
    ),
    interaction_stats AS (
      SELECT 
        COUNT(*) as total_interactions,
        AVG(interaction_score) as avg_engagement,
        ARRAY_AGG(DISTINCT interaction_type) as interaction_types
      FROM user_interactions 
      WHERE user_id = $1 AND created_at > NOW() - INTERVAL '30 days'
    ),
    preferences AS (
      SELECT 
        learning_goals,
        preferred_difficulty,
        time_availability,
        interests,
        preferred_topics,
        learning_style
      FROM user_preferences 
      WHERE user_id = $1
    )
    SELECT 
      us.*,
      ins.*,
      p.*,
      u.name,
      u.email,
      u.role
    FROM user_stats us
    CROSS JOIN interaction_stats ins
    LEFT JOIN preferences p ON true
    JOIN users u ON u.id = $1
  `, [userId]);

  return result.rows[0] || null;
};

// 🔧 FIXED: Simple rule-based recommendations (corrected column names)
export const generateSmartRecommendations = async (userId, limit = 5) => {
  const profile = await getUserLearningProfile(userId);
  
  if (!profile) {
    return [];
  }

  // Get recommendations based on multiple factors
  const recommendations = await query(`
    WITH user_categories AS (
      SELECT UNNEST($2::integer[]) as category_id
    ),
    similar_users AS (
      SELECT DISTINCT e2.course_id, COUNT(*) as similarity_score
      FROM enrollments e1
      JOIN enrollments e2 ON e1.course_id = e2.course_id AND e2.user_id != $1
      WHERE e1.user_id = $1 AND e1.completed = true
      GROUP BY e2.course_id
      ORDER BY similarity_score DESC
      LIMIT 10
    ),
    category_based AS (
      SELECT c.id as course_id, 3 as recommendation_score, 'category_match' as reason
      FROM courses c
      JOIN user_categories uc ON c.category_id = uc.category_id
      WHERE c.is_published = true 
        AND c.id NOT IN (SELECT course_id FROM enrollments WHERE user_id = $1)
    ),
    trending_courses AS (
      SELECT 
        c.id as course_id, 
        2 as recommendation_score, 
        'trending' as reason
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id AND e.enrolled_at > NOW() - INTERVAL '30 days'
      WHERE c.is_published = true 
        AND c.id NOT IN (SELECT course_id FROM enrollments WHERE user_id = $1)
      GROUP BY c.id
      ORDER BY COUNT(e.id) DESC
      LIMIT 10
    ),
    similar_user_courses AS (
      SELECT 
        su.course_id,
        1 as recommendation_score,
        'similar_users' as reason
      FROM similar_users su
      WHERE su.course_id NOT IN (SELECT course_id FROM enrollments WHERE user_id = $1)
    )
    SELECT DISTINCT
      c.*,
      cat.name as category_name,
      u.name as instructor_name,
      COALESCE(cb.recommendation_score, tc.recommendation_score, suc.recommendation_score, 1) as score,
      COALESCE(cb.reason, tc.reason, suc.reason, 'general') as recommendation_reason,
      (
        SELECT COUNT(*) 
        FROM enrollments e 
        WHERE e.course_id = c.id
      ) as enrollment_count
    FROM courses c
    LEFT JOIN categories cat ON c.category_id = cat.id
    LEFT JOIN users u ON c.instructor_id = u.id
    LEFT JOIN category_based cb ON c.id = cb.course_id
    LEFT JOIN trending_courses tc ON c.id = tc.course_id
    LEFT JOIN similar_user_courses suc ON c.id = suc.course_id
    WHERE c.is_published = true 
      AND c.id NOT IN (SELECT course_id FROM enrollments WHERE user_id = $1)
      AND (cb.course_id IS NOT NULL OR tc.course_id IS NOT NULL OR suc.course_id IS NOT NULL)
    ORDER BY score DESC, enrollment_count DESC
    LIMIT $3
  `, [userId, profile.studied_categories || [], limit]);

  return recommendations.rows;
};

// 🔧 FIXED: Fallback recommendations when no user-specific data exists
export const getFallbackRecommendations = async (userId, limit = 5) => {
  const recommendations = await query(`
    SELECT DISTINCT
      c.*,
      cat.name as category_name,
      u.name as instructor_name,
      1 as score,
      'general' as recommendation_reason,
      (
        SELECT COUNT(*) 
        FROM enrollments e 
        WHERE e.course_id = c.id
      ) as enrollment_count
    FROM courses c
    LEFT JOIN categories cat ON c.category_id = cat.id
    LEFT JOIN users u ON c.instructor_id = u.id
    WHERE c.is_published = true 
      AND c.id NOT IN (SELECT COALESCE(course_id, 0) FROM enrollments WHERE user_id = $1)
    ORDER BY enrollment_count DESC, c.created_at DESC
    LIMIT $2
  `, [userId, limit]);

  return recommendations.rows;
};

// 🔧 ENHANCED: Smart recommendations with fallback
export const getSmartRecommendationsWithFallback = async (userId, limit = 5) => {
  try {
    // Try to get personalized recommendations first
    let recommendations = await generateSmartRecommendations(userId, limit);
    
    // If no personalized recommendations, get popular courses
    if (recommendations.length === 0) {
      recommendations = await getFallbackRecommendations(userId, limit);
    }
    
    return recommendations;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    // Return fallback recommendations on any error
    return await getFallbackRecommendations(userId, limit);
  }
};

// Cache recommendations
export const cacheRecommendations = async (userId, recommendations) => {
  try {
    // Clear old recommendations
    await query(
      'DELETE FROM course_recommendations WHERE user_id = $1 OR expires_at < NOW()',
      [userId]
    );

    // Insert new recommendations
    for (const rec of recommendations) {
      await query(`
        INSERT INTO course_recommendations 
        (user_id, recommended_course_id, recommendation_type, confidence_score, reason)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING
      `, [
        userId,
        rec.id,
        rec.recommendation_reason,
        Math.min(rec.score / 5, 1.0), // Normalize to 0-1
        `Recommended because: ${rec.recommendation_reason}`
      ]);
    }
  } catch (error) {
    console.error('Error caching recommendations:', error);
    // Don't throw error, just log it
  }
};

// Get cached recommendations
export const getCachedRecommendations = async (userId) => {
  try {
    const result = await query(`
      SELECT 
        cr.*,
        c.*,
        cat.name as category_name,
        u.name as instructor_name
      FROM course_recommendations cr
      JOIN courses c ON cr.recommended_course_id = c.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE cr.user_id = $1 AND cr.expires_at > NOW()
      ORDER BY cr.confidence_score DESC, cr.created_at DESC
    `, [userId]);

    return result.rows;
  } catch (error) {
    console.error('Error getting cached recommendations:', error);
    return [];
  }
};

export default {
  trackUserInteraction,
  getUserLearningProfile,
  generateSmartRecommendations,
  getSmartRecommendationsWithFallback,
  cacheRecommendations,
  getCachedRecommendations
};