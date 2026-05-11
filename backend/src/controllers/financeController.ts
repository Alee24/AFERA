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
    const { Receipt } = require('../models');
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    await invoice.update({ status: 'paid' });

    // Auto-generate Receipt
    await Receipt.create({
      invoice_id: invoice.id,
      student_id: invoice.student_id,
      amount_paid: invoice.total_amount,
      payment_method: 'Manual/Admin',
      transaction_ref: `RCPT-${Date.now()}`
    });

    res.json({ message: 'Invoice paid and receipt generated successfully' });
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

    const { User, Receipt } = require('../models');

    const invoices = await Invoice.findAll({
      include: [
        {
          model: Student,
          include: [{ model: User, attributes: ['first_name', 'last_name', 'email'] }]
        },
        {
          model: Enrollment,
          include: [{ model: Course, as: 'Course' }, { model: Program }]
        },
        { model: Receipt }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(invoices);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/finance/stats
export const getFinanceStats = async (req: any, res: Response) => {
  try {
    const allInvoices = await Invoice.findAll();
    const totalRevenue = allInvoices
      .filter(i => i.status === 'paid')
      .reduce((sum, i) => sum + Number(i.total_amount), 0);
    
    const outstanding = allInvoices
      .filter(i => i.status === 'pending')
      .reduce((sum, i) => sum + Number(i.total_amount), 0);
    
    const successfulPayments = allInvoices.filter(i => i.status === 'paid').length;
    
    res.json({
      totalRevenue: totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      outstanding: outstanding.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      successfulPayments: successfulPayments.toString(),
      refundRequests: '0' // Placeholder
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/finance/invoices
export const createInvoice = async (req: any, res: Response) => {
  try {
    const { student_id, amount, description, billing_type, due_date } = req.body;
    const invoice = await Invoice.create({
      student_id,
      total_amount: amount,
      status: 'pending',
      billing_type: billing_type || 'invoice',
      notes: description,
      due_date: due_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default 7 days
    });
    res.status(201).json(invoice);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/finance/credit-notes
export const issueCreditNote = async (req: any, res: Response) => {
  try {
    const { student_id, amount, reason } = req.body;
    const creditNote = await Invoice.create({
      student_id,
      total_amount: -Math.abs(amount), // Negative for credit
      status: 'paid',
      billing_type: 'credit_note',
      notes: reason,
      due_date: new Date()
    });
    res.status(201).json(creditNote);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE /api/finance/invoices/:id
export const deleteInvoice = async (req: any, res: Response) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    await invoice.destroy();
    res.json({ message: 'Invoice deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

