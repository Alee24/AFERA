import { Contact, CRMInteraction } from '../models';

export const logToCRM = async (email: string, name: string, type: string, title: string, details: string, author: string = 'System') => {
  try {
    // Find or create the contact by email
    let contact = await Contact.findOne({ where: { email } });
    
    if (!contact) {
      contact = await Contact.create({
        name,
        email,
        subject: 'Website Interaction',
        message: 'Auto-created from website activity.',
        status: 'unread'
      });
    }

    // Create the interaction
    await CRMInteraction.create({
      contact_id: contact.id,
      type,
      title,
      details,
      author
    });
    
  } catch (error) {
    console.error('Failed to log to CRM:', error);
  }
};
