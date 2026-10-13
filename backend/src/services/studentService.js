const repository = require('../repositories/studentRepository');
const { requiredText, positiveInteger } = require('../utils/validation');

async function listStudents() { return repository.findAll(); }

async function createStudent(input = {}) {
  const student = {
    nombre: requiredText(input.nombre, 'nombre', 120),
    carrera: requiredText(input.carrera, 'carrera', 160),
    semestre: positiveInteger(input.semestre, 'semestre', 20),
  };
  return repository.create(student);
}

module.exports = { listStudents, createStudent };
