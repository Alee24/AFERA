import { Course, Program, Department, Faculty, User } from './models';
import sequelize from './models';
import bcrypt from 'bcryptjs';

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established for seeding.');

    // 0. Create Default Admin
    const adminPassword = 'Admin123!';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const [userRecord, created] = await User.findOrCreate({
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

    if (!created) {
      await userRecord.update({ password_hash: hashedPassword });
    }
    console.log(`👤 Default admin updated/created: admin@aferainnov.africa / ${adminPassword}`);

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
        title_en: 'Specialized Master’s Degree in Resource Mobilization, Financing and Maintenance',
        title_fr: 'Master Spécialisé en Mobilisation de Ressources, Financement et Maintenance',
        title_pt: 'Mestrado Especializado em Mobilização de Recursos, Financiamento e Manutenção',
        title_sw: 'Shahada ya Uzamili ya Kitaalamu katika Ukusanyaji wa Rasilimali na Ufadhili',
        description_en: 'A high-level postgraduate programme designed to develop elite professionals capable of transforming road infrastructure systems.',
        description_fr: 'Un programme de troisième cycle de haut niveau conçu pour former des professionnels d\'élite.',
        description_pt: 'Um programa de pós-graduação de alto nível concebido para desenvolver profissionais de elite.',
        description_sw: 'Mpango wa kiwango cha juu wa uzamili ulioundwa ili kuendeleza wataalamu wasomi.',
        price: 0,
        duration: '2 Years',
        modality: 'Hybrid',
        department: 'Infrastructure',
        course_type: 'Master Degree',
        program_id: program.id,
        course_code: 'INF-501'
      },
      {
        title_en: 'Specialist Certification in Results-Based Management (RBM)',
        title_fr: 'Certification de spécialiste en gestion axée sur les résultats (GAR)',
        title_pt: 'Certificação de Especialista em Gestão Baseada em Resultados (RBM)',
        title_sw: 'Udhibitisho wa Mtaalam katika Usimamizi Unaozingatia Matokeo (RBM)',
        description_en: 'Equipping road sector professionals with practical RBM tools for performance and accountability across Africa.',
        description_fr: 'Équiper les professionnels du secteur routier d\'outils GAR pratiques pour la performance et la responsabilité.',
        description_pt: 'Equipar profissionais do sector rodoviário com ferramentas RBM práticas para o desempenho.',
        description_sw: 'Kuandaa wataalamu wa sekta ya barabara na zana za RBM za vitendo kwa utendaji.',
        price: 0,
        duration: '13 Weeks',
        modality: 'Hybrid',
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
