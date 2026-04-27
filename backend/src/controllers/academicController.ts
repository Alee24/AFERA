import { Request, Response } from 'express';
import { Faculty, Department, Program } from '../models';

// ===== FACULTIES =====
export const getFaculties = async (req: Request, res: Response) => {
  try {
    const faculties = await Faculty.findAll({
      include: [{ 
        model: Department,
        include: [Program]
      }]
    });
    res.json(faculties);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createFaculty = async (req: Request, res: Response) => {
  try {
    const faculty = await Faculty.create(req.body);
    res.status(201).json(faculty);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateFaculty = async (req: Request, res: Response) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    await faculty.update(req.body);
    res.json(faculty);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteFaculty = async (req: Request, res: Response) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    await faculty.destroy();
    res.json({ message: 'Faculty deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ===== DEPARTMENTS =====
export const createDepartment = async (req: Request, res: Response) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json(department);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    await department.destroy();
    res.json({ message: 'Department deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ===== PROGRAMS =====
export const createProgram = async (req: Request, res: Response) => {
  try {
    const program = await Program.create(req.body);
    res.status(201).json(program);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
