import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class LearningPath extends Model {
  public id!: string;
  public title!: string;
  public description!: string;
  public thumbnail!: string;
  public category!: string;
  public duration!: string;
  public trainer_id!: string;
  public language!: string;
  public status!: 'draft' | 'published';
}

LearningPath.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  thumbnail: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING },
  duration: { type: DataTypes.STRING },
  trainer_id: { type: DataTypes.UUID, allowNull: true },
  language: { type: DataTypes.STRING, defaultValue: 'English' },
  status: { type: DataTypes.ENUM('draft', 'published'), defaultValue: 'draft' },
}, {
  sequelize,
  modelName: 'LearningPath',
  tableName: 'learning_paths',
  underscored: true,
});

export class LearningPathItem extends Model {
  public id!: string;
  public learning_path_id!: string;
  public content_type!: 'Course' | 'Page' | 'Quiz' | 'Assignment' | 'Wiki';
  public content_id!: string;
  public order!: number;
  public stage!: string; // e.g., "Junior", "Mid", "Senior"
}

LearningPathItem.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  learning_path_id: { type: DataTypes.UUID, allowNull: false },
  content_type: { type: DataTypes.ENUM('Course', 'Page', 'Quiz', 'Assignment', 'Wiki'), allowNull: false },
  content_id: { type: DataTypes.UUID, allowNull: false },
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
  stage: { type: DataTypes.STRING, defaultValue: 'General' },
}, {
  sequelize,
  modelName: 'LearningPathItem',
  tableName: 'learning_path_items',
  underscored: true,
});

export default LearningPath;
