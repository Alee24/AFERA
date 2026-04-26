import { Request, Response } from 'express';
import { Faculty, Department, Program, Course } from '../models';

// GET /api/academic/faculties
export const getFaculties = async (req: Request, res: Response) => {
  try {
    const faculties = await Faculty.findAll({
      include: [
        {
          model: Department,
          include: [Program]
        }
      ]
    });
    res.json(faculties);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/academic/faculties
export const createFaculty = async (req: Request, res: Response) => {
  try {
    const faculty = await Faculty.create(req.body);
    res.status(201).json(faculty);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/academic/stats
export const getAcademicStats = async (req: Request, res: Response) => {
  try {
    const facultiesCount = await Faculty.count();
    const departmentsCount = await Department.count();
    const programsCount = await Program.count();
    const activeCoursesCount = await Course.count();

    res.json({
      faculties: facultiesCount,
      departments: departmentsCount,
      degreeLevels: 3, // Hardcoded for now
      activePrograms: activeCoursesCount // Using courses count as programs for now based on UI
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
