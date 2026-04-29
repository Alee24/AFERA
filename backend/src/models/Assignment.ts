import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Assignment extends Model {
  public id!: string;
  public title!: string;
  public description!: string;
  public deadline!: Date;
  public total_marks!: number;
}

Assignment.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  deadline: { type: DataTypes.DATE },
  total_marks: { type: DataTypes.INTEGER, defaultValue: 100 },
}, {
  sequelize,
  modelName: 'Assignment',
  tableName: 'assignments',
  underscored: true,
});

export default Assignment;
