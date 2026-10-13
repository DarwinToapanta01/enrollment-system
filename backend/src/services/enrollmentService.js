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
  const [student, course] = await Promise.all([studentRepository.findById(studentId), courseRepository.findById(courseId)]);
  if (!student) throw new HttpError(404, 'No se encontró el perfil de estudiante.', 'STUDENT_NOT_FOUND');
  if (!course) throw new HttpError(404, 'Curso no encontrado.', 'COURSE_NOT_FOUND');
  if (await repository.exists(studentId, courseId)) throw new HttpError(409, 'Ya está matriculado en este curso.', 'DUPLICATE_ENROLLMENT');
  if (!(await repository.hasCapacity(courseId))) throw new HttpError(409, 'El curso no tiene cupos disponibles.', 'COURSE_FULL');
  const enrollment = await repository.create(studentId, courseId);
  return { ...enrollment, mensaje: 'Matrícula registrada correctamente.' };
}

async function getReport() { return repository.report(); }
module.exports = { listEnrollments, listMyEnrollments, createMyEnrollment, getReport };
