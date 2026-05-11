import sequelize from '../models';

const fixDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('🚀 Starting Database Schema Fix...');

    const queryInterface = sequelize.getQueryInterface();
    const tableDefinitions = await queryInterface.showAllTables();

    // 1. Fix courses table
    console.log('🛠️ Hardening translation fields in courses table...');
    const translationCols = ['title_fr', 'title_pt', 'title_sw', 'description_fr', 'description_pt', 'description_sw', 'content_fr', 'content_pt', 'content_sw'];
    for (const col of translationCols) {
      try {
        const type = col.includes('title') ? 'VARCHAR(255)' : 'TEXT';
        await sequelize.query(`ALTER TABLE courses MODIFY COLUMN ${col} ${type} NULL DEFAULT '';`);
      } catch (err) {
        // If column doesn't exist, add it
        const type = col.includes('title') ? 'VARCHAR(255)' : 'TEXT';
        await queryInterface.addColumn('courses', col, { type, defaultValue: '' });
      }
    }
    
    // Add other missing columns
    const coursesCols = await queryInterface.describeTable('courses');
    const contentCols: any = {
      image_url: { type: 'TEXT' },
      program_overview: { type: 'TEXT' },
      learning_outcomes: { type: 'TEXT' },
      curriculum_structure: { type: 'TEXT' },
      slug: { type: 'VARCHAR(255)' }
    };
    for (const [col, def] of Object.entries(contentCols)) {
      if (!coursesCols[col]) {
        console.log(`➕ Adding column ${col} to courses...`);
        await queryInterface.addColumn('courses', col, def as any);
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
    console.log('🛠️ Hardening translation fields in course_modules table...');
    const modTranslationCols = ['title_fr', 'title_pt', 'title_sw', 'description_fr', 'description_pt', 'description_sw'];
    for (const col of modTranslationCols) {
      try {
        const type = col.includes('title') ? 'VARCHAR(255)' : 'TEXT';
        await sequelize.query(`ALTER TABLE course_modules MODIFY COLUMN ${col} ${type} NULL DEFAULT '';`);
      } catch (err) {
        const type = col.includes('title') ? 'VARCHAR(255)' : 'TEXT';
        await queryInterface.addColumn('course_modules', col, { type, defaultValue: '' });
      }
    }

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
    
    const { NewsPost, ModuleContent, LearningPath, LearningPathItem, Page, Quiz, Assignment, Wiki } = require('../models');
    await NewsPost.sync();
    await ModuleContent.sync();
    await LearningPath.sync();
    await LearningPathItem.sync();
    await Page.sync();
    await Quiz.sync();
    await Assignment.sync();
    await Wiki.sync();
    
    console.log('✅ All Portal and Payment tables synchronized.');

    console.log('✅ Database Schema Fix COMPLETED!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database Fix FAILED:', error);
    process.exit(1);
  }
};

fixDatabase();
