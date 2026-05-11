import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export class FeeStructure extends Model {
  public id!: string;
  public program_id!: string;
  public academic_year!: string;
  public amount!: number;
}
FeeStructure.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  program_id: { type: DataTypes.UUID, allowNull: false },
  academic_year: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, { sequelize, modelName: 'FeeStructure', tableName: 'fee_structures', underscored: true });

export class Invoice extends Model {
  public id!: string;
  public student_id!: string;
  public enrollment_id!: string;
  public total_amount!: number;
  public billing_type!: 'invoice' | 'credit_note';
  public status!: 'pending' | 'paid' | 'overdue' | 'cancelled';
  public due_date!: Date;
  public notes!: string;
}
Invoice.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  student_id: { type: DataTypes.UUID, allowNull: false },
  enrollment_id: { type: DataTypes.UUID, allowNull: true },
  total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  billing_type: { type: DataTypes.ENUM('invoice', 'credit_note'), defaultValue: 'invoice' },
  status: { type: DataTypes.ENUM('pending', 'paid', 'overdue', 'cancelled'), defaultValue: 'pending' },
  due_date: { type: DataTypes.DATE, allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: true },
}, { sequelize, modelName: 'Invoice', tableName: 'invoices', underscored: true });

export class Receipt extends Model {
  public id!: string;
  public invoice_id!: string;
  public student_id!: string;
  public amount_paid!: number;
  public payment_method!: string;
  public transaction_ref!: string;
}
Receipt.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  invoice_id: { type: DataTypes.UUID, allowNull: false },
  student_id: { type: DataTypes.UUID, allowNull: false },
  amount_paid: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  payment_method: { type: DataTypes.STRING, defaultValue: 'Manual' },
  transaction_ref: { type: DataTypes.STRING, allowNull: true },
}, { sequelize, modelName: 'Receipt', tableName: 'receipts', underscored: true });

export class Payment extends Model {
  public id!: string;
  public student_id!: string;
  public invoice_id!: string;
  public amount!: number;
  public payment_method!: string;
  public transaction_ref!: string;
  public payment_date!: Date;
}
Payment.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  student_id: { type: DataTypes.UUID, allowNull: false },
  invoice_id: { type: DataTypes.UUID, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  payment_method: { type: DataTypes.STRING, allowNull: false },
  transaction_ref: { type: DataTypes.STRING, unique: true },
  payment_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { sequelize, modelName: 'Payment', tableName: 'payments', underscored: true });

