import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Student, Staff, Program, Enrollment, Course } from '../models';
import { sendApplicationNotification, sendAccountCreatedNotification, sendRegistrationConfirmationNotification } from '../services/mailService';
import { logToCRM } from '../services/crmService';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, preferred_language, program: programName, professional_profile } = req.body;
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const names = (name || '').split(' ');
    const first_name = names[0] || 'User';
    const last_name = names.slice(1).join(' ') || 'Student';

    const user = await User.create({
      first_name,
      last_name,
      email,
      password_hash,
      role: role || 'student',
      preferred_language: preferred_language || 'en',
    });

    if (role === 'student' || !role) {
      const admission_number = 'AFR' + Math.floor(100000 + Math.random() * 900000);
      const student = await Student.create({
        user_id: user.id,
        admission_number,
        professional_profile: professional_profile || 'external',
        status: 'pending'
      });

      // Find the course (representing the program/training) and create an enrollment
      const course = await Course.findOne({ where: { title_en: programName } });
      if (course) {
        await Enrollment.create({
          student_id: student.id,
          course_id: course.id,
          program_id: course.program_id || null,
          status: 'pending_approval',
          academic_year: '2026'
        });
      } else {
        // Fallback to checking the Program table for backward compatibility
        const program = await Program.findOne({ where: { name: programName } });
        if (program) {
          await Enrollment.create({
            student_id: student.id,
            program_id: program.id,
            status: 'pending_approval',
            academic_year: '2026'
          });
        }
      }
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    // Send notification email to CEO and confirmation to applicant
    sendApplicationNotification({ name, email, program: programName });
    sendRegistrationConfirmationNotification({ first_name, last_name, email, program: programName });

    // Log to CRM
    await logToCRM(email, name || `${first_name} ${last_name}`, 'event', 'Account Registration', `Registered as ${role || 'student'} for program ${programName || 'N/A'}`, 'System');

    // Refresh user to include Profile
    const include = [];
    if (user.role === 'student') {
      include.push({ model: Student, as: 'StudentProfile' });
    } else if (user.role === 'lecturer' || user.role === 'staff') {
      include.push({ model: Staff, as: 'StaffProfile' });
    }

    const userWithProfile = await User.findByPk(user.id, {
      attributes: { exclude: ['password_hash'] },
      include
    });

    res.status(201).json({ user: userWithProfile, token });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    const include = [];
    if (user.role === 'student') {
      include.push({ model: Student, as: 'StudentProfile' });
    } else if (user.role === 'lecturer' || user.role === 'staff') {
      include.push({ model: Staff, as: 'StaffProfile' });
    }

    const userWithProfile = await User.findByPk(user.id, {
      attributes: { exclude: ['password_hash'] },
      include
    });

    res.json({ user: userWithProfile, token });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const adminCreateUser = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, password, role } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'User with this email already exists' });
    
    // Generate secure temporary password if not provided
    const tempPassword = password || `AFERA-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).slice(-4).toUpperCase()}!`;
    const hash = await bcrypt.hash(tempPassword, 10);
    const user = await User.create({ first_name, last_name, email, password_hash: hash, role: role || 'student' });
    
    if (role === 'student') {
      await Student.create({ user_id: user.id, admission_number: 'AFR' + Math.floor(100000 + Math.random() * 900000), status: 'active' });
    } else if (['lecturer', 'finance', 'admissions'].includes(role)) {
      await Staff.create({ user_id: user.id, staff_number: 'STF' + Math.floor(1000 + Math.random() * 9000), position: role.toUpperCase() });
    }
    
    // Send email with credentials
    await sendAccountCreatedNotification({ first_name, last_name, email, role: role || 'student' }, tempPassword);
    
    res.status(201).json({ message: 'User created successfully', user });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const impersonateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id as string);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
    
    const include = [];
    if (user.role === 'student') include.push({ model: Student, as: 'StudentProfile' });
    else if (['lecturer', 'finance', 'admissions'].includes(user.role)) include.push({ model: Staff, as: 'StaffProfile' });
    
    const userWithProfile = await User.findByPk(user.id as string, { attributes: { exclude: ['password_hash'] }, include });
    res.json({ user: userWithProfile, token });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const adminResetPassword = async (req: Request, res: Response) => {
  try {
    const { id, newPassword } = req.body;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const hash = await bcrypt.hash(newPassword, 10);
    await user.update({ password_hash: hash });
    res.json({ message: 'Password reset successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
