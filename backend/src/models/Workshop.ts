import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Workshop extends Model {
  public id!: string;
  public title_en!: string;
  public title_fr!: string;
  public title_pt!: string;
  public title_sw!: string;
  public description_en!: string;
  public description_fr!: string;
  public description_pt!: string;
  public description_sw!: string;
  public image_url!: string;
  public file_url!: string;
  public category!: string;
  public type!: string;
}

Workshop.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title_en: { type: DataTypes.STRING, allowNull: false },
  title_fr: { type: DataTypes.STRING },
  title_pt: { type: DataTypes.STRING },
  title_sw: { type: DataTypes.STRING },
  description_en: { type: DataTypes.TEXT, allowNull: false },
  description_fr: { type: DataTypes.TEXT },
  description_pt: { type: DataTypes.TEXT },
  description_sw: { type: DataTypes.TEXT },
  image_url: { type: DataTypes.STRING },
  file_url: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING, defaultValue: 'General' },
  type: { type: DataTypes.STRING, defaultValue: 'PPTX' },
}, {
  sequelize,
  modelName: 'Workshop',
  tableName: 'workshops',
  underscored: true,
  timestamps: true,
});

export default Workshop;
