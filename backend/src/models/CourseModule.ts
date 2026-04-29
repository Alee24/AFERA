import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import ModuleContent from './ModuleContent';

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
  public document_url!: string;
  public h5p_content!: string;
  public video_url!: string;

  public static associate() {
    CourseModule.hasMany(ModuleContent, { foreignKey: 'module_id', as: 'Contents' });
    ModuleContent.belongsTo(CourseModule, { foreignKey: 'module_id' });
  }
}

CourseModule.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    course_id: { type: DataTypes.UUID, allowNull: false },
    title_en: { type: DataTypes.STRING, allowNull: false },
    title_fr: { type: DataTypes.STRING, allowNull: true },
    title_pt: { type: DataTypes.STRING, allowNull: true },
    title_sw: { type: DataTypes.STRING, allowNull: true },
    description_en: { type: DataTypes.TEXT, allowNull: false },
    description_fr: { type: DataTypes.TEXT, allowNull: true },
    description_pt: { type: DataTypes.TEXT, allowNull: true },
    description_sw: { type: DataTypes.TEXT, allowNull: true },
    order: { type: DataTypes.INTEGER, defaultValue: 1 },
    duration_weeks: { type: DataTypes.INTEGER, defaultValue: 2 },
    document_url: { type: DataTypes.STRING, allowNull: true },
    h5p_content: { type: DataTypes.TEXT, allowNull: true },
    video_url: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: 'CourseModule', tableName: 'course_modules', timestamps: true, underscored: true }
);

export default CourseModule;
