import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Student } from '../models';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, preferred_language, program } = req.body;
    
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
      await Student.create({
        user_id: user.id,
        admission_number,
        year_of_study: 1
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({ user, token });
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

    res.json({ user, token });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
