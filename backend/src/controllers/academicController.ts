import { Request, Response } from 'express';
import { Faculty, Department, Program } from '../models';

// Faculty
export const getFaculties = async (req: Request, res: Response) => {
  try {
    const faculties = await Faculty.findAll({ include: [Department] });
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

// Department
export const getDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await Department.findAll({ include: [Program] });
    res.json(departments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json(department);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Program
export const getPrograms = async (req: Request, res: Response) => {
  try {
    const programs = await Program.findAll();
    res.json(programs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

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
    const program = await Program.findByPk(req.params.id as string);
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
    const program = await Program.findByPk(req.params.id as string);
    if (!program) return res.status(404).json({ message: 'Program not found' });
    await program.destroy();
    res.json({ message: 'Program deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
