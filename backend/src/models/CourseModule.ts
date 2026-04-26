import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class CourseModule extends Model {
  public id!: string;
  public course_id!: string;
  public title_en!: string;
  public title_fr!: string;
  public title_pt!: string;
  public title_sw!: string;
  public description_en!: string;
  public description_fr!: string;
  public description_pt!: string;
  public description_sw!: string;
  public order!: number;
  public duration_weeks!: number;
}

CourseModule.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    course_id: { type: DataTypes.UUID, allowNull: false },
    title_en: { type: DataTypes.STRING, allowNull: false },
    title_fr: { type: DataTypes.STRING, allowNull: false },
    title_pt: { type: DataTypes.STRING, allowNull: false },
    title_sw: { type: DataTypes.STRING, allowNull: false },
    description_en: { type: DataTypes.TEXT, allowNull: false },
    description_fr: { type: DataTypes.TEXT, allowNull: false },
    description_pt: { type: DataTypes.TEXT, allowNull: false },
    description_sw: { type: DataTypes.TEXT, allowNull: false },
    order: { type: DataTypes.INTEGER, defaultValue: 1 },
    duration_weeks: { type: DataTypes.INTEGER, defaultValue: 2 },
  },
  { sequelize, modelName: 'CourseModule', tableName: 'course_modules', timestamps: true, underscored: true }
);

export default CourseModule;
