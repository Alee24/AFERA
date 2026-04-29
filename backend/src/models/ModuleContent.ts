import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class ModuleContent extends Model {
  public id!: string;
  public module_id!: string;
  public type!: string;
  public title!: string;
  public content_en!: string;
  public content_fr!: string;
  public content_pt!: string;
  public content_sw!: string;
  public file_url!: string;
  public video_url!: string;
  public h5p_embed!: string;
  public reference_id!: string;
  public order!: number;
}

ModuleContent.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    module_id: { type: DataTypes.UUID, allowNull: false },
    type: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    title: { type: DataTypes.STRING, allowNull: false },
    content_en: { type: DataTypes.TEXT, allowNull: true },
    content_fr: { type: DataTypes.TEXT, allowNull: true },
    content_pt: { type: DataTypes.TEXT, allowNull: true },
    content_sw: { type: DataTypes.TEXT, allowNull: true },
    file_url: { type: DataTypes.STRING, allowNull: true },
    video_url: { type: DataTypes.STRING, allowNull: true },
    h5p_embed: { type: DataTypes.TEXT, allowNull: true },
    reference_id: { type: DataTypes.UUID, allowNull: true },
    order: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { 
    sequelize, 
    modelName: 'ModuleContent', 
    tableName: 'module_contents', 
    timestamps: true, 
    underscored: true 
  }
);

export default ModuleContent;
