const repository = require('../repositories/courseRepository');
const { requiredText, positiveInteger } = require('../utils/validation');

async function listCourses() { return repository.findAll(); }

async function createCourse(input = {}) {
  const course = {
    nombre: requiredText(input.nombre, 'nombre', 160),
    docente: requiredText(input.docente, 'docente', 120),
    cupos: positiveInteger(input.cupos, 'cupos', 10000),
  };
  return repository.create(course);
}

module.exports = { listCourses, createCourse };
