import { query } from '../database/connection.js';

// Create certificate record in database
export const createCertificate = async (userId, courseId, certificateData = {}) => {
  const result = await query(
    `INSERT INTO certificates (user_id, course_id, certificate_id, issued_at, file_path, final_grade)
     VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5)
     RETURNING *`,
    [
      userId, 
      courseId, 
      certificateData.certificateId || `CERT-${Date.now()}-${userId}-${courseId}`,
      certificateData.filePath || null,
      certificateData.finalGrade || null
    ]
  );
  return result.rows[0];
};

// Get certificate by user and course
export const getCertificateByUserAndCourse = async (userId, courseId) => {
  const result = await query(
    `SELECT c.*, u.name as student_name, u.email as student_email,
            co.title as course_title, co.description as course_description,
            i.name as instructor_name
     FROM certificates c
     JOIN users u ON c.user_id = u.id
     JOIN courses co ON c.course_id = co.id
     JOIN users i ON co.instructor_id = i.id
     WHERE c.user_id = $1 AND c.course_id = $2`,
    [userId, courseId]
  );
  return result.rows[0] || null;
};

// Get certificate by ID
export const getCertificateById = async (certificateId) => {
  const result = await query(
    `SELECT c.*, u.name as student_name, u.email as student_email,
            co.title as course_title, co.description as course_description,
            i.name as instructor_name
     FROM certificates c
     JOIN users u ON c.user_id = u.id
     JOIN courses co ON c.course_id = co.id
     JOIN users i ON co.instructor_id = i.id
     WHERE c.id = $1`,
    [certificateId]
  );
  return result.rows[0] || null;
};

// Get user's certificates
export const getUserCertificates = async (userId) => {
  const result = await query(
    `SELECT c.*, co.title as course_title, co.thumbnail as course_thumbnail,
            i.name as instructor_name
     FROM certificates c
     JOIN courses co ON c.course_id = co.id
     JOIN users i ON co.instructor_id = i.id
     WHERE c.user_id = $1
     ORDER BY c.issued_at DESC`,
    [userId]
  );
  return result.rows;
};

// Update certificate file path
export const updateCertificateFilePath = async (userId, courseId, filePath) => {
  const result = await query(
    `UPDATE certificates 
     SET file_path = $1, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $2 AND course_id = $3
     RETURNING *`,
    [filePath, userId, courseId]
  );
  return result.rows[0] || null;
};

// Check if certificate exists
export const certificateExists = async (userId, courseId) => {
  const result = await query(
    'SELECT id FROM certificates WHERE user_id = $1 AND course_id = $2',
    [userId, courseId]
  );
  return result.rows.length > 0;
};

export default {
  createCertificate,
  getCertificateByUserAndCourse,
  getCertificateById,
  getUserCertificates,
  updateCertificateFilePath,
  certificateExists
};