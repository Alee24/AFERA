import sequelize from '../config/database';

async function fixSchema() {
  console.log('🛠️ Fixing database schema for translation fields...');
  try {
    // course_modules
    await sequelize.query("ALTER TABLE course_modules MODIFY COLUMN title_fr VARCHAR(255) NULL DEFAULT '';");
    await sequelize.query("ALTER TABLE course_modules MODIFY COLUMN title_pt VARCHAR(255) NULL DEFAULT '';");
    await sequelize.query("ALTER TABLE course_modules MODIFY COLUMN title_sw VARCHAR(255) NULL DEFAULT '';");
    await sequelize.query("ALTER TABLE course_modules MODIFY COLUMN description_fr TEXT NULL;");
    await sequelize.query("ALTER TABLE course_modules MODIFY COLUMN description_pt TEXT NULL;");
    await sequelize.query("ALTER TABLE course_modules MODIFY COLUMN description_sw TEXT NULL;");
    
    // courses
    await sequelize.query("ALTER TABLE courses MODIFY COLUMN title_fr VARCHAR(255) NULL DEFAULT '';");
    await sequelize.query("ALTER TABLE courses MODIFY COLUMN title_pt VARCHAR(255) NULL DEFAULT '';");
    await sequelize.query("ALTER TABLE courses MODIFY COLUMN title_sw VARCHAR(255) NULL DEFAULT '';");
    await sequelize.query("ALTER TABLE courses MODIFY COLUMN description_fr TEXT NULL;");
    await sequelize.query("ALTER TABLE courses MODIFY COLUMN description_pt TEXT NULL;");
    await sequelize.query("ALTER TABLE courses MODIFY COLUMN description_sw TEXT NULL;");
    await sequelize.query("ALTER TABLE courses MODIFY COLUMN content_fr TEXT NULL;");
    await sequelize.query("ALTER TABLE courses MODIFY COLUMN content_pt TEXT NULL;");
    await sequelize.query("ALTER TABLE courses MODIFY COLUMN content_sw TEXT NULL;");

    console.log('✅ Schema fixed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to fix schema:', err);
    process.exit(1);
  }
}

fixSchema();
