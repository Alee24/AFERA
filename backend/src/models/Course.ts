// backend/src/models/Course.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Course extends Model {
  public id!: string;
  public program_id!: string;
  public course_code!: string;
  public course_name!: string;
  public credits!: number;
  // Virtual/computed fields
  public title!: string; // virtual, maps to title_en
  public slug!: string;
  // Localized titles
  public title_en!: string;
  public title_fr!: string;
  public title_pt!: string;
  public title_sw!: string;
  // Descriptions
  public description_en!: string;
  public description_fr!: string;
  public description_pt!: string;
  public description_sw!: string;
  // Content fields
  public content_en!: string;
  public content_fr!: string;
  public content_pt!: string;
  public content_sw!: string;
  public price!: number;
  public duration!: string;
  public modality!: string;
  public department!: string;
  public course_type!: string;
  public image_url!: string;
  public program_overview!: string;
  public learning_outcomes!: string;
  public curriculum_structure!: string;
}

Course.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  program_id: { type: DataTypes.UUID, allowNull: true },
  course_code: { type: DataTypes.STRING, unique: true, allowNull: true },
  course_name: { type: DataTypes.STRING, allowNull: true },
  credits: { type: DataTypes.INTEGER, defaultValue: 3 },
  title_en: { type: DataTypes.STRING, allowNull: false },
  title_fr: { type: DataTypes.STRING },
  title_pt: { type: DataTypes.STRING },
  title_sw: { type: DataTypes.STRING },
  description_en: { type: DataTypes.TEXT, allowNull: false },
  description_fr: { type: DataTypes.TEXT },
  description_pt: { type: DataTypes.TEXT },
  description_sw: { type: DataTypes.TEXT },
  content_en: { type: DataTypes.TEXT },
  content_fr: { type: DataTypes.TEXT },
  content_pt: { type: DataTypes.TEXT },
  content_sw: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 800.00 },
  duration: { type: DataTypes.STRING },
  modality: { type: DataTypes.STRING },
  department: { type: DataTypes.STRING },
  course_type: { type: DataTypes.STRING },
  image_url: { type: DataTypes.TEXT, allowNull: true },
  program_overview: { type: DataTypes.TEXT, allowNull: true },
  learning_outcomes: { type: DataTypes.TEXT, allowNull: true },
  curriculum_structure: { type: DataTypes.TEXT, allowNull: true },
  slug: { type: DataTypes.STRING, unique: true, allowNull: true },
  title: { type: DataTypes.VIRTUAL, get() { return (this as any).title_en; } },
}, {
  sequelize,
  modelName: 'Course',
  tableName: 'courses',
  underscored: true,
});

export default Course;
