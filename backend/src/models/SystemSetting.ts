import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class SystemSetting extends Model {
  public id!: string;
  public key!: string;
  public value!: string;
}

SystemSetting.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  key: { type: DataTypes.STRING, unique: true, allowNull: false },
  value: { type: DataTypes.TEXT, allowNull: false }
}, {
  sequelize,
  modelName: 'SystemSetting',
  tableName: 'system_settings',
  underscored: true
});

export default SystemSetting;
