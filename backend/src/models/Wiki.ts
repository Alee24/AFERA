import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Wiki extends Model {
  public id!: string;
  public title!: string;
  public content!: string;
  public category!: string;
}

Wiki.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT('long') },
  category: { type: DataTypes.STRING },
}, {
  sequelize,
  modelName: 'Wiki',
  tableName: 'wikis',
  underscored: true,
});

export default Wiki;
