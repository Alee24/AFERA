import { DataTypes } from 'sequelize';
import sequelize from '../models';

const migrate = async () => {
  try {
    const queryInterface = sequelize.getQueryInterface();
    
    // Check if table exists
    const tables = await queryInterface.showAllTables();
    if (!tables.includes('contacts')) {
      await queryInterface.createTable('contacts', {
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
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      });
      console.log('Table "contacts" created successfully.');
    } else {
      console.log('Table "contacts" already exists.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
