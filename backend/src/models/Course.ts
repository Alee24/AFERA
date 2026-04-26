import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Course extends Model {
  public id!: string;
  public program_id!: string;
  public course_code!: string;
  public course_name!: string;
  public credits!: number;
  // Fallbacks for legacy/UI compatibility
  public title_en!: string;
  public title_fr!: string;
  public title_pt!: string;
  public description_en!: string;
  public description_fr!: string;
  public description_pt!: string;
  public price!: number;
  public duration!: string;
  public modality!: string;
  public department!: string;
  public course_type!: string;
}

Course.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  program_id: { type: DataTypes.UUID, allowNull: true }, // Optional for now
  course_code: { type: DataTypes.STRING, unique: true, allowNull: true },
  course_name: { type: DataTypes.STRING, allowNull: true },
  credits: { type: DataTypes.INTEGER, defaultValue: 3 },
  
  // Localized Fields (Existing)
  title_en: { type: DataTypes.STRING, allowNull: false },
  title_fr: { type: DataTypes.STRING },
  title_pt: { type: DataTypes.STRING },
  description_en: { type: DataTypes.TEXT, allowNull: false },
  description_fr: { type: DataTypes.TEXT },
  description_pt: { type: DataTypes.TEXT },
  
  // Metadata (Existing)
  price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 800.00 },
  duration: { type: DataTypes.STRING },
  modality: { type: DataTypes.STRING },
  department: { type: DataTypes.STRING },
  course_type: { type: DataTypes.STRING },
}, {
  sequelize,
  modelName: 'Course',
  tableName: 'courses',
  underscored: true,
});

export class CourseUnit extends Model {
  public id!: string;
  public course_id!: string;
  public name!: string;
  public semester!: number;
}
CourseUnit.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  course_id: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  semester: { type: DataTypes.INTEGER, allowNull: false },
}, { sequelize, modelName: 'CourseUnit', tableName: 'course_units', underscored: true });

export class Class extends Model {
  public id!: string;
  public course_unit_id!: string;
  public lecturer_id!: string;
  public academic_year!: string;
  public semester!: number;
  public schedule!: string;
}
Class.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  course_unit_id: { type: DataTypes.UUID, allowNull: false },
  lecturer_id: { type: DataTypes.UUID, allowNull: false },
  academic_year: { type: DataTypes.STRING, allowNull: false },
  semester: { type: DataTypes.INTEGER, allowNull: false },
  schedule: { type: DataTypes.STRING },
}, { sequelize, modelName: 'Class', tableName: 'classes', underscored: true });

export default Course;
