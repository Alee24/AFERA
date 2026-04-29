import { Request, Response } from 'express';
import { 
  LearningPath, LearningPathItem, Page, Quiz, Assignment, Wiki, Course, User 
} from '../models';

// GET /api/library
export const getLibrary = async (req: Request, res: Response) => {
  try {
    const courses = await Course.findAll({ attributes: ['id', 'title_en', 'image_url'] });
    const pages = await Page.findAll();
    const quizzes = await Quiz.findAll();
    const assignments = await Assignment.findAll();
    const wikis = await Wiki.findAll();

    res.json({
      courses,
      pages,
      quizzes,
      assignments,
      wikis
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Learning Path CRUD
export const createLearningPath = async (req: Request, res: Response) => {
  try {
    const learningPath = await LearningPath.create(req.body);
    res.status(201).json(learningPath);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getLearningPaths = async (req: Request, res: Response) => {
  try {
    const learningPaths = await LearningPath.findAll({
      include: [
        { model: User, as: 'Trainer', attributes: ['first_name', 'last_name'] },
        { model: LearningPathItem, as: 'Items' }
      ]
    });
    res.json(learningPaths);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getLearningPathById = async (req: Request, res: Response) => {
  try {
    const lp = await LearningPath.findByPk(req.params.id, {
      include: [{ model: LearningPathItem, as: 'Items', order: [['order', 'ASC']] }]
    });
    if (!lp) return res.status(404).json({ message: 'Learning Path not found' });
    res.json(lp);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLearningPath = async (req: Request, res: Response) => {
  try {
    const lp = await LearningPath.findByPk(req.params.id);
    if (!lp) return res.status(404).json({ message: 'Learning Path not found' });
    await lp.update(req.body);
    res.json(lp);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Items Management
export const addItemToPath = async (req: Request, res: Response) => {
  try {
    const item = await LearningPathItem.create({ ...req.body, learning_path_id: req.params.id });
    res.status(201).json(item);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const removeItemFromPath = async (req: Request, res: Response) => {
  try {
    const item = await LearningPathItem.findByPk(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    await item.destroy();
    res.json({ message: 'Item removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Page CRUD
export const createPage = async (req: Request, res: Response) => {
  try {
    const page = await Page.create(req.body);
    res.status(201).json(page);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getPages = async (req: Request, res: Response) => {
  try {
    const pages = await Page.findAll();
    res.json(pages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Quiz CRUD
export const createQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getQuizzes = async (req: Request, res: Response) => {
  try {
    const quizzes = await Quiz.findAll();
    res.json(quizzes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Assignment CRUD
export const createAssignment = async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.create(req.body);
    res.status(201).json(assignment);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Wiki CRUD
export const createWiki = async (req: Request, res: Response) => {
  try {
    const wiki = await Wiki.create(req.body);
    res.status(201).json(wiki);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
