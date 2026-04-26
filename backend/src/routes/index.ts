import { Router } from 'express';
import * as authController from '../controllers/authController';
import * as courseController from '../controllers/courseController';
import * as postController from '../controllers/postController';
import * as messageController from '../controllers/messageController';
import * as contactController from '../controllers/contactController';
import * as userController from '../controllers/userController';
import { authenticateJWT, authorizeRole } from '../middleware/auth';

const router = Router();

// ===== AUTH =====
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// ===== USER =====
router.get('/users/me', authenticateJWT, userController.getMe);
router.get('/users', authenticateJWT, authorizeRole(['admin']), userController.getAllUsers);
router.put('/users/:id', authenticateJWT, authorizeRole(['admin']), userController.updateUser);
router.delete('/users/:id', authenticateJWT, authorizeRole(['admin']), userController.deleteUser);
router.get('/admin/stats', authenticateJWT, authorizeRole(['admin']), userController.getAdminStats);

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

export default router;
