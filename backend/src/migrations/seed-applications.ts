import { User, Student, Program, Enrollment } from '../models';
import sequelize from '../config/database';
import bcrypt from 'bcryptjs';

const seedApplications = async () => {
  try {
    await sequelize.authenticate();
    console.log('🚀 Seeding Mock Applications...');

    const programs = await Program.findAll();
    if (programs.length === 0) {
      console.error('❌ No programs found. Run seed-programs.ts first.');
      process.exit(1);
    }

    const mockData = [
      { first_name: 'John', last_name: 'Doe', email: 'john@example.com', nationality: 'Kenyan', gender: 'male' },
      { first_name: 'Maria', last_name: 'Silva', email: 'maria@example.com', nationality: 'Angolan', gender: 'female' },
      { first_name: 'Jean', last_name: 'Dupont', email: 'jean@example.com', nationality: 'Ivorian', gender: 'male' }
    ];

    const password_hash = await bcrypt.hash('Digital2025', 10);

    for (const data of mockData) {
      // Create User
      const [user] = await User.findOrCreate({
        where: { email: data.email },
        defaults: {
          first_name: data.first_name,
          last_name: data.last_name,
          password_hash,
          role: 'student',
          preferred_language: 'en'
        }
      });

      // Create Student
      const admission_number = 'AFR' + Math.floor(100000 + Math.random() * 900000);
      const [student] = await Student.findOrCreate({
        where: { user_id: user.id },
        defaults: {
          admission_number,
          nationality: data.nationality,
          gender: data.gender,
          status: 'pending'
        }
      });

      // Create Enrollment
      const randomProgram = programs[Math.floor(Math.random() * programs.length)];
      await Enrollment.findOrCreate({
        where: { student_id: student.id, program_id: randomProgram.id },
        defaults: {
          status: 'pending_approval',
          academic_year: '2026'
        }
      });

      console.log(`✅ Application Created for: ${data.first_name} ${data.last_name}`);
    }

    console.log('🌟 Mock Applications Seeding COMPLETED!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding FAILED:', error);
    process.exit(1);
  }
};

seedApplications();
