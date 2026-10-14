const repository = require('../repositories/enrollmentRepository');
const studentRepository = require('../repositories/studentRepository');
const courseRepository = require('../repositories/courseRepository');
const { recordId } = require('../utils/validation');
const HttpError = require('../utils/httpError');

async function listEnrollments() { return repository.findAll(); }
async function listMyEnrollments(studentId) { return repository.findByStudent(recordId(studentId, 'studentId')); }

async function createMyEnrollment(studentIdInput, input = {}) {
  const studentId = recordId(studentIdInput, 'studentId');
  const courseId = recordId(input.cursoId, 'cursoId');
  const [student, course] = await Promise.all([
    studentRepository.findById(studentId),
    courseRepository.findById(courseId),
  ]);

  if (!student) throw new HttpError(404, 'No se encontro el perfil de estudiante.', 'STUDENT_NOT_FOUND');
  if (!course) throw new HttpError(404, 'Curso no encontrado.', 'COURSE_NOT_FOUND');
  if (course.carrera !== student.carrera || Number(course.semestre) !== Number(student.semestre)) {
    throw new HttpError(409, 'Solo puede matricular materias de su semestre actual.', 'COURSE_SEMESTER_MISMATCH');
  }

  const result = await repository.create(studentId, courseId);
  if (result.status === 'DUPLICATE_ENROLLMENT') {
    throw new HttpError(409, 'Ya esta matriculado en esta materia durante el semestre actual.', 'DUPLICATE_ENROLLMENT');
  }
  if (result.status === 'COURSE_FULL') throw new HttpError(409, 'El curso no tiene cupos disponibles.', 'COURSE_FULL');
  if (result.status === 'COURSE_NOT_FOUND') throw new HttpError(404, 'Curso no encontrado.', 'COURSE_NOT_FOUND');
  return { ...result.enrollment, mensaje: 'Matricula registrada correctamente.' };
}

async function getReport() { return repository.report(); }

module.exports = { listEnrollments, listMyEnrollments, createMyEnrollment, getReport };
