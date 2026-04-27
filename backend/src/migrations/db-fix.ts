import sequelize from '../models';

const fixDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('🚀 Starting Database Schema Fix...');

    const queryInterface = sequelize.getQueryInterface();
    const tableDefinitions = await queryInterface.showAllTables();

    // 1. Fix courses table
    const coursesCols = await queryInterface.describeTable('courses');
    const contentCols = ['content_en', 'content_fr', 'content_pt', 'content_sw'];
    for (const col of contentCols) {
      if (!coursesCols[col]) {
        console.log(`➕ Adding column ${col} to courses...`);
        await queryInterface.addColumn('courses', col, { type: 'TEXT' });
      }
    }

    // 2. Fix students table
    const studentsCols = await queryInterface.describeTable('students');
    const studentFields = {
      nationality: { type: 'STRING' },
      gender: { type: 'STRING' },
      date_of_birth: { type: 'DATEONLY' }
    };
    for (const [col, def] of Object.entries(studentFields)) {
      if (!studentsCols[col]) {
        console.log(`➕ Adding column ${col} to students...`);
        await queryInterface.addColumn('students', col, def);
      }
    }

    // 3. Fix users table
    const usersCols = await queryInterface.describeTable('users');
    if (!usersCols['phone']) {
      console.log('➕ Adding column phone to users...');
      await queryInterface.addColumn('users', 'phone', { type: 'STRING' });
    }

    // 4. Fix enrollments table (Add course_id)
    const enrollmentCols = await queryInterface.describeTable('enrollments');
    if (!enrollmentCols['course_id']) {
      console.log('➕ Adding column course_id to enrollments...');
      await queryInterface.addColumn('enrollments', 'course_id', { type: 'UUID' });
    }

    console.log('✅ Database Schema Fix COMPLETED!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database Fix FAILED:', error);
    process.exit(1);
  }
};

fixDatabase();
