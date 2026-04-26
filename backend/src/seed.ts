import bcrypt from 'bcryptjs';
import { 
  User, 
  Course, 
  Post, 
  CourseModule, 
  Role, 
  Faculty, 
  Department, 
  Program, 
  Student, 
  Staff 
} from './models';
import sequelize from './models';

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    await sequelize.sync({ force: true });
    console.log('Database synced.');

    // ===== 1. ROLES =====
    const adminRole = await Role.create({ name: 'admin' });
    const studentRole = await Role.create({ name: 'student' });
    const lecturerRole = await Role.create({ name: 'lecturer' });
    const staffRole = await Role.create({ name: 'staff' });
    console.log('Roles created.');

    // ===== 2. ACADEMIC STRUCTURE =====
    const infrastructureFaculty = await Faculty.create({
      name: 'Faculty of Road Infrastructure & Finance',
      description: 'Focused on the development and sustainable management of African transport networks.'
    });

    const roadFinanceDept = await Department.create({
      faculty_id: infrastructureFaculty.id,
      name: 'Department of Infrastructure Finance'
    });

    const mastersProgram = await Program.create({
      department_id: roadFinanceDept.id,
      name: "Master's in Resource Mobilization and Financing",
      level: 'masters',
      duration_years: 2
    });

    const certificateProgram = await Program.create({
      department_id: roadFinanceDept.id,
      name: "Results-Based Management Certificate",
      level: 'degree', // Using degree as placeholder for professional cert
      duration_years: 1
    });

    // ===== 3. USERS =====
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({ 
      first_name: 'Global', 
      last_name: 'Admin', 
      email: 'admin@afera.edu', 
      password_hash: adminPassword, 
      role_id: adminRole.id, 
      role: 'admin',
      preferred_language: 'en' 
    });

    const lecturerPassword = await bcrypt.hash('lecturer123', 10);
    const lecturerUser = await User.create({
      first_name: 'John',
      last_name: 'Lecturer',
      email: 'lecturer@afera.edu',
      password_hash: lecturerPassword,
      role_id: lecturerRole.id
    });

    await Staff.create({
      user_id: lecturerUser.id,
      staff_number: 'STAFF001',
      position: 'Senior Lecturer',
      hire_date: '2025-01-01'
    });

    // ===== 4. COURSES =====
    
    // COURSE 1: Master's Program
    const masters = await Course.create({
      program_id: mastersProgram.id,
      course_code: 'FIN-M-701',
      course_name: "Specialized master's degree in resource Mobilization and Financing of Road Infrastructure Maintenance",
      credits: 60,
      title_en: "Specialized master's degree in resource Mobilization and Financing of Road Infrastructure Maintenance",
      title_fr: "Master Spécialisé en Mobilisation des Ressources et Financement de l'Entretien des Infrastructures Routières",
      title_pt: "Mestrado Especializado em Mobilização de Recursos e Financiamento da Manutenção de Infraestruturas Rodoviárias",
      description_en: "This advanced program is designed for senior professionals and policy makers in the transport sector. It focuses on innovative financing mechanisms, PPPs, and sustainable resource mobilization strategies specifically tailored for road infrastructure maintenance across the African continent.",
      description_fr: "Ce programme avancé est conçu pour les cadres supérieurs et les décideurs du secteur des transports. Il se concentre sur les mécanismes de financement innovants, les PPP et les stratégies de mobilisation des ressources durables.",
      description_pt: "Este programa avançado foi concebido para profissionais seniores e decisores políticos do sector dos transportes. Centra-se em mecanismos de financiamento inovadores, PPPs e estratégias de mobilização de recursos sustentáveis.",
      department: 'Infrastructure Finance',
      duration: '18 Months',
      price: 800.00,
      course_type: "Specialized Master's Degree",
      modality: 'In-House & Online Hybrid'
    });

    const mastersModules = [
      { title_en: 'Macro-economics of Transport Infrastructure', description_en: 'Analyzing the impact of road infrastructure on national and regional economic growth.', order: 1, duration_weeks: 4 },
      { title_en: 'Legal Frameworks for Public-Private Partnerships', description_en: 'Understanding the regulatory requirements for successful PPP implementations in road projects.', order: 2, duration_weeks: 6 },
      { title_en: 'Resource Mobilization & Revenue Streams', description_en: 'Exploring tolls, fuel levies, and carbon credits as sustainable funding sources.', order: 3, duration_weeks: 8 },
      { title_en: 'Strategic Asset Management', description_en: 'Optimization techniques for life-cycle maintenance of road networks.', order: 4, duration_weeks: 6 },
    ];
    for (const m of mastersModules) {
       await CourseModule.create({ 
         ...m, 
         course_id: masters.id,
         title_fr: m.title_en, title_pt: m.title_en,
         description_fr: m.description_en, description_pt: m.description_en 
       });
    }

    // COURSE 2: Certificate Program
    const certificate = await Course.create({
      program_id: certificateProgram.id,
      course_code: 'RBM-C-301',
      course_name: "Results-Based Management for Road Fund Professionals in Africa",
      credits: 30,
      title_en: "Results-Based Management for Road Fund Professionals in Africa",
      title_fr: "Certificat en Gestion Axée sur les Résultats pour les Professionnels des Fonds Routiers en Afrique",
      title_pt: "Certificado em Gestão Baseada em Resultados para Profissionais de Fundos Rodoviários em África",
      description_en: "A professional certification aimed at improving the efficiency and transparency of road fund operations. Learn how to implement KPIs, audit frameworks, and performance-based contracting to ensure every dollar spent translates into better roads.",
      description_fr: "Une certification professionnelle visant à améliorer l'efficacité et la transparence des opérations des fonds routiers. Apprenez à mettre en œuvre des indicateurs de performance clés et des cadres d'audit.",
      description_pt: "Uma certificação profissional que visa melhorar a eficiência e a transparência das operações dos fundos rodoviários. Aprenda a implementar KPIs, estruturas de auditoria e contratos baseados no desempenho.",
      department: 'Road Management',
      duration: '6 Months',
      price: 800.00,
      course_type: "Professional Certificate",
      modality: 'Online'
    });

    const certModules = [
      { title_en: 'Principles of Results-Based Management (RBM)', description_en: 'Core concepts of outcome-focused management in public sector road funds.', order: 1, duration_weeks: 4 },
      { title_en: 'Performance-Based Road Maintenance Contracts', description_en: 'Drafting and managing contracts that reward quality outcomes over simple output.', order: 2, duration_weeks: 4 },
      { title_en: 'Monitoring, Evaluation & Auditing', description_en: 'Frameworks for tracking road quality and financial accountability.', order: 3, duration_weeks: 4 },
    ];
    for (const m of certModules) {
       await CourseModule.create({ 
         ...m, 
         course_id: certificate.id,
         title_fr: m.title_en, title_pt: m.title_en,
         description_fr: m.description_en, description_pt: m.description_en 
       });
    }

    // ===== 5. BLOG POSTS =====
    await Post.create({
      title_en: 'Admissions Open for 2026 Specialized Programs',
      title_fr: 'Inscriptions Ouvertes pour les Programmes Spécialisés 2026',
      title_pt: 'Inscrições Abertas para Programas Especializados 2026',
      content_en: 'Afera University is now accepting applications for the 2026 academic year. Our specialized masters and certificates are designed for African infrastructure leaders.',
      content_fr: 'L\'Université Afera accepte maintenant les candidatures pour l\'année académique 2026.',
      content_pt: 'A Universidade Afera está aceitando inscrições para o ano acadêmico de 2026.',
      author_id: admin.id,
    });

    console.log('✅ SMS Enterprise Seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
