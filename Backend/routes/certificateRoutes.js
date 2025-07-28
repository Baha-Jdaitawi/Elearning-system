import express from 'express';
import {
  generateCertificateController,
  downloadCertificate,
  getCertificateDetails,
  getUserCertificatesController,
  checkCertificateExists,
  getMyCertificates,
  verifyCertificate
} from '../controllers/certificateController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { param } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation.js';
import { USER_ROLES } from '../utils/constants.js';

const router = express.Router();

// Public verification endpoint (no auth required)
router.get('/verify/:certificateId',
  [
    param('certificateId').isInt({ min: 1 }).withMessage('Valid certificate ID is required'),
    handleValidationErrors
  ],
  verifyCertificate
);

// All other routes require authentication
router.use(authenticate);

// Generate certificate (manual trigger by admin/instructor)
router.post('/generate/:userId/:courseId', 
  authorize(USER_ROLES.ADMIN, USER_ROLES.INSTRUCTOR),
  [
    param('userId').isInt({ min: 1 }).withMessage('Valid user ID is required'),
    param('courseId').isInt({ min: 1 }).withMessage('Valid course ID is required'),
    handleValidationErrors
  ],
  generateCertificateController
);

// Download certificate
router.get('/download/:userId/:courseId',
  [
    param('userId').isInt({ min: 1 }).withMessage('Valid user ID is required'),
    param('courseId').isInt({ min: 1 }).withMessage('Valid course ID is required'),
    handleValidationErrors
  ],
  downloadCertificate
);

// Get certificate by ID (authenticated)
router.get('/:certificateId',
  [
    param('certificateId').isInt({ min: 1 }).withMessage('Valid certificate ID is required'),
    handleValidationErrors
  ],
  getCertificateDetails
);

// Get my certificates (for logged in user)
router.get('/my/certificates', getMyCertificates);

// Get user's certificates (admin/instructor can view any user's certificates)
router.get('/user/:userId',
  [
    param('userId').isInt({ min: 1 }).withMessage('Valid user ID is required'),
    handleValidationErrors
  ],
  getUserCertificatesController
);

// Check if certificate exists for course (student)
router.get('/course/:courseId/check',
  [
    param('courseId').isInt({ min: 1 }).withMessage('Valid course ID is required'),
    handleValidationErrors
  ],
  checkCertificateExists
);

// Get certificate for specific course (if exists)
router.get('/course/:courseId/user/:userId',
  [
    param('courseId').isInt({ min: 1 }).withMessage('Valid course ID is required'),
    param('userId').isInt({ min: 1 }).withMessage('Valid user ID is required'),
    handleValidationErrors
  ],
  getCertificateDetails
);

export default router;
