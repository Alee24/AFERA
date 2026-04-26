import sequelize from '../models';

const migrate = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    // In production, you'd use real migrations. 
    // For this generation, we use sync({ force: true }) to ensure schema is exactly as requested.
    await sequelize.sync({ force: true });
    console.log('Database synced successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
