const service = require('../services/courseService');
const studentRepository = require('../repositories/studentRepository');
const HttpError = require('../utils/httpError');

async function list(req, res) {
  const student = await studentRepository.findById(req.auth.studentId);
  if (!student) throw new HttpError(404, 'No se encontrÃ³ el perfil de estudiante.', 'STUDENT_NOT_FOUND');
  res.json(await service.listCourses(student.carrera, student.semestre));
}
async function create(req, res) { res.status(201).json(await service.createCourse(req.body)); }

module.exports = { list, create };
