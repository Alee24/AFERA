import sequelize from '../config/database';
import { QueryInterface, DataTypes } from 'sequelize';

async function up() {
  const queryInterface = sequelize.getQueryInterface();
  
  await queryInterface.createTable('course_resources', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    course_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'courses', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
    title_en: { type: DataTypes.STRING, allowNull: false },
    title_fr: { type: DataTypes.STRING },
    title_pt: { type: DataTypes.STRING },
    title_sw: { type: DataTypes.STRING },
    resource_type: { type: DataTypes.ENUM('syllabus', 'notes', 'template', 'other'), defaultValue: 'notes' },
    file_url: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false }
  });
  
  console.log('course_resources table created successfully.');
}

up().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
