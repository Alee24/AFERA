import { Request, Response } from 'express';
import { User, Student, Enrollment, Course, Contact, Program } from '../models';

// GET /api/users (admin)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash'] },
      include: [
        { 
          model: Student, 
          as: 'StudentProfile',
          include: [
            {
              model: Enrollment,
              include: [Program]
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(users);
  } catch (error: any) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/users/:id (admin)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id as string);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.update(req.body);
    res.json({ ...user.toJSON(), password_hash: undefined });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/users/:id (admin)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id as string);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users/me
export const getMe = async (req: any, res: Response) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] },
      include: [{ model: Student, as: 'StudentProfile' }]
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/stats
export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.count();
    const totalStudents = await Student.count();
    const totalCourses = await Course.count();
    const totalEnrollments = await Enrollment.count();
    const totalContacts = await Contact.count();
    res.json({ totalUsers, totalStudents, totalCourses, totalEnrollments, totalContacts });
  } catch (error: any) {
    console.error('Error in getAdminStats:', error);
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/users/profile
export const updateProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, phone, nationality, gender, date_of_birth } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.update({ first_name, last_name, phone });

    let student = await Student.findOne({ where: { user_id: userId } });
    if (student) {
      await student.update({ nationality, gender, date_of_birth });
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
