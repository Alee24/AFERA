import sequelize from '../models';
import { DataTypes } from 'sequelize';

const migrate = async () => {
  const queryInterface = sequelize.getQueryInterface();
  const tableName = 'courses';

  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    const tableInfo = await queryInterface.describeTable(tableName);

    const columnsToAdd = [
      { name: 'program_overview', type: DataTypes.TEXT },
      { name: 'learning_outcomes', type: DataTypes.TEXT },
      { name: 'curriculum_structure', type: DataTypes.TEXT },
      { name: 'content_en', type: DataTypes.TEXT },
      { name: 'content_fr', type: DataTypes.TEXT },
      { name: 'content_pt', type: DataTypes.TEXT },
      { name: 'content_sw', type: DataTypes.TEXT },
    ];

    for (const column of columnsToAdd) {
      if (!tableInfo[column.name]) {
        console.log(`Adding column ${column.name} to ${tableName}...`);
        await queryInterface.addColumn(tableName, column.name, {
          type: column.type,
          allowNull: true,
        });
      } else {
        console.log(`Column ${column.name} already exists.`);
      }
    }

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
