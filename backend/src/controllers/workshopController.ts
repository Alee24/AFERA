import { Request, Response } from 'express';
import { Workshop } from '../models';

export const getWorkshops = async (req: Request, res: Response) => {
  try {
    const workshops = await Workshop.findAll({ order: [['createdAt', 'DESC']] });
    res.json(workshops);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createWorkshop = async (req: Request, res: Response) => {
  try {
    const workshop = await Workshop.create(req.body);
    res.status(201).json(workshop);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateWorkshop = async (req: Request, res: Response) => {
  try {
    const workshop = await Workshop.findByPk(req.params.id);
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
    await workshop.update(req.body);
    res.json(workshop);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteWorkshop = async (req: Request, res: Response) => {
  try {
    const workshop = await Workshop.findByPk(req.params.id);
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
    await workshop.destroy();
    res.json({ message: 'Workshop deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
