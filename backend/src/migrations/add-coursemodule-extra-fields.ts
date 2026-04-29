import sequelize from '../config/database';
import { QueryInterface, DataTypes } from 'sequelize';

async function up() {
  const queryInterface = sequelize.getQueryInterface();
  const table = 'course_modules';
  
  const columns = await queryInterface.describeTable(table);
  
  if (!columns.document_url) {
    await queryInterface.addColumn(table, 'document_url', { type: DataTypes.STRING, allowNull: true });
  }
  if (!columns.h5p_content) {
    await queryInterface.addColumn(table, 'h5p_content', { type: DataTypes.TEXT, allowNull: true });
  }
  if (!columns.video_url) {
    await queryInterface.addColumn(table, 'video_url', { type: DataTypes.STRING, allowNull: true });
  }
  
  console.log('Extra fields added to course_modules table successfully.');
}

up().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
