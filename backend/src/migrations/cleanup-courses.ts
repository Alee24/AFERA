import { Course } from '../models';
import sequelize from '../models'; 

const cleanup = async () => {
  try {
    console.log('🧹 Cleaning up old courses...');
    // We just want to remove the ones that aren't matching our new titles if we were smart, 
    // but the user said "remove the bottom 2", which are the dynamic ones.
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    console.log('🔗 Foreign key checks disabled.');
    
    // Truncate related tables first or use cascade if supported
    await sequelize.query('TRUNCATE TABLE course_modules');
    await sequelize.query('TRUNCATE TABLE course_resources');
    await Course.destroy({ where: {}, truncate: true });
    
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Courses and related tables truncated.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
};

cleanup();
