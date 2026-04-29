import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Page extends Model {
  public id!: string;
  public title!: string;
  public content!: string;
  public is_ai_powered!: boolean;
  public category!: string;
  public tags!: any;
}

Page.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT('long') },
  is_ai_powered: { type: DataTypes.BOOLEAN, defaultValue: false },
  category: { type: DataTypes.STRING },
  tags: { type: DataTypes.JSON, defaultValue: [] },
}, {
  sequelize,
  modelName: 'Page',
  tableName: 'pages',
  underscored: true,
});

export default Page;
