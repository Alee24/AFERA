import { Role, User, Staff, CourseUnit, Class } from '../models';
import bcrypt from 'bcryptjs';

const seedLecturers = async () => {
  try {
    console.log('🚀 Seeding Sample Lecturers...');

    // 1. Ensure Lecturer Role exists
    let [lecturerRole] = await Role.findOrCreate({
      where: { name: 'lecturer' }
    });

    const lecturers = [
      {
        email: 'prof.smith@aferainnov.africa',
        first_name: 'John',
        last_name: 'Smith',
        staff_id: 'LEC001',
        department: 'Computer Science'
      },
      {
        email: 'dr.jane@aferainnov.africa',
        first_name: 'Jane',
        last_name: 'Mdoe',
        staff_id: 'LEC002',
        department: 'Business Administration'
      },
      {
        email: 'lecturer.test@aferainnov.africa',
        first_name: 'Alice',
        last_name: 'Lecturer',
        staff_id: 'LEC003',
        department: 'Engineering'
      }
    ];

    const hashedPassword = await bcrypt.hash('Lecturer2025', 10);

    for (const l of lecturers) {
      // Create User
      const [user, created] = await User.findOrCreate({
        where: { email: l.email },
        defaults: {
          first_name: l.first_name,
          last_name: l.last_name,
          password_hash: hashedPassword,
          role_id: lecturerRole.id,
          role: lecturerRole.name, // Set the string role field for JWT
          preferred_language: 'en'
        }
      });

      if (created || user) {
        // If user already existed, ensure role string is updated
        if (!created) {
          await user.update({ role: lecturerRole.name, role_id: lecturerRole.id });
        }
        
        // Create Staff Profile
        await Staff.findOrCreate({
          where: { user_id: user.id },
          defaults: {
            staff_number: l.staff_id,
            position: l.department,
            hire_date: new Date().toISOString().split('T')[0]
          }
        });
        console.log(`✅ Lecturer ${l.first_name} ${l.last_name} created/verified.`);
      }
    }

    // 2. Assign to Classes
    const units = await CourseUnit.findAll();
    const staff = await Staff.findAll({ include: [{ model: User }] });

    if (units.length > 0 && staff.length > 0) {
      for (let i = 0; i < Math.min(units.length, staff.length); i++) {
        await Class.findOrCreate({
          where: { course_unit_id: units[i].id, lecturer_id: staff[i].id },
          defaults: {
            class_name: `Group ${i + 1}`,
            academic_year: '2024/2025',
            semester: units[i].semester
          }
        });
        // Access first_name from User association
        const staffName = (staff[i] as any).User?.first_name || 'Staff';
        console.log(`📌 Assigned ${staffName} to Unit: ${units[i].name}`);
      }
    }

    console.log('✨ Seeding COMPLETED!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding FAILED:', error);
    process.exit(1);
  }
};

seedLecturers();
