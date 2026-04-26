import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Course, { CourseUnit, Class } from './Course';
import { Faculty, Department, Program } from './Academic';
import { FeeStructure, Invoice, Payment } from './Finance';
import Post from './Post';
import File from './File';
import CourseModule from './CourseModule';
import Contact from './Contact';

// ===== 1. AUTH & ROLES =====
export class Role extends Model { public id!: string; public name!: string; }
Role.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false }
}, { sequelize, modelName: 'Role', tableName: 'roles', underscored: true });

export class Permission extends Model { public id!: string; public name!: string; }
Permission.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false }
}, { sequelize, modelName: 'Permission', tableName: 'permissions', underscored: true });

// Role-Permission Join Table
export class RolePermission extends Model {}
RolePermission.init({}, { sequelize, modelName: 'RolePermission', tableName: 'role_permissions', underscored: true });

// ===== 2. STUDENT MANAGEMENT =====
export class Student extends Model {
  public id!: string;
  public user_id!: string;
  public admission_number!: string;
  public status!: 'active' | 'graduated' | 'suspended';
  public enrollment_date!: Date;
}
Student.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  admission_number: { type: DataTypes.STRING, unique: true, allowNull: false },
  date_of_birth: { type: DataTypes.DATEONLY },
  gender: { type: DataTypes.STRING },
  nationality: { type: DataTypes.STRING },
  enrollment_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  status: { type: DataTypes.ENUM('active', 'graduated', 'suspended'), defaultValue: 'active' },
}, { sequelize, modelName: 'Student', tableName: 'students', underscored: true });

export class StudentDocument extends Model {}
StudentDocument.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  document_type: { type: DataTypes.STRING },
  file_url: { type: DataTypes.STRING },
}, { sequelize, modelName: 'StudentDocument', tableName: 'student_documents', underscored: true });

// ===== 3. STAFF =====
export class Staff extends Model {
  public id!: string;
  public user_id!: string;
  public staff_number!: string;
}
Staff.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  staff_number: { type: DataTypes.STRING, unique: true, allowNull: false },
  position: { type: DataTypes.STRING },
  hire_date: { type: DataTypes.DATEONLY },
}, { sequelize, modelName: 'Staff', tableName: 'staff', underscored: true });

// ===== 4. ENROLLMENT & REGISTRATION =====
export class Enrollment extends Model {
  public id!: string;
  public student_id!: string;
  public program_id!: string;
  public status!: string;
}
Enrollment.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  academic_year: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'enrolled' },
}, { sequelize, modelName: 'Enrollment', tableName: 'enrollments', underscored: true });

export class CourseRegistration extends Model {}
CourseRegistration.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  registration_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { sequelize, modelName: 'CourseRegistration', tableName: 'course_registrations', underscored: true });

// ===== 5. GRADING =====
export class Assessment extends Model {}
Assessment.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  type: { type: DataTypes.ENUM('CAT', 'Exam', 'Assignment'), allowNull: false },
  total_marks: { type: DataTypes.INTEGER, defaultValue: 100 },
}, { sequelize, modelName: 'Assessment', tableName: 'assessments', underscored: true });

export class Grade extends Model {}
Grade.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  score: { type: DataTypes.DECIMAL(5, 2) },
  grade: { type: DataTypes.STRING(2) },
  remarks: { type: DataTypes.TEXT },
}, { sequelize, modelName: 'Grade', tableName: 'grades', underscored: true });

// ===== 6. ATTENDANCE =====
export class Attendance extends Model {}
Attendance.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  status: { type: DataTypes.ENUM('present', 'absent', 'late'), defaultValue: 'present' },
}, { sequelize, modelName: 'Attendance', tableName: 'attendance', underscored: true });

// ===== 7. ONLINE LEARNING (LMS) =====
export class OnlineCourse extends Model { public id!: string; public is_active!: boolean; }
OnlineCourse.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  platform_link: { type: DataTypes.STRING },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { sequelize, modelName: 'OnlineCourse', tableName: 'online_courses', underscored: true });

export class Lesson extends Model {}
Lesson.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  video_url: { type: DataTypes.STRING },
  content: { type: DataTypes.TEXT },
}, { sequelize, modelName: 'Lesson', tableName: 'lessons', underscored: true });

export class LessonProgress extends Model {}
LessonProgress.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { sequelize, modelName: 'LessonProgress', tableName: 'lesson_progress', underscored: true });

// ===== 8. NOTIFICATIONS & LOGS =====
export class Notification extends Model {}
Notification.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  read_status: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { sequelize, modelName: 'Notification', tableName: 'notifications', underscored: true, timestamps: true });

