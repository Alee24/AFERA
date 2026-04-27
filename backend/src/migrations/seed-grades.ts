import { User, Student, Course, CourseUnit, Class, Assessment, Grade, Staff } from '../models';
import sequelize from '../models';

const seedGrades = async () => {
  try {
    await sequelize.authenticate();
    console.log('🚀 Seeding Grades...');

    // 1. Get the first student (or specific one)
    const student = await Student.findOne();
    if (!student) {
      console.log('❌ No student found to seed grades for.');
      process.exit(1);
    }
    console.log(`👤 Seeding for student: ${student.admission_number}`);

    // 2. Get some courses/units
    const course = await Course.findOne({ 
      where: { title_en: "Specialized master's degree in resource Mobilization and Financing of Road Infrastructure Maintenance" } 
    });
    
    if (!course) {
      console.log('❌ Master course not found.');
      process.exit(1);
    }

    // 3. Ensure units and classes exist
    const [unit1] = await CourseUnit.findOrCreate({
      where: { name: 'Infrastructure Asset Management', course_id: course.id },
      defaults: { semester: 1 }
    });

    const [unit2] = await CourseUnit.findOrCreate({
      where: { name: 'Road Maintenance Financing', course_id: course.id },
      defaults: { semester: 1 }
    });

    // 4. Create Classes
    const adminUser = await User.findOne({ where: { role: 'admin' } });
    if (!adminUser) {
      console.log('❌ Admin user not found.');
      process.exit(1);
    }
    
    let staff = await Staff.findOne({ where: { user_id: adminUser.id } });
    if (!staff) {
      // Try to find any staff or create one
      staff = await Staff.findOne();
      if (!staff) {
        staff = await Staff.create({
          user_id: adminUser.id,
          staff_number: `STAFF-${Date.now()}`,
          position: 'Professor'
        });
      }
    }

    const [class1] = await Class.findOrCreate({
      where: { course_unit_id: unit1.id, academic_year: '2025/2026' },
      defaults: { lecturer_id: staff.id, semester: 1 }
    });

    const [class2] = await Class.findOrCreate({
      where: { course_unit_id: unit2.id, academic_year: '2025/2026' },
      defaults: { lecturer_id: staff.id, semester: 1 }
    });

    // 5. Create Assessments
    const [ass1] = await Assessment.findOrCreate({
      where: { class_id: class1.id, type: 'Exam' },
      defaults: { total_marks: 100 }
    });

    const [ass2] = await Assessment.findOrCreate({
      where: { class_id: class2.id, type: 'Exam' },
      defaults: { total_marks: 100 }
    });

    // 6. Create Grades
    await Grade.findOrCreate({
      where: { student_id: student.id, assessment_id: ass1.id },
      defaults: { score: 85.5, grade: 'A', remarks: 'Excellent performance' }
    });

    await Grade.findOrCreate({
      where: { student_id: student.id, assessment_id: ass2.id },
      defaults: { score: 78.0, grade: 'B+', remarks: 'Good understanding of financing models' }
    });

    console.log('✅ Grades seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedGrades();
