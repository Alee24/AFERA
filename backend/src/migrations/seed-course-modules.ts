import { Course, CourseModule, ModuleContent } from '../models';
import sequelize from '../config/database';

const seedCourseModules = async () => {
  try {
    await sequelize.authenticate();
    console.log('🚀 Seeding Course Modules...');

    // Find Master's Course
    const masterCourse = await Course.findOne({
      where: { title_en: 'Specialized Master’s Degree in Resource Mobilization, Financing and Maintenance' }
    });

    if (masterCourse) {
      console.log(`Found Master's Course (ID: ${masterCourse.id})`);
      const masterModules = [
        {
          order: 1,
          title_en: 'Governance & Institutional Frameworks',
          duration_weeks: 16,
          description_en: 'Road infrastructure governance, legal frameworks, and transport economics.'
        },
        {
          order: 2,
          title_en: 'Resource Mobilization & Financing',
          duration_weeks: 16,
          description_en: 'PPPs, innovative financing (Fintech, Green Funds), and donor engagement.'
        },
        {
          order: 3,
          title_en: 'Maintenance, Technology & Sustainability',
          duration_weeks: 16,
          description_en: 'Climate resilience, Asset Management Systems (HDM-4), and field visits.'
        },
        {
          order: 4,
          title_en: 'Research & Professional Project',
          duration_weeks: 16,
          description_en: 'Master’s dissertation and oral defense before an expert jury.'
        }
      ];

      for (const m of masterModules) {
        const [modRecord, created] = await CourseModule.findOrCreate({
          where: { course_id: masterCourse.id, title_en: m.title_en },
          defaults: {
            course_id: masterCourse.id,
            title_en: m.title_en,
            description_en: m.description_en,
            order: m.order,
            duration_weeks: m.duration_weeks
          }
        });
        
        if (created) {
          console.log(`✅ Seeded Master Module ${m.order}: ${m.title_en}`);
          // Seed some contents for Module 1
          if (m.order === 1) {
            await ModuleContent.create({
              module_id: modRecord.id,
              type: 'document',
              title: 'Module 1 Course Guide',
              content_en: 'Course overview and outline for Governance & Institutional Frameworks.',
              file_url: '/PRESENTATIONvf1_TREPP2026_Dr Ali Alkassoum - SE-AFERA (1).pdf',
              order: 1
            });
            await ModuleContent.create({
              module_id: modRecord.id,
              type: 'document',
              title: 'Lecture Slides: Road Infrastructure Policy',
              content_en: 'Introductory slides covering policy and legal frameworks.',
              file_url: '/PRESENTATION fv1_TREPP2026_Dr Ali Alkassoum - ES (1).pdf',
              order: 2
            });
          }
        }
      }
    } else {
      console.log('⚠️ Master Course not found. Make sure the database is seeded.');
    }

    // Find RBM Certificate Course
    const rbmCourse = await Course.findOne({
      where: { title_en: 'Specialist Certification in Results-Based Management (RBM)' }
    });

    if (rbmCourse) {
      console.log(`Found RBM Course (ID: ${rbmCourse.id})`);
      const rbmModules = [
        { order: 1, title_en: 'RBM Foundations', duration_weeks: 2, description_en: 'Core concepts, historical context, and the shift from inputs to results.' },
        { order: 2, title_en: 'Situational & Stakeholder Analysis', duration_weeks: 2, description_en: 'Identifying gaps and mapping the road maintenance ecosystem.' },
        { order: 3, title_en: 'Logical Frameworks & Results Chains', duration_weeks: 2, description_en: 'Building the visual map of impact and accountability.' },
        { order: 4, title_en: 'Risk Management', duration_weeks: 1, description_en: 'Mitigating internal and external threats to infrastructure goals.' },
        { order: 5, title_en: 'Operational Planning', duration_weeks: 2, description_en: 'Translating high-level strategy into actionable work plans.' },
        { order: 6, title_en: 'Performance Indicators (SMART)', duration_weeks: 2, description_en: 'Designing data-driven metrics for road quality and funding.' },
        { order: 7, title_en: 'Monitoring & Evaluation Systems', duration_weeks: 2, description_en: 'Techniques for real-time tracking and strategic reporting.' },
        { order: 8, title_en: 'RBM Implementation (Residential)', duration_weeks: 1, description_en: 'Final project presentation and networking seminar in person.' }
      ];

      for (const m of rbmModules) {
        const [modRecord, created] = await CourseModule.findOrCreate({
          where: { course_id: rbmCourse.id, title_en: m.title_en },
          defaults: {
            course_id: rbmCourse.id,
            title_en: m.title_en,
            description_en: m.description_en,
            order: m.order,
            duration_weeks: m.duration_weeks
          }
        });

        if (created) {
          console.log(`✅ Seeded RBM Module ${m.order}: ${m.title_en}`);
          if (m.order === 1) {
            await ModuleContent.create({
              module_id: modRecord.id,
              type: 'document',
              title: 'Module 1 Course Guide: RBM Core Concepts',
              content_en: 'Course syllabus and reading list for RBM Foundations.',
              file_url: '/PRESENTATIONvf1_TREPP2026_Dr Ali Alkassoum - SE-AFERA (1).pdf',
              order: 1
            });
          }
        }
      }
    } else {
      console.log('⚠️ RBM Course not found.');
    }

    console.log('🌟 Seeding Completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedCourseModules();
