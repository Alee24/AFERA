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
      date_of_birth: { type: 'DATEONLY' },
      status: { type: 'STRING', defaultValue: 'pending' },
      enrollment_date: { type: 'DATE' },
      professional_profile: { type: 'STRING' }
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

    // 5. Ensure all Portal tables exist
    const { 
      Workshop, 
      GatewaySetting, 
      Staff, 
      CourseUnit, 
      Class, 
      Assessment, 
      Grade, 
      Attendance,
      CourseRegistration
    } = require('../models');
    
    await Workshop.sync();
    await GatewaySetting.sync();
    await Staff.sync();
    await CourseUnit.sync();
    await Class.sync();
    await Assessment.sync();
    await Grade.sync();
    await Attendance.sync();
    await CourseRegistration.sync();
    
    console.log('✅ All Portal and Payment tables synchronized.');

    console.log('✅ Database Schema Fix COMPLETED!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database Fix FAILED:', error);
    process.exit(1);
  }
};

fixDatabase();
