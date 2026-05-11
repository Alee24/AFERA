import { Request, Response } from 'express';
import { Staff, Department, User } from '../models';

// GET all staff members with associated user and department
export const getAllStaff = async (req: Request, res: Response) => {
  try {
    const staff = await Staff.findAll({
      include: [
        { model: User, attributes: { exclude: ['password_hash'] } },
        { model: Department }
      ]
    });
    res.json(staff);
  } catch (error: any) {
    console.error('HR Get All Staff Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET specific staff by ID
export const getStaffById = async (req: Request, res: Response) => {
  try {
    const staff = await Staff.findByPk(req.params.id as string, {
      include: [{ model: User, attributes: { exclude: ['password_hash'] } }, { model: Department }]
    });
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json(staff);
  } catch (error: any) {
    console.error('HR Get Staff Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// CREATE new staff (requires associated user already created)
export const createStaff = async (req: Request, res: Response) => {
  try {
    const { user_id, staff_number, position, hire_date, department_id, phone, address, salary } = req.body;
    const newStaff = await Staff.create({
      user_id,
      staff_number,
      position,
      hire_date,
      department_id,
      phone,
      address,
      salary
    });
    res.status(201).json(newStaff);
  } catch (error: any) {
    console.error('HR Create Staff Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE existing staff
export const updateStaff = async (req: Request, res: Response) => {
  try {
    const staff = await Staff.findByPk(req.params.id as string);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    await staff.update(req.body);
    res.json(staff);
  } catch (error: any) {
    console.error('HR Update Staff Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE staff (soft delete could be implemented, for now hard delete)
export const deleteStaff = async (req: Request, res: Response) => {
  try {
    const staff = await Staff.findByPk(req.params.id as string);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    await staff.destroy();
    res.json({ message: 'Staff deleted' });
  } catch (error: any) {
    console.error('HR Delete Staff Error:', error);
    res.status(500).json({ message: error.message });
  }
};
