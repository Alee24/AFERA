import { Request, Response } from 'express';
import { Course, CourseModule, Enrollment, Student, User, Program } from '../models';

// GET /api/courses
export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.findAll({
      include: [
        { model: CourseModule, as: 'Modules', attributes: ['id', 'title_en', 'title_fr', 'title_pt', 'order', 'duration_weeks'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(courses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/courses/:id
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const course = await Course.findByPk(req.params.id as string, {
      include: [
        { model: CourseModule, as: 'Modules', order: [['order', 'ASC']] as any },
        { model: Enrollment, as: 'Enrollments', attributes: ['id', 'status'] }
      ]
    });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/courses
export const createCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/courses/:id
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findByPk(req.params.id as string);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    await course.update(req.body);
    res.json(course);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/courses/:id
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findByPk(req.params.id as string);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    await course.destroy();
    res.json({ message: 'Course deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/courses/:id/modules
export const addModule = async (req: Request, res: Response) => {
  try {
    const course = await Course.findByPk(req.params.id as string);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    const module = await CourseModule.create({ ...req.body, course_id: req.params.id });
    res.status(201).json(module);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// POST /api/courses/:id/enroll
export const enrollInCourse = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.id;

    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Find or create student profile
    let student = await Student.findOne({ where: { user_id: userId } });
    if (!student) {
      // Auto-create student profile
      const user = await User.findByPk(userId);
      const admNum = `ADM-${Date.now()}`;
      student = await Student.create({ user_id: userId, admission_number: admNum });
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({ where: { student_id: student.id, course_id: courseId } });
    if (existing) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({ 
      student_id: student.id, 
      course_id: courseId, 
      status: 'pending_approval' 
    });
    res.status(201).json({ message: 'Successfully enrolled!', enrollment });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/enrollments/my
export const getMyEnrollments = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const student = await Student.findOne({ where: { user_id: userId } });
    if (!student) return res.json([]);

    const enrollments = await Enrollment.findAll({
      where: { student_id: student.id },
      include: [
        { 
          model: Program, 
          include: [{ model: Course }] 
        }
      ]
    });
    res.json(enrollments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/admissions
export const getAdmissions = async (req: Request, res: Response) => {
  try {
    const enrollments = await Enrollment.findAll({
      include: [
        {
          model: Student,
          include: [{ model: User, attributes: ['first_name', 'last_name', 'email', 'phone'] }]
        },
        { model: Program }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(enrollments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/admin/admissions/:id
export const updateEnrollmentStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const enrollment = await Enrollment.findByPk(req.params.id as string);
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    await enrollment.update({ status });
    res.json({ message: `Enrollment ${status} successfully` });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
