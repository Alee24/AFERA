import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class User extends Model {
  public id!: string;
  public first_name!: string;
  public last_name!: string;
  public email!: string;
  public phone!: string;
  public password_hash!: string;
  public role_id!: string;
  public role!: string;
  public status!: 'active' | 'inactive';
  public preferred_language!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Virtual property for backwards compatibility with existing UI
  get name() {
    return `${this.first_name} ${this.last_name}`;
  }
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'student',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
  preferred_language: {
    type: DataTypes.STRING,
    defaultValue: 'en',
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  underscored: true,
  timestamps: true,
});

export default User;
