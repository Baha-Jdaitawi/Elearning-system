import fs from 'fs';
import path from 'path';
import { 
  getCertificateByUserAndCourse, 
  getCertificateById,
  getUserCertificates 
} from '../models/certificateModel.js';
import { generateCertificate } from '../utils/certificateGenerator.js';
import { getEnrollmentByUserAndCourse } from '../models/enrollmentModel.js';
import { successResponse, errorResponse } from '../utils/helpers.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { HTTP_STATUS, USER_ROLES } from '../utils/constants.js';

// Generate certificate (enhanced)
export const generateCertificateController = asyncHandler(async (req, res) => {
  const { userId, courseId } = req.params;

  const result = await generateCertificate(parseInt(userId), parseInt(courseId));

  res.status(HTTP_STATUS.OK).json(successResponse(
    result,
    'Certificate generated successfully'
  ));
});

// Download certificate
export const downloadCertificate = asyncHandler(async (req, res) => {
  const { userId, courseId } = req.params;
  const requestingUser = req.user;

  // Check if user can access this certificate
  if (requestingUser.role === USER_ROLES.STUDENT && requestingUser.id !== parseInt(userId)) {
    return res.status(HTTP_STATUS.FORBIDDEN).json(
      errorResponse('Access denied')
    );
  }

  const certificate = await getCertificateByUserAndCourse(parseInt(userId), parseInt(courseId));
  
  if (!certificate) {
    return res.status(HTTP_STATUS.NOT_FOUND).json(
      errorResponse('Certificate not found')
    );
  }

  if (!certificate.file_path) {
    // Generate certificate if file doesn't exist
    const result = await generateCertificate(parseInt(userId), parseInt(courseId));
    const filePath = result.filePath;
    
    return res.download(filePath, `Certificate_${certificate.course_title.replace(/\s+/g, '_')}.pdf`);
  }

  const filePath = path.join(process.cwd(), certificate.file_path);
  
  if (!fs.existsSync(filePath)) {
    // Regenerate if file is missing
    const result = await generateCertificate(parseInt(userId), parseInt(courseId));
    return res.download(result.filePath, `Certificate_${certificate.course_title.replace(/\s+/g, '_')}.pdf`);
  }

  res.download(filePath, `Certificate_${certificate.course_title.replace(/\s+/g, '_')}.pdf`);
});

// Get certificate details
export const getCertificateDetails = asyncHandler(async (req, res) => {
  const { certificateId } = req.params;
  
  const certificate = await getCertificateById(parseInt(certificateId));
  
  if (!certificate) {
    return res.status(HTTP_STATUS.NOT_FOUND).json(
      errorResponse('Certificate not found')
    );
  }

  res.status(HTTP_STATUS.OK).json(successResponse(
    certificate,
    'Certificate details retrieved successfully'
  ));
});

// Get user's certificates
export const getUserCertificatesController = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const requestingUser = req.user;

  // Check if user can access these certificates
  if (requestingUser.role === USER_ROLES.STUDENT && requestingUser.id !== parseInt(userId)) {
    return res.status(HTTP_STATUS.FORBIDDEN).json(
      errorResponse('Access denied')
    );
  }

  const certificates = await getUserCertificates(parseInt(userId));

  res.status(HTTP_STATUS.OK).json(successResponse(
    certificates,
    'User certificates retrieved successfully'
  ));
});

// Check if certificate exists for course
export const checkCertificateExists = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  const certificate = await getCertificateByUserAndCourse(userId, parseInt(courseId));
  
  res.status(HTTP_STATUS.OK).json(successResponse(
    {
      exists: !!certificate,
      certificate: certificate || null
    },
    'Certificate status checked successfully'
  ));
});

// Get my certificates (for logged in user)
export const getMyCertificates = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const certificates = await getUserCertificates(userId);

  res.status(HTTP_STATUS.OK).json(successResponse(
    certificates,
    'Your certificates retrieved successfully'
  ));
});

// Verify certificate by certificate ID (public endpoint)
export const verifyCertificate = asyncHandler(async (req, res) => {
  const { certificateId } = req.params;
  
  const certificate = await getCertificateById(parseInt(certificateId));
  
  if (!certificate) {
    return res.status(HTTP_STATUS.NOT_FOUND).json(
      errorResponse('Certificate not found or invalid')
    );
  }

  // Return limited public info for verification
  res.status(HTTP_STATUS.OK).json(successResponse(
    {
      valid: true,
      student_name: certificate.student_name,
      course_title: certificate.course_title,
      instructor_name: certificate.instructor_name,
      issued_at: certificate.issued_at,
      certificate_id: certificate.certificate_id
    },
    'Certificate verified successfully'
  ));
});

export default {
  generateCertificateController,
  downloadCertificate,
  getCertificateDetails,
  getUserCertificatesController,
  checkCertificateExists,
  getMyCertificates,
  verifyCertificate
};
