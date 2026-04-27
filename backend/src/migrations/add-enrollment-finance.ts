import sequelize from '../config/database';
import { QueryInterface, DataTypes } from 'sequelize';

async function up() {
  const queryInterface = sequelize.getQueryInterface();
  const table = 'enrollments';
  
  const columns = await queryInterface.describeTable(table);
  
  if (!columns.fee_amount) {
    await queryInterface.addColumn(table, 'fee_amount', { type: DataTypes.DECIMAL(10, 2), allowNull: true });
  }
  if (!columns.currency) {
    await queryInterface.addColumn(table, 'currency', { type: DataTypes.STRING, defaultValue: 'USD' });
  }
  
  console.log('Finance fields added to enrollments table successfully.');
}

up().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
