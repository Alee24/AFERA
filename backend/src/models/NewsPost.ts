import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class NewsPost extends Model {
  public id!: string;
  public title!: string;
  public excerpt!: string;
  public date!: string;
  public author!: string;
  public type!: string;
  public filename!: string | null;
  public image!: string | null;
}

NewsPost.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  excerpt: { type: DataTypes.TEXT, allowNull: false },
  date: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  filename: { type: DataTypes.STRING, allowNull: true },
  image: { type: DataTypes.STRING, allowNull: true }
}, {
  sequelize,
  modelName: 'NewsPost',
  tableName: 'news_posts',
  underscored: true,
  timestamps: true
});

export default NewsPost;
