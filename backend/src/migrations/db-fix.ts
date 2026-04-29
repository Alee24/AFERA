import sequelize from '../models';

const fixDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('🚀 Starting Database Schema Fix...');

    const queryInterface = sequelize.getQueryInterface();
    const tableDefinitions = await queryInterface.showAllTables();

    // 1. Fix courses table
    const coursesCols = await queryInterface.describeTable('courses');
    const contentCols = [
      'content_en', 'content_fr', 'content_pt', 'content_sw',
      'image_url', 'program_overview', 'learning_outcomes', 'curriculum_structure', 'slug'
    ];
    for (const col of contentCols) {
      if (!coursesCols[col]) {
        console.log(`➕ Adding column ${col} to courses...`);
        await queryInterface.addColumn('courses', col, { type: 'TEXT' });
      }
    }

    // 2. Fix students table
    const studentsCols = await queryInterface.describeTable('students');
    const studentFields = {
      nationality: { type: 'VARCHAR(255)' },
      gender: { type: 'VARCHAR(255)' },
      date_of_birth: { type: 'DATE' },
      status: { type: 'VARCHAR(255)', defaultValue: 'pending' },
      enrollment_date: { type: 'DATETIME' },
      professional_profile: { type: 'VARCHAR(255)' },
      religion: { type: 'VARCHAR(255)' },
      user_id: { type: 'VARCHAR(255)', allowNull: false }
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
      await queryInterface.addColumn('users', 'phone', { type: 'VARCHAR(255)' });
    }

    // 3.5. Fix staff table
    const staffCols = await queryInterface.describeTable('staff');
    if (!staffCols['user_id']) {
      console.log('➕ Adding column user_id to staff...');
      await queryInterface.addColumn('staff', 'user_id', { type: 'VARCHAR(255)', allowNull: false });
    }
    // 4. Fix course_modules table
    const moduleCols = await queryInterface.describeTable('course_modules');
    const moduleFields = {
      video_url: { type: 'VARCHAR(255)' },
      document_url: { type: 'VARCHAR(255)' },
      h5p_content: { type: 'TEXT' }
    };
    for (const [col, def] of Object.entries(moduleFields)) {
      if (!moduleCols[col]) {
        console.log(`➕ Adding column ${col} to course_modules...`);
        await queryInterface.addColumn('course_modules', col, def);
      }
    }

    const enrollmentCols = await queryInterface.describeTable('enrollments');
    if (!enrollmentCols['course_id']) {
      console.log('➕ Adding column course_id to enrollments...');
      await queryInterface.addColumn('enrollments', 'course_id', { type: 'VARCHAR(255)' });
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
      CourseRegistration,
      SystemSetting
    } = require('../models');
    
    await Workshop.sync();
    await GatewaySetting.sync();
    await SystemSetting.sync();
    await Staff.sync();
    await CourseUnit.sync();
    await Class.sync();
    await Assessment.sync();
    await Grade.sync();
    await Attendance.sync();
    await CourseRegistration.sync();
    
    const { NewsPost } = require('../models');
    await NewsPost.sync();
    
    console.log('✅ All Portal and Payment tables synchronized.');

    console.log('✅ Database Schema Fix COMPLETED!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database Fix FAILED:', error);
    process.exit(1);
  }
};

fixDatabase();
