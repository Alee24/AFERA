import sequelize from '../config/database';
import { QueryInterface, DataTypes } from 'sequelize';

async function up() {
  const queryInterface = sequelize.getQueryInterface();
  const table = 'courses';
  
  const columns = await queryInterface.describeTable(table);
  
  if (!columns.title_sw) {
    await queryInterface.addColumn(table, 'title_sw', { type: DataTypes.STRING, allowNull: true });
  }
  if (!columns.description_sw) {
    await queryInterface.addColumn(table, 'description_sw', { type: DataTypes.TEXT, allowNull: true });
  }
  if (!columns.content_sw) {
    await queryInterface.addColumn(table, 'content_sw', { type: DataTypes.TEXT, allowNull: true });
  }
  
  console.log('Swahili fields added to courses table successfully.');
}

up().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
