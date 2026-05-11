const { Program, Course, CourseUnit, Class } = require('./src/models');
const { Sequelize } = require('sequelize');

async function test() {
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
    console.log("Success!", structure.length);
  } catch (e) {
    console.error("Error:", e.message);
  }
}

test();
