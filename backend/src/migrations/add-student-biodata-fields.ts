import sequelize from '../config/database';
import { QueryInterface, DataTypes } from 'sequelize';

async function up() {
  const queryInterface = sequelize.getQueryInterface();
  const table = 'students';
  
  const columns = await queryInterface.describeTable(table);
  
  if (!columns.institution) {
    await queryInterface.addColumn(table, 'institution', { type: DataTypes.STRING, allowNull: true });
  }
  if (!columns.job_title) {
    await queryInterface.addColumn(table, 'job_title', { type: DataTypes.STRING, allowNull: true });
  }
  if (!columns.qualification) {
    await queryInterface.addColumn(table, 'qualification', { type: DataTypes.STRING, allowNull: true });
  }
  if (!columns.address) {
    await queryInterface.addColumn(table, 'address', { type: DataTypes.TEXT, allowNull: true });
  }
  if (!columns.emergency_contact_name) {
    await queryInterface.addColumn(table, 'emergency_contact_name', { type: DataTypes.STRING, allowNull: true });
  }
  if (!columns.emergency_contact_phone) {
    await queryInterface.addColumn(table, 'emergency_contact_phone', { type: DataTypes.STRING, allowNull: true });
  }
  
  console.log('Biodata fields added to students table successfully.');
}

up().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
