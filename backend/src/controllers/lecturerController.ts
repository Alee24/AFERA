import { Request, Response } from 'express';
import { Staff, Class, CourseUnit, Student, CourseRegistration, Attendance, Assessment, Grade, User, Course } from '../models';

export const getLecturerDashboard = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    let staff = await Staff.findOne({ where: { user_id: userId } });
    if (!staff) {
      staff = await Staff.create({
        user_id: userId,
        staff_number: 'STF' + Math.floor(1000 + Math.random() * 9000),
        position: 'LECTURER'
      });
    }

    let classes = await Class.findAll({
      where: { lecturer_id: staff.id },
      include: [
        { model: CourseUnit, include: [{ model: Course }] }
      ]
    });

    if (classes.length === 0) {
      let unit = await CourseUnit.findOne();
      if (!unit) {
        const course = await Course.findOne();
        if (course) {
          unit = await CourseUnit.create({
            course_id: course.id,
            name: 'Introduction to Infrastructure Management',
            semester: 1
          });
        }
      }
      
      if (unit) {
        await Class.create({
          course_unit_id: unit.id,
          lecturer_id: staff.id,
          academic_year: '2026',
          semester: 1,
          schedule: 'Mondays 10:00 AM'
        });
        
        classes = await Class.findAll({
          where: { lecturer_id: staff.id },
          include: [{ model: CourseUnit, include: [{ model: Course }] }]
        });
      }
    }

    // Stats
    const classIds = classes.map(c => c.id);
    const studentsCount = classIds.length > 0 ? await CourseRegistration.count({ where: { class_id: classIds } }) : 0;
    const assessmentsCount = classIds.length > 0 ? await Assessment.count({ where: { class_id: classIds } }) : 0;

    res.json({
      staff,
      classes,
      stats: {
        totalClasses: classes.length,
        totalStudents: studentsCount,
        totalAssessments: assessmentsCount
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getLecturerClasses = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    let staff = await Staff.findOne({ where: { user_id: userId } });
    if (!staff) {
      // Auto-create staff if missing
      staff = await Staff.create({
        user_id: userId,
        staff_number: 'STF' + Math.floor(1000 + Math.random() * 9000),
        position: 'LECTURER'
      });
    }

    let classes = await Class.findAll({
      where: { lecturer_id: staff.id },
      include: [{ 
        model: CourseUnit, 
        include: [{ model: Course }] 
      }]
    });

    if (classes.length === 0) {
      const unit = await CourseUnit.findOne();
      if (unit) {
        await Class.create({
          course_unit_id: unit.id,
          lecturer_id: staff.id,
          academic_year: '2026',
          semester: 1,
          schedule: 'Mondays 10:00 AM'
        });
        
        classes = await Class.findAll({
          where: { lecturer_id: staff.id },
          include: [{ 
            model: CourseUnit, 
            include: [{ model: Course }] 
          }]
        });
      }
    }
    
    res.json(classes);
  } catch (error: any) {
    console.error('getLecturerClasses error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getClassStudents = async (req: any, res: Response) => {
  try {
    const { classId } = req.params;
    let registrations = await CourseRegistration.findAll({
      where: { class_id: classId },
      include: [{ model: Student, include: [{ model: User }] }]
    });
    
    if (registrations.length === 0) {
      const allStudents = await Student.findAll({
        include: [{ model: User }]
      });
      return res.json(allStudents);
    }
    
    res.json(registrations.map(r => r.Student));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const markAttendance = async (req: any, res: Response) => {
  try {
    const { class_id, date, records } = req.body; // records: [{student_id, status}]
    
    const attendancePromises = records.map((rec: any) => 
      Attendance.upsert({
        class_id,
        student_id: rec.student_id,
        date,
        status: rec.status
      })
    );

    await Promise.all(attendancePromises);
    res.json({ message: 'Attendance marked successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVirtualLink = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;
    const { virtual_link } = req.body;
    
    const cls = await Class.findByPk(classId as string);
    if (!cls) return res.status(404).json({ message: 'Class not found' });
    
    await cls.update({ virtual_link });
    res.json({ message: 'Virtual classroom updated successfully!', data: cls });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
