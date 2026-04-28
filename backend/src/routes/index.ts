import { Router } from 'express';
import * as authController from '../controllers/authController';
import * as courseController from '../controllers/courseController';
import * as postController from '../controllers/postController';
import * as messageController from '../controllers/messageController';
import * as contactController from '../controllers/contactController';
import * as userController from '../controllers/userController';
import * as financeController from '../controllers/financeController';
import * as academicController from '../controllers/academicController';
import * as workshopController from '../controllers/workshopController';
import * as paymentController from '../controllers/paymentController';
import * as lecturerController from '../controllers/lecturerController';
import * as systemController from '../controllers/systemController';
import { authenticateJWT, authorizeRole } from '../middleware/auth';

const router = Router();

// ===== AUTH =====
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// ===== USER =====
router.get('/users/me', authenticateJWT, userController.getMe);
router.put('/users/profile', authenticateJWT, userController.updateProfile);
router.get('/users', authenticateJWT, authorizeRole(['admin']), userController.getAllUsers);
router.put('/users/:id', authenticateJWT, authorizeRole(['admin']), userController.updateUser);
router.delete('/users/:id', authenticateJWT, authorizeRole(['admin']), userController.deleteUser);
router.get('/admin/stats', authenticateJWT, authorizeRole(['admin']), userController.getAdminStats);
router.get('/admin/admissions', authenticateJWT, authorizeRole(['admin']), courseController.getAdmissions);
router.put('/admin/admissions/:id', authenticateJWT, authorizeRole(['admin']), courseController.updateEnrollmentStatus);

// ===== COURSES =====
router.get('/courses', courseController.getCourses);
router.get('/courses/:id', courseController.getCourseById);
router.post('/courses', authenticateJWT, authorizeRole(['admin']), courseController.createCourse);
router.put('/courses/:id', authenticateJWT, authorizeRole(['admin']), courseController.updateCourse);
router.delete('/courses/:id', authenticateJWT, authorizeRole(['admin']), courseController.deleteCourse);
router.post('/courses/:id/modules', authenticateJWT, authorizeRole(['admin', 'lecturer']), courseController.addModule);
router.post('/courses/:id/enroll', authenticateJWT, courseController.enrollInCourse);
router.get('/enrollments/my', authenticateJWT, courseController.getMyEnrollments);

// ===== BLOG =====
router.get('/posts', postController.getPosts);
router.get('/posts/:id', postController.getPostById);
router.post('/posts', authenticateJWT, authorizeRole(['admin', 'lecturer']), postController.createPost);
router.put('/posts/:id', authenticateJWT, authorizeRole(['admin', 'lecturer']), postController.updatePost);
router.delete('/posts/:id', authenticateJWT, authorizeRole(['admin']), postController.deletePost);

// ===== MESSAGES =====
router.get('/messages', authenticateJWT, messageController.getMessages);
router.post('/messages', authenticateJWT, messageController.sendMessage);

// ===== CONTACTS =====
router.post('/contacts', contactController.submitContact);
router.get('/contacts', authenticateJWT, authorizeRole(['admin']), contactController.getContacts);
router.put('/contacts/:id', authenticateJWT, authorizeRole(['admin']), contactController.updateContactStatus);
router.delete('/contacts/:id', authenticateJWT, authorizeRole(['admin']), contactController.deleteContact);

// ===== FINANCE =====
router.get('/finance/my-invoices', authenticateJWT, financeController.getMyInvoices);
router.get('/finance/invoices/:id', authenticateJWT, financeController.getInvoiceById);
router.put('/finance/mock-pay/:id', authenticateJWT, financeController.mockPayInvoice);

// ===== RESOURCES =====
router.get('/resources/my', authenticateJWT, courseController.getMyResources);

// ===== ACADEMIC HIERARCHY =====
router.get('/academic/faculties', authenticateJWT, academicController.getFaculties);
router.post('/academic/faculties', authenticateJWT, authorizeRole(['admin']), academicController.createFaculty);
router.put('/academic/faculties/:id', authenticateJWT, authorizeRole(['admin']), academicController.updateFaculty);
router.delete('/academic/faculties/:id', authenticateJWT, authorizeRole(['admin']), academicController.deleteFaculty);

router.post('/academic/departments', authenticateJWT, authorizeRole(['admin']), academicController.createDepartment);
router.delete('/academic/departments/:id', authenticateJWT, authorizeRole(['admin']), academicController.deleteDepartment);

router.post('/academic/programs', authenticateJWT, authorizeRole(['admin']), academicController.createProgram);
router.get('/academic/my-grades', authenticateJWT, academicController.getMyGrades);
router.get('/academic/transcript', authenticateJWT, academicController.generateTranscript);
router.get('/academic/students/:studentId/grades', authenticateJWT, authorizeRole(['admin']), academicController.getStudentGrades);
router.post('/academic/grades', authenticateJWT, authorizeRole(['admin', 'lecturer']), academicController.upsertGrade);
router.get('/academic/structure', authenticateJWT, authorizeRole(['admin']), academicController.getFullAcademicStructure);
router.get('/academic/classes/:classId/assessments', authenticateJWT, authorizeRole(['admin']), academicController.getAssessmentsByClass);
router.post('/academic/assessments', authenticateJWT, authorizeRole(['admin', 'lecturer']), academicController.createAssessment);

// Workshops
router.get('/workshops', workshopController.getWorkshops);
router.post('/workshops', authenticateJWT, authorizeRole(['admin']), workshopController.createWorkshop);
router.put('/workshops/:id', authenticateJWT, authorizeRole(['admin']), workshopController.updateWorkshop);
router.delete('/workshops/:id', authenticateJWT, authorizeRole(['admin']), workshopController.deleteWorkshop);

// ===== PAYMENTS =====
router.get('/payments/settings', authenticateJWT, authorizeRole(['admin']), paymentController.getGatewaySettings);
router.post('/payments/settings', authenticateJWT, authorizeRole(['admin']), paymentController.updateGatewaySetting);
router.post('/payments/initiate', authenticateJWT, paymentController.initiatePayment);
// Public callback
router.post('/payments/callback/:gateway', paymentController.handleCallback);

// ===== LECTURER PORTAL =====
router.get('/lecturer/dashboard', authenticateJWT, authorizeRole(['lecturer', 'admin']), lecturerController.getLecturerDashboard);
router.get('/lecturer/classes', authenticateJWT, authorizeRole(['lecturer', 'admin']), lecturerController.getLecturerClasses);
router.get('/lecturer/classes/:classId/students', authenticateJWT, authorizeRole(['lecturer', 'admin']), lecturerController.getClassStudents);
router.post('/lecturer/attendance', authenticateJWT, authorizeRole(['lecturer', 'admin']), lecturerController.markAttendance);

// ===== SYSTEM SETTINGS =====
router.get('/system/settings', systemController.getSettings);
router.put('/system/settings', authenticateJWT, authorizeRole(['admin']), systemController.updateSettings);

export default router;
