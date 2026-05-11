import { Request, Response } from 'express';
import { Contact, CRMInteraction } from '../models';
import { sendContactNotification } from '../services/mailService';

export const submitContact = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = await Contact.create({ name, email, subject, message });
    
    // Send email to CEO
    try {
      await sendContactNotification({ 
        first_name: name.split(' ')[0], 
        last_name: name.split(' ').slice(1).join(' ') || '', 
        email, 
        subject, 
        message 
      });
    } catch (mailErr) {
      console.error('Non-blocking mail error:', mailErr);
    }

    await CRMInteraction.create({
      contact_id: contact.id,
      type: 'email',
      title: 'Inquiry Submitted',
      details: `Subject: ${subject}\n\n${message}`,
      author: 'Website Form'
    });

    res.status(201).json(contact);
  } catch (error: any) {
    console.error('Contact Submission Error:', error);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
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

export const deleteContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id as string);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    await contact.destroy();
    res.json({ message: 'Message deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getContactById = async (req: Request, res: Response) => {
  try {
    const contact = await Contact.findByPk(req.params.id as string, {
      include: [{ model: CRMInteraction, as: 'Interactions' }],
      order: [[{ model: CRMInteraction, as: 'Interactions' }, 'created_at', 'DESC']]
    });
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json(contact);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addInteraction = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { type, title, details } = req.body;
    const contact = await Contact.findByPk(id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    
    const interaction = await CRMInteraction.create({
      contact_id: id,
      type,
      title,
      details,
      author: req.user?.name || req.user?.first_name || 'System User'
    });
    
    res.status(201).json(interaction);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
