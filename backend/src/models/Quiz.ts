import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Quiz extends Model {
  public id!: string;
  public title!: string;
  public description!: string;
  public questions!: any;
  public time_limit!: number;
  public is_ai_powered!: boolean;
}

Quiz.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  questions: { type: DataTypes.JSON, defaultValue: [] },
  time_limit: { type: DataTypes.INTEGER, defaultValue: 0 }, // in minutes
  is_ai_powered: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  sequelize,
  modelName: 'Quiz',
  tableName: 'quizzes',
  underscored: true,
});

export default Quiz;
