import { Request, Response } from 'express';
import { Post, File, User } from '../models';

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.findAll({
      include: [
        { model: File, as: 'Files' },
        { model: User, as: 'Author', attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findByPk(req.params.id as string, {
      include: [
        { model: File, as: 'Files' },
        { model: User, as: 'Author', attributes: ['id', 'name'] }
      ]
    });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req: any, res: Response) => {
  try {
    const post = await Post.create({ ...req.body, author_id: req.user.id });
    res.status(201).json(post);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findByPk(req.params.id as string);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    await post.update(req.body);
    res.json(post);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findByPk(req.params.id as string);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    await post.destroy();
    res.json({ message: 'Post deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
