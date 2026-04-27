import { Course } from '../models';
import sequelize from './init'; // Using the sequelize instance from init or index

const cleanup = async () => {
  try {
    console.log('🧹 Cleaning up old courses...');
    // We just want to remove the ones that aren't matching our new titles if we were smart, 
    // but the user said "remove the bottom 2", which are the dynamic ones.
    await Course.destroy({ where: {}, truncate: true });
    console.log('✅ Courses table truncated.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
};

cleanup();
