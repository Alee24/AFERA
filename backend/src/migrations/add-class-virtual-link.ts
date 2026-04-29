import sequelize from '../config/database';
import { QueryInterface, DataTypes } from 'sequelize';

async function up() {
  const queryInterface = sequelize.getQueryInterface();
  const table = 'classes';
  
  const columns = await queryInterface.describeTable(table);
  
  if (!columns.virtual_link) {
    await queryInterface.addColumn(table, 'virtual_link', { type: DataTypes.STRING, allowNull: true });
  }
  
  console.log('Virtual link field added to classes table successfully.');
}

up().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
