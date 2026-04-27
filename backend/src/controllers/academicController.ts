import { Request, Response } from 'express';
import { Faculty, Department, Program, Grade, Assessment, Student, Course, CourseUnit, Class } from '../models';

// ===== FACULTIES =====
export const getFaculties = async (req: Request, res: Response) => {
  try {
    const faculties = await Faculty.findAll({
      include: [{ 
        model: Department,
        include: [Program]
      }]
    });
    res.json(faculties);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createFaculty = async (req: Request, res: Response) => {
  try {
    const faculty = await Faculty.create(req.body);
    res.status(201).json(faculty);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateFaculty = async (req: Request, res: Response) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id as string);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    await faculty.update(req.body);
    res.json(faculty);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteFaculty = async (req: Request, res: Response) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id as string);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    await faculty.destroy();
    res.json({ message: 'Faculty deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ===== DEPARTMENTS =====
export const createDepartment = async (req: Request, res: Response) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json(department);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const department = await Department.findByPk(req.params.id as string);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    await department.destroy();
    res.json({ message: 'Department deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ===== PROGRAMS =====
export const createProgram = async (req: Request, res: Response) => {
  try {
    const program = await Program.create(req.body);
    res.status(201).json(program);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// ===== GRADES & TRANSCRIPTS =====
export const getMyGrades = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const grades = await Grade.findAll({
      where: { student_id: student.id },
      include: [{
        model: Assessment,
        include: [{
          model: Class,
          include: [{
            model: CourseUnit,
            include: [Course]
          }]
        }]
      }],
      order: [['created_at', 'DESC']]
    });

    res.json(grades);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const generateTranscript = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const student = await Student.findOne({ 
      where: { user_id: userId },
      include: ['User']
    });
    
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const grades = await Grade.findAll({
      where: { student_id: student.id },
      include: [{
        model: Assessment,
        include: [{
          model: Class,
          include: [{
            model: CourseUnit,
            include: [Course]
          }]
        }]
      }]
    });

    // Simplify for transcript
    const transcriptData = {
      student_name: `${(student as any).User.first_name} ${(student as any).User.last_name}`,
      admission_number: student.admission_number,
      generated_at: new Date(),
      grades: grades.map((g: any) => ({
        course_code: g.Assessment?.Class?.CourseUnit?.Course?.course_code || 'N/A',
        course_name: g.Assessment?.Class?.CourseUnit?.Course?.title_en || 'N/A',
        unit_name: g.Assessment?.Class?.CourseUnit?.name || 'N/A',
        score: g.score,
        grade: g.grade,
        credits: g.Assessment?.Class?.CourseUnit?.Course?.credits || 3
      }))
    };

    res.json(transcriptData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentGrades = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const grades = await Grade.findAll({
      where: { student_id: studentId },
      include: [{
        model: Assessment,
        include: [{
          model: Class,
          include: [{
            model: CourseUnit,
            include: [Course]
          }]
        }]
      }]
    });
    res.json(grades);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const upsertGrade = async (req: Request, res: Response) => {
  try {
    const { student_id, assessment_id, score, grade, remarks } = req.body;
    
    const [gradeRecord, created] = await Grade.findOrCreate({
      where: { student_id, assessment_id },
      defaults: { score, grade, remarks }
    });

    if (!created) {
      await gradeRecord.update({ score, grade, remarks });
    }

    res.json(gradeRecord);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getFullAcademicStructure = async (req: Request, res: Response) => {
  try {
    const structure = await Program.findAll({
      include: [{
        model: Course,
        include: [{
          model: CourseUnit,
          include: [{
            model: Class
          }]
        }]
      }]
    });
    res.json(structure);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAssessmentsByClass = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;
    const assessments = await Assessment.findAll({ where: { class_id: classId } });
    res.json(assessments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createAssessment = async (req: Request, res: Response) => {
  try {
    const assessment = await Assessment.create(req.body);
    res.status(201).json(assessment);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