export class ActivityLog extends Model {}
ActivityLog.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  action: { type: DataTypes.STRING },
  entity: { type: DataTypes.STRING },
  entity_id: { type: DataTypes.STRING },
}, { sequelize, modelName: 'ActivityLog', tableName: 'activity_logs', underscored: true, timestamps: true });

// ============ ASSOCIATIONS ============

// Auth
User.belongsTo(Role, { foreignKey: 'role_id' });
Role.hasMany(User, { foreignKey: 'role_id' });
Role.belongsToMany(Permission, { through: RolePermission });
Permission.belongsToMany(Role, { through: RolePermission });

// Profiles
User.hasOne(Student, { foreignKey: 'user_id', as: 'StudentProfile' });
Student.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Staff, { foreignKey: 'user_id', as: 'StaffProfile' });
Staff.belongsTo(User, { foreignKey: 'user_id' });

// Academic Hierarchy
Faculty.hasMany(Department, { foreignKey: 'faculty_id' });
Department.belongsTo(Faculty, { foreignKey: 'faculty_id' });
Department.hasMany(Program, { foreignKey: 'department_id' });
Program.belongsTo(Department, { foreignKey: 'department_id' });
Program.hasMany(Course, { foreignKey: 'program_id' });
Course.belongsTo(Program, { foreignKey: 'program_id' });
Course.hasMany(CourseUnit, { foreignKey: 'course_id' });
CourseUnit.belongsTo(Course, { foreignKey: 'course_id' });
CourseUnit.hasMany(Class, { foreignKey: 'course_unit_id' });
Class.belongsTo(CourseUnit, { foreignKey: 'course_unit_id' });
Staff.hasMany(Class, { foreignKey: 'lecturer_id' });
Class.belongsTo(Staff, { foreignKey: 'lecturer_id' });

// Enrollment
Student.hasMany(Enrollment, { foreignKey: 'student_id' });
Enrollment.belongsTo(Student, { foreignKey: 'student_id' });
Program.hasMany(Enrollment, { foreignKey: 'program_id' });
Enrollment.belongsTo(Program, { foreignKey: 'program_id' });
Student.hasMany(CourseRegistration, { foreignKey: 'student_id' });
CourseRegistration.belongsTo(Student, { foreignKey: 'student_id' });
Class.hasMany(CourseRegistration, { foreignKey: 'class_id' });
CourseRegistration.belongsTo(Class, { foreignKey: 'class_id' });

// Grading & Attendance
Class.hasMany(Assessment, { foreignKey: 'class_id' });
Assessment.belongsTo(Class, { foreignKey: 'class_id' });
Student.hasMany(Grade, { foreignKey: 'student_id' });
Grade.belongsTo(Student, { foreignKey: 'student_id' });
Assessment.hasMany(Grade, { foreignKey: 'assessment_id' });
Grade.belongsTo(Assessment, { foreignKey: 'assessment_id' });
Class.hasMany(Attendance, { foreignKey: 'class_id' });
Attendance.belongsTo(Class, { foreignKey: 'class_id' });
Student.hasMany(Attendance, { foreignKey: 'student_id' });
Attendance.belongsTo(Student, { foreignKey: 'student_id' });

// Finance
Program.hasMany(FeeStructure, { foreignKey: 'program_id' });
FeeStructure.belongsTo(Program, { foreignKey: 'program_id' });
Student.hasMany(Invoice, { foreignKey: 'student_id' });
Invoice.belongsTo(Student, { foreignKey: 'student_id' });
Invoice.hasMany(Payment, { foreignKey: 'invoice_id' });
Payment.belongsTo(Invoice, { foreignKey: 'invoice_id' });
Student.hasMany(Payment, { foreignKey: 'student_id' });
Payment.belongsTo(Student, { foreignKey: 'student_id' });

// LMS
Course.hasOne(OnlineCourse, { foreignKey: 'course_id' });
OnlineCourse.belongsTo(Course, { foreignKey: 'course_id' });
OnlineCourse.hasMany(Lesson, { foreignKey: 'online_course_id' });
Lesson.belongsTo(OnlineCourse, { foreignKey: 'online_course_id' });
Student.hasMany(LessonProgress, { foreignKey: 'student_id' });
LessonProgress.belongsTo(Student, { foreignKey: 'student_id' });
Lesson.hasMany(LessonProgress, { foreignKey: 'lesson_id' });
LessonProgress.belongsTo(Lesson, { foreignKey: 'lesson_id' });

// Support & System
User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(ActivityLog, { foreignKey: 'user_id' });
ActivityLog.belongsTo(User, { foreignKey: 'user_id' });

export { User, Course, CourseModule, Contact, Faculty, Department, Program, CourseUnit, Class, FeeStructure, Invoice, Payment, Post, File };
export default sequelize;
