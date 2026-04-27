import sequelize from '../config/database';
import { QueryInterface, DataTypes } from 'sequelize';

async function up() {
  const queryInterface = sequelize.getQueryInterface();
  const table = 'invoices';
  
  const columns = await queryInterface.describeTable(table);
  
  if (!columns.enrollment_id) {
    await queryInterface.addColumn(table, 'enrollment_id', { type: DataTypes.UUID, allowNull: true });
  }
  
  console.log('enrollment_id added to invoices table successfully.');
}

up().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
