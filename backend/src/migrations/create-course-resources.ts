import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

const migrate = async () => {
  try {
    const queryInterface = sequelize.getQueryInterface();
    
    console.log('🚀 Creating course_resources table...');
    await queryInterface.createTable('course_resources', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      course_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'courses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title_en: { type: DataTypes.STRING, allowNull: false },
      title_fr: { type: DataTypes.STRING },
      title_pt: { type: DataTypes.STRING },
      title_sw: { type: DataTypes.STRING },
      resource_type: { 
        type: DataTypes.ENUM('syllabus', 'notes', 'template', 'other'), 
        defaultValue: 'notes' 
      },
      file_url: { type: DataTypes.STRING, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false }
    });

    console.log('✅ course_resources table created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrate();
