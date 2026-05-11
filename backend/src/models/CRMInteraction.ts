import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class CRMInteraction extends Model {
  public id!: string;
  public contact_id!: string;
  public type!: 'note' | 'conversation' | 'email' | 'event' | 'file';
  public title!: string;
  public details!: string;
  public author!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

CRMInteraction.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  contact_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('note', 'conversation', 'email', 'event', 'file'),
    defaultValue: 'note',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  author: {
    type: DataTypes.STRING,
    defaultValue: 'System',
  }
}, {
  sequelize,
  modelName: 'CRMInteraction',
  tableName: 'crm_interactions',
  underscored: true,
  timestamps: true,
});

export default CRMInteraction;
