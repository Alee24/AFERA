import { Request, Response } from 'express';
import { Message, User } from '../models';
import { Op } from 'sequelize';

export const getMessages = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      },
      order: [['createdAt', 'ASC']],
      include: [
        { model: User, as: 'Sender', attributes: ['id', 'name'] },
        { model: User, as: 'Receiver', attributes: ['id', 'name'] }
      ]
    });
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req: any, res: Response) => {
  try {
    const { receiver_id, content } = req.body;
    const sender_id = req.user.id;
    
    const message = await Message.create({
      sender_id,
      receiver_id,
      content,
    });
    
    res.status(201).json(message);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
