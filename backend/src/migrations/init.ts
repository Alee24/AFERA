import sequelize from '../models';

const migrate = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    // Use alter: true to update schema without wiping data
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
