import { Request, Response } from 'express';
import { Staff, Class, CourseUnit, Student, CourseRegistration, Attendance, Assessment, Grade, User } from '../models';

export const getLecturerDashboard = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const staff = await Staff.findOne({ where: { user_id: userId } });
    if (!staff) return res.status(404).json({ message: 'Lecturer profile not found' });

    const classes = await Class.findAll({
      where: { lecturer_id: staff.id },
      include: [
        { model: CourseUnit, include: [{ all: true }] }
      ]
    });

    // Stats
    const classIds = classes.map(c => c.id);
    const studentsCount = await CourseRegistration.count({ where: { class_id: classIds } });
    const assessmentsCount = await Assessment.count({ where: { class_id: classIds } });

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
    const staff = await Staff.findOne({ where: { user_id: userId } });
    const classes = await Class.findAll({
      where: { lecturer_id: staff?.id },
      include: [{ all: true, nested: true }]
    });
    res.json(classes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getClassStudents = async (req: any, res: Response) => {
  try {
    const { classId } = req.params;
    const registrations = await CourseRegistration.findAll({
      where: { class_id: classId },
      include: [{ model: Student, include: [{ model: User }] }]
    });
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
