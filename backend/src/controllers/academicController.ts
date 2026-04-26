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

// GET /api/academic/programs
export const getPrograms = async (req: Request, res: Response) => {
  try {
    const programs = await Program.findAll({
      include: [
        { model: Department, include: [Faculty] },
        { model: Course }
      ]
    });
    res.json(programs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/academic/programs
export const createProgram = async (req: Request, res: Response) => {
  try {
    const program = await Program.create(req.body);
    res.status(201).json(program);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/academic/programs/:id
export const updateProgram = async (req: Request, res: Response) => {
  try {
    const program = await Program.findByPk(req.params.id);
    if (!program) return res.status(404).json({ message: 'Program not found' });
    await program.update(req.body);
    res.json(program);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/academic/programs/:id
export const deleteProgram = async (req: Request, res: Response) => {
  try {
    const program = await Program.findByPk(req.params.id);
    if (!program) return res.status(404).json({ message: 'Program not found' });
    await program.destroy();
    res.json({ message: 'Program deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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
      degreeLevels: 3, 
      activePrograms: programsCount
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
