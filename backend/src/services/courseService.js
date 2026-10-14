const repository = require('../repositories/courseRepository');
const { requiredText, positiveInteger } = require('../utils/validation');
const HttpError = require('../utils/httpError');

const CARRERAS_PERMITIDAS = [
  'Ing en Tecnologías de la Información',
  'Ing en Software',
  'Ing en Biotecnología',
];

function validateCareer(carrera) {
  const value = requiredText(carrera, 'carrera', 160);
  if (!CARRERAS_PERMITIDAS.includes(value)) {
    throw new HttpError(400, 'La carrera seleccionada no está permitida.', 'INVALID_CAREER');
  }
  return value;
}

async function listCourses(carrera, semestre) {
  return repository.findByCareerAndSemester(validateCareer(carrera), positiveInteger(semestre, 'semestre', 9));
}

async function createCourse(input = {}) {
  const course = {
    nombre: requiredText(input.nombre, 'nombre', 160),
    docente: requiredText(input.docente, 'docente', 120),
    carrera: validateCareer(input.carrera),
    semestre: positiveInteger(input.semestre, 'semestre', 9),
    cupos: positiveInteger(input.cupos, 'cupos', 10000),
  };
  return repository.create(course);
}

module.exports = { listCourses, createCourse };
