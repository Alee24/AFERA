import { Course, Program, Department, Faculty, User } from './models';
import sequelize from './models';
import bcrypt from 'bcryptjs';

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established for seeding.');

    // 0. Create Default Admin
    const adminPassword = 'Digital2025';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await User.findOrCreate({
      where: { email: 'admin@aferainnov.africa' },
      defaults: {
        first_name: 'System',
        last_name: 'Admin',
        email: 'admin@aferainnov.africa',
        password_hash: hashedPassword,
        role: 'admin',
        status: 'active'
      }
    });
    console.log(`👤 Default admin created: admin@aferainnov.africa / ${adminPassword}`);

    // 1. Create a Faculty
    const [faculty] = await Faculty.findOrCreate({
      where: { name: 'School of Infrastructure' },
      defaults: { description: 'Specialized faculty for resource mobilization and infrastructure management.' }
    });

    // 2. Create a Department
    const [dept] = await Department.findOrCreate({
      where: { name: 'Infrastructure Management' },
      defaults: { faculty_id: faculty.id }
    });

    // 3. Create a Program
    const [program] = await Program.findOrCreate({
      where: { name: 'Masters in Resource Mobilization' },
      defaults: { 
        department_id: dept.id,
        level: 'masters',
        duration_years: 2
      }
    });

    // 4. Create some Courses
    const coursesData = [
      {
        title_en: 'Advanced Resource Mobilization',
        title_fr: 'Mobilisation des ressources avancée',
        title_pt: 'Mobilização de Recursos Avançada',
        title_sw: 'Ukusanyaji wa Rasilimali wa Juu',
        description_en: 'Master the strategies for international resource mobilization for infrastructure projects.',
        description_fr: 'Maîtriser les stratégies de mobilisation de ressources internationales pour les projets d\'infrastructure.',
        description_pt: 'Dominar as estratégias de mobilização de recursos internacionais para projetos de infraestrutura.',
        description_sw: 'Bobea katika mikakati ya ukusanyaji wa rasilimali za kimataifa kwa miradi ya miundombinu.',
        price: 1200,
        duration: '12 Months',
        modality: 'Hybrid',
        department: 'Infrastructure',
        course_type: 'Master Degree',
        program_id: program.id,
        course_code: 'INF-501'
      },
      {
        title_en: 'Results-Based Management',
        title_fr: 'Gestion axée sur les résultats',
        title_pt: 'Gestão Baseada em Resultados',
        title_sw: 'Usimamizi Unaozingatia Matokeo',
        description_en: 'Implementing results-based frameworks in public sector infrastructure development.',
        description_fr: 'Mise en œuvre de cadres axés sur les résultats dans le développement des infrastructures du secteur public.',
        description_pt: 'Implementação de estruturas baseadas em resultados no desenvolvimento de infraestruturas do sector público.',
        description_sw: 'Utekelezaji wa mifumo inayozingatia matokeo katika maendeleo ya miundombinu ya sekta ya umma.',
        price: 850,
        duration: '6 Months',
        modality: 'Online',
        department: 'Management',
        course_type: 'Certificate',
        program_id: program.id,
        course_code: 'MGT-204'
      }
    ];

    for (const course of coursesData) {
      await Course.findOrCreate({
        where: { title_en: course.title_en },
        defaults: course
      });
    }

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
