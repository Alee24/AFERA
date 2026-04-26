import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export class Faculty extends Model {
  public id!: string;
  public name!: string;
  public description!: string;
}
Faculty.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
}, { sequelize, modelName: 'Faculty', tableName: 'faculties', underscored: true });

export class Department extends Model {
  public id!: string;
  public faculty_id!: string;
  public name!: string;
}
Department.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  faculty_id: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
}, { sequelize, modelName: 'Department', tableName: 'departments', underscored: true });

export class Program extends Model {
  public id!: string;
  public department_id!: string;
  public name!: string;
  public level!: 'diploma' | 'degree' | 'masters';
  public duration_years!: number;
}
Program.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  department_id: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  level: { type: DataTypes.ENUM('diploma', 'degree', 'masters'), allowNull: false },
  duration_years: { type: DataTypes.INTEGER, allowNull: false },
}, { sequelize, modelName: 'Program', tableName: 'programs', underscored: true });
