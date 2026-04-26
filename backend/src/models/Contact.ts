import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Contact extends Model {
  public id!: string;
  public name!: string;
  public email!: string;
  public subject!: string;
  public message!: string;
  public status!: 'unread' | 'read' | 'replied';
}

Contact.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true }
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('unread', 'read', 'replied'),
    defaultValue: 'unread',
  }
}, {
  sequelize,
  modelName: 'Contact',
  tableName: 'contacts',
  underscored: true,
  timestamps: true,
});

export default Contact;
