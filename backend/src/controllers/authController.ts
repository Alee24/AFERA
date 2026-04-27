import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Student, Staff, Program, Enrollment } from '../models';
import { sendApplicationNotification } from '../services/mailService';

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

      // Find the program and create an enrollment
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

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    // Send notification email to CEO
    sendApplicationNotification({ name, email, program: programName });

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
