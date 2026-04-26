import { Request, Response } from 'express';
import { Contact } from '../models';

export const submitContact = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = await Contact.create({ name, email, subject, message });
    res.status(201).json(contact);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await Contact.findAll({ order: [['created_at', 'DESC']] });
    res.json(contacts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateContactStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const contact = await Contact.findByPk(id as string);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    await contact.update({ status });
    res.json(contact);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
