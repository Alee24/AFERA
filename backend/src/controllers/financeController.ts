import { Request, Response } from 'express';
import { Invoice, Student, Enrollment, Course, Program } from '../models';

// GET /api/finance/my-invoices
export const getMyInvoices = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const student = await Student.findOne({ where: { user_id: userId } });
    if (!student) return res.json([]);

    const invoices = await Invoice.findAll({
      where: { student_id: student.id },
      include: [
        {
          model: Enrollment,
          include: [{ model: Course, as: 'Course' }, { model: Program }]
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(invoices);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/finance/invoices/:id
export const getInvoiceById = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const student = await Student.findOne({ where: { user_id: userId } });
    
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        {
          model: Enrollment,
          include: [{ model: Course, as: 'Course' }, { model: Program }]
        }
      ]
    });

    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    
    // Check ownership
    if (invoice.student_id !== student?.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(invoice);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/finance/mock-pay/:id
export const mockPayInvoice = async (req: any, res: Response) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    await invoice.update({ status: 'paid' });
    res.json({ message: 'Invoice paid successfully (Mock)' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/finance/all-invoices
export const getAllInvoices = async (req: any, res: Response) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { User } = require('../models');

    const invoices = await Invoice.findAll({
      include: [
        {
          model: Student,
          include: [{ model: User, attributes: ['first_name', 'last_name', 'email'] }]
        },
        {
          model: Enrollment,
          include: [{ model: Course, as: 'Course' }, { model: Program }]
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(invoices);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
