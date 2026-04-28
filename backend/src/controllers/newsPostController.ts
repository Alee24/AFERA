import { Request, Response } from 'express';
import { NewsPost } from '../models';

// Default hardcoded items as fallback/seed
const DEFAULT_NEWS = [
  {
    title: "ARMFA 22nd AGM Liberia - Namibia Case Study",
    excerpt: "Detailed case study on road maintenance financing presented at the 2025 ARMFA AGM.",
    date: "Nov 12, 2025",
    author: "Sophia Tekie",
    type: "PPTX",
    filename: "ARMFA-22nd-AGM-Liberia-17-21-Nov-2025-Sophia-Tekie-Namibia.pptx",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Cost Estimation for Roadworks in Kenya",
    excerpt: "Technical presentation regarding the optimized cost estimation models for East African infrastructure.",
    date: "Nov 19, 2025",
    author: "Technical Committee",
    type: "PPTX",
    filename: "ARMFA-PPT-COST-ESTIMATION-FOR-ROADWORKS-IN-KENYA-19TH-NOV.pptx",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "AFERA Innov Centre Academy Vision",
    excerpt: "The institutional roadmap for 2026-2030, detailing our expansion into digital learning.",
    date: "Sep 28, 2025",
    author: "Directorate",
    type: "PPTX",
    filename: "Centre-Academy-AFERA-Innov.pptx",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
  }
];

export const getNewsPosts = async (req: Request, res: Response) => {
  try {
    let posts = await NewsPost.findAll({ order: [['created_at', 'DESC']] });
    
    // Auto-seed if empty
    if (posts.length === 0) {
      for (const item of DEFAULT_NEWS) {
        await NewsPost.create(item);
      }
      posts = await NewsPost.findAll({ order: [['created_at', 'DESC']] });
    }
    
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createNewsPost = async (req: Request, res: Response) => {
  try {
    const post = await NewsPost.create(req.body);
    res.status(201).json(post);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateNewsPost = async (req: Request, res: Response) => {
  try {
    const post = await NewsPost.findByPk(req.params.id as string);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    await post.update(req.body);
    res.json(post);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteNewsPost = async (req: Request, res: Response) => {
  try {
    const post = await NewsPost.findByPk(req.params.id as string);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    await post.destroy();
    res.json({ message: 'Post deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
