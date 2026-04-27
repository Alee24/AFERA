import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class GatewaySetting extends Model {
  public id!: string;
  public gateway_name!: 'mpesa' | 'paypal' | 'pesapal';
  public config!: any; // JSON string for keys
  public is_active!: boolean;
}

GatewaySetting.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  gateway_name: { type: DataTypes.ENUM('mpesa', 'paypal', 'pesapal'), unique: true, allowNull: false },
  config: { type: DataTypes.TEXT, allowNull: false }, // Store as stringified JSON
  is_active: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  sequelize,
  modelName: 'GatewaySetting',
  tableName: 'gateway_settings',
  underscored: true,
});

export default GatewaySetting;
