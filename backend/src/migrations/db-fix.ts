import sequelize from '../models';

const fixDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('🚀 Starting Database Schema Fix...');

    const queryInterface = sequelize.getQueryInterface();
    const tableDefinitions = await queryInterface.showAllTables();

    // 1. Fix courses table
    console.log('🛠️ Hardening translation fields in courses table...');
    const coursesCols = await queryInterface.describeTable('courses');
    const translationCols = ['title_fr', 'title_pt', 'title_sw', 'description_fr', 'description_pt', 'description_sw', 'content_fr', 'content_pt', 'content_sw'];
    for (const col of translationCols) {
      const type = col.includes('title') ? 'VARCHAR(255)' : 'TEXT';
      if (coursesCols[col]) {
        console.log(`🔧 Modifying column ${col} in courses...`);
        await sequelize.query(`ALTER TABLE courses MODIFY COLUMN ${col} ${type} NULL DEFAULT '';`);
      } else {
        console.log(`➕ Adding column ${col} to courses...`);
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
    if (!staffCols['department_id']) {
      console.log('➕ Adding column department_id to staff...');
      await queryInterface.addColumn('staff', 'department_id', { type: 'VARCHAR(255)' });
    }

    // 3.6. Fix departments table
    const deptCols = await queryInterface.describeTable('departments');
    if (!deptCols['description']) {
      console.log('➕ Adding column description to departments...');
      await queryInterface.addColumn('departments', 'description', { type: 'TEXT' });
    }
    if (!deptCols['head_of_department']) {
      console.log('➕ Adding column head_of_department to departments...');
      await queryInterface.addColumn('departments', 'head_of_department', { type: 'VARCHAR(255)' });
    }
    // 4. Fix course_modules table
    console.log('🛠️ Hardening translation fields in course_modules table...');
    const moduleCols = await queryInterface.describeTable('course_modules');
    const modTranslationCols = ['title_fr', 'title_pt', 'title_sw', 'description_fr', 'description_pt', 'description_sw'];
    for (const col of modTranslationCols) {
      const type = col.includes('title') ? 'VARCHAR(255)' : 'TEXT';
      if (moduleCols[col]) {
        console.log(`🔧 Modifying column ${col} in course_modules...`);
        await sequelize.query(`ALTER TABLE course_modules MODIFY COLUMN ${col} ${type} NULL DEFAULT '';`);
      } else {
        console.log(`➕ Adding column ${col} to course_modules...`);
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
      SystemSetting,
      Receipt
    } = require('../models');
    
    // Add missing invoice columns
    const invoiceCols = await queryInterface.describeTable('invoices');
    if (!invoiceCols['billing_type']) {
      console.log('➕ Adding column billing_type to invoices...');
      await queryInterface.addColumn('invoices', 'billing_type', { type: 'VARCHAR(255)', defaultValue: 'invoice' });
    }
    if (!invoiceCols['notes']) {
      console.log('➕ Adding column notes to invoices...');
      await queryInterface.addColumn('invoices', 'notes', { type: 'TEXT' });
    }

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
    await Receipt.sync();
    
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
