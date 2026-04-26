import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Post extends Model {
  public id!: string;
  public title_en!: string;
  public title_fr!: string;
  public title_pt!: string;
  public content_en!: string;
  public content_fr!: string;
  public content_pt!: string;
  public author_id!: string;
}

Post.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title_en: { type: DataTypes.STRING, allowNull: false },
    title_fr: { type: DataTypes.STRING, allowNull: false },
    title_pt: { type: DataTypes.STRING, allowNull: false },
    content_en: { type: DataTypes.TEXT, allowNull: false },
    content_fr: { type: DataTypes.TEXT, allowNull: false },
    content_pt: { type: DataTypes.TEXT, allowNull: false },
    author_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Post',
    tableName: 'posts',
    timestamps: true,
    underscored: true,
  }
);

export default Post;
