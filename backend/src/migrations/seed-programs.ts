import { Faculty, Department, Program } from '../models';
import sequelize from '../config/database';

const seedAcademicData = async () => {
  try {
    await sequelize.authenticate();
    console.log('🚀 Seeding Academic Data...');

    // 1. Create a default faculty
    const [faculty] = await Faculty.findOrCreate({
      where: { name: 'Afera Innov Academy' },
      defaults: { description: 'Primary faculty for specialized infrastructure and management training.' }
    });

    // 2. Create a default department
    const [department] = await Department.findOrCreate({
      where: { name: 'Professional Studies' },
      defaults: { faculty_id: faculty.id }
    });

    // 3. Create the programs
    const programs = [
      {
        name: "Specialized master's degree in resource Mobilization and Financing of Road Infrastructure Maintenance",
        level: 'masters',
        duration_years: 2,
        department_id: department.id
      },
      {
        name: "Results-Based Management for Road Fund Professionals in Africa",
        level: 'degree', // Using degree as level placeholder
        duration_years: 1,
        department_id: department.id
      }
    ];

    for (const p of programs) {
      await Program.findOrCreate({
        where: { name: p.name },
        defaults: p
      });
      console.log(`✅ Program Seeded: ${p.name}`);
    }

    console.log('🌟 Academic Seeding COMPLETED!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding FAILED:', error);
    process.exit(1);
  }
};

seedAcademicData();
