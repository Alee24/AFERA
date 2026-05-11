import sequelize from '../models';

const fixDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('🚀 Starting Database Schema Fix...');

    const queryInterface = sequelize.getQueryInterface();

    // Helper to check and add column
    const ensureColumn = async (table: string, col: string, def: any, colsObj: any) => {
      if (!colsObj[col]) {
        console.log(`➕ Adding column ${col} to ${table}...`);
        await queryInterface.addColumn(table, col, def);
        return true;
      }
      return false;
    };

    // 1. Fix courses table
    console.log('🛠️ Hardening courses table...');
    const coursesCols = await queryInterface.describeTable('courses');
    
    // Translation fields
    const translationCols = ['title_fr', 'title_pt', 'title_sw', 'description_fr', 'description_pt', 'description_sw', 'content_fr', 'content_pt', 'content_sw'];
    for (const col of translationCols) {
      const isText = !col.includes('title');
      const type = isText ? 'TEXT' : 'VARCHAR(255)';
      if (coursesCols[col]) {
        console.log(`🔧 Modifying column ${col} in courses...`);
        const defaultClause = isText ? '' : "DEFAULT ''";
        await sequelize.query(`ALTER TABLE courses MODIFY COLUMN ${col} ${type} NULL ${defaultClause};`);
      } else {
        console.log(`➕ Adding column ${col} to courses...`);
        await queryInterface.addColumn('courses', col, { type, defaultValue: isText ? undefined : '' });
      }
    }

    // Other content fields
    const contentCols: any = {
      image_url: { type: 'TEXT' },
      program_overview: { type: 'TEXT' },
      learning_outcomes: { type: 'TEXT' },
      curriculum_structure: { type: 'TEXT' },
      slug: { type: 'VARCHAR(255)' }
    };
    for (const [col, def] of Object.entries(contentCols)) {
      await ensureColumn('courses', col, def, coursesCols);
    }

    // 2. Fix students table
    console.log('🛠️ Hardening students table...');
    const studentsCols = await queryInterface.describeTable('students');
    const studentFields: any = {
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
      await ensureColumn('students', col, def, studentsCols);
    }

    // 3. Fix users table
    const usersCols = await queryInterface.describeTable('users');
    await ensureColumn('users', 'phone', { type: 'VARCHAR(255)' }, usersCols);

    // 4. Fix staff table
    const staffCols = await queryInterface.describeTable('staff');
    await ensureColumn('staff', 'user_id', { type: 'VARCHAR(255)', allowNull: false }, staffCols);
    await ensureColumn('staff', 'department_id', { type: 'VARCHAR(255)' }, staffCols);
    await ensureColumn('staff', 'phone', { type: 'VARCHAR(255)' }, staffCols);
    await ensureColumn('staff', 'address', { type: 'TEXT' }, staffCols);
    await ensureColumn('staff', 'salary', { type: 'DECIMAL(10,2)' }, staffCols);

    // 5. Fix departments table
    const deptCols = await queryInterface.describeTable('departments');
    await ensureColumn('departments', 'description', { type: 'TEXT' }, deptCols);
    await ensureColumn('departments', 'head_of_department', { type: 'VARCHAR(255)' }, deptCols);

    // 6. Fix course_modules table
    console.log('🛠️ Hardening course_modules table...');
    const moduleCols = await queryInterface.describeTable('course_modules');
    const modTranslationCols = ['title_fr', 'title_pt', 'title_sw', 'description_fr', 'description_pt', 'description_sw'];
    for (const col of modTranslationCols) {
      const isText = !col.includes('title');
      const type = isText ? 'TEXT' : 'VARCHAR(255)';
      if (moduleCols[col]) {
        console.log(`🔧 Modifying column ${col} in course_modules...`);
        const defaultClause = isText ? '' : "DEFAULT ''";
        await sequelize.query(`ALTER TABLE course_modules MODIFY COLUMN ${col} ${type} NULL ${defaultClause};`);
      } else {
        console.log(`➕ Adding column ${col} to course_modules...`);
        await queryInterface.addColumn('course_modules', col, { type, defaultValue: isText ? undefined : '' });
      }
    }

    const moduleFields: any = {
      video_url: { type: 'VARCHAR(255)' },
      document_url: { type: 'VARCHAR(255)' },
      h5p_content: { type: 'TEXT' }
    };
    for (const [col, def] of Object.entries(moduleFields)) {
      await ensureColumn('course_modules', col, def, moduleCols);
    }

    // 7. Fix enrollments
    const enrollmentCols = await queryInterface.describeTable('enrollments');
    await ensureColumn('enrollments', 'course_id', { type: 'VARCHAR(255)' }, enrollmentCols);

    // 8. Fix invoices
    const invoiceCols = await queryInterface.describeTable('invoices');
    await ensureColumn('invoices', 'billing_type', { type: 'VARCHAR(255)', defaultValue: 'invoice' }, invoiceCols);
    await ensureColumn('invoices', 'notes', { type: 'TEXT' }, invoiceCols);

    // 9. Sync remaining models
    const models = require('../models');
    const syncModels = [
      'Workshop', 'GatewaySetting', 'SystemSetting', 'Staff', 'CourseUnit', 
      'Class', 'Assessment', 'Grade', 'Attendance', 'CourseRegistration', 
      'Receipt', 'NewsPost', 'ModuleContent', 'LearningPath', 'LearningPathItem', 
      'Page', 'Quiz', 'Assignment', 'Wiki', 'CRMInteraction'
    ];
    
    for (const modelName of syncModels) {
      if (models[modelName]) {
        await models[modelName].sync();
      }
    }
    
    console.log('✅ All Portal and Payment tables synchronized.');
    console.log('✅ Database Schema Fix COMPLETED!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database Fix FAILED:', error);
    process.exit(1);
  }
};

fixDatabase();
