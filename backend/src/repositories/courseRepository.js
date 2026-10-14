const db = require('../config/database');

async function findByCareerAndSemester(career, semester) {
  const { rows } = await db.query(`
    SELECT c.id, c.nombre, c.docente, c.carrera, c.semestre, c.cupos,
           GREATEST(c.cupos - COUNT(m.id)::int, 0) AS "cuposDisponibles"
    FROM cursos c LEFT JOIN matriculas m ON m.curso_id = c.id
    WHERE c.carrera = $1 AND c.semestre = $2
    GROUP BY c.id
    ORDER BY c.id`, [career, semester]);
  return rows;
}

async function findById(id) {
  const { rows } = await db.query('SELECT id, nombre, docente, carrera, semestre, cupos FROM cursos WHERE id = $1', [id]);
  return rows[0] || null;
}

async function create(course) {
  const { rows } = await db.query(
    'INSERT INTO cursos (nombre, docente, carrera, semestre, cupos) VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, docente, carrera, semestre, cupos',
    [course.nombre, course.docente, course.carrera, course.semestre, course.cupos],
  );
  return rows[0];
}

module.exports = { findByCareerAndSemester, findById, create };
