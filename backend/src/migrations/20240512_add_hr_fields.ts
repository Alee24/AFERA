import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('staff', 'phone', { type: DataTypes.STRING, allowNull: true });
    await queryInterface.addColumn('staff', 'address', { type: DataTypes.TEXT, allowNull: true });
    await queryInterface.addColumn('staff', 'salary', { type: DataTypes.DECIMAL(12, 2), allowNull: true });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('staff', 'phone');
    await queryInterface.removeColumn('staff', 'address');
    await queryInterface.removeColumn('staff', 'salary');
  }
};
