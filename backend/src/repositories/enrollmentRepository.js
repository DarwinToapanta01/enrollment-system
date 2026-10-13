const db = require('../config/database');

async function findAll() {
  const { rows } = await db.query(`
    SELECT m.id, m.estudiante_id AS "estudianteId", m.curso_id AS "cursoId",
           e.nombre AS estudiante, c.nombre AS curso
    FROM matriculas m JOIN estudiantes e ON e.id = m.estudiante_id
    JOIN cursos c ON c.id = m.curso_id ORDER BY m.id`);
  return rows;
}

async function findByStudent(studentId) {
  const { rows } = await db.query(`
    SELECT m.id, m.estudiante_id AS "estudianteId", m.curso_id AS "cursoId",
           c.nombre AS curso, c.docente, m.creado_en AS "fechaMatricula"
    FROM matriculas m JOIN cursos c ON c.id = m.curso_id
    WHERE m.estudiante_id = $1 ORDER BY m.creado_en DESC`, [studentId]);
  return rows;
}

async function exists(studentId, courseId) {
  const { rows } = await db.query('SELECT id FROM matriculas WHERE estudiante_id = $1 AND curso_id = $2', [studentId, courseId]);
  return rows.length > 0;
}

async function hasCapacity(courseId) {
  const { rows } = await db.query(`SELECT c.cupos, COUNT(m.id)::int AS matriculados FROM cursos c LEFT JOIN matriculas m ON m.curso_id = c.id WHERE c.id = $1 GROUP BY c.id`, [courseId]);
  return rows[0] ? Number(rows[0].matriculados) < Number(rows[0].cupos) : false;
}

async function create(studentId, courseId) {
  const { rows } = await db.query('INSERT INTO matriculas (estudiante_id, curso_id) VALUES ($1, $2) RETURNING id, estudiante_id AS "estudianteId", curso_id AS "cursoId"', [studentId, courseId]);
  return rows[0];
}

async function report() {
  const { rows } = await db.query(`
    SELECT e.id, e.nombre AS estudiante, e.carrera,
      COALESCE(array_agg(c.nombre ORDER BY c.nombre) FILTER (WHERE c.id IS NOT NULL), ARRAY[]::varchar[]) AS cursos
    FROM estudiantes e LEFT JOIN matriculas m ON m.estudiante_id = e.id
    LEFT JOIN cursos c ON c.id = m.curso_id GROUP BY e.id, e.nombre, e.carrera ORDER BY e.id`);
  return rows;
}

module.exports = { findAll, findByStudent, exists, hasCapacity, create, report };
