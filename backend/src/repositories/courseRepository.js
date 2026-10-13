const db = require('../config/database');

async function findAll() {
  const { rows } = await db.query(`SELECT c.id, c.nombre, c.docente, c.cupos, GREATEST(c.cupos - COUNT(m.id)::int, 0) AS "cuposDisponibles" FROM cursos c LEFT JOIN matriculas m ON m.curso_id = c.id GROUP BY c.id ORDER BY c.id`);
  return rows;
}

async function findById(id) {
  const { rows } = await db.query('SELECT id, nombre, docente, cupos FROM cursos WHERE id = $1', [id]);
  return rows[0] || null;
}

async function create(course) {
  const { rows } = await db.query(
    'INSERT INTO cursos (nombre, docente, cupos) VALUES ($1, $2, $3) RETURNING id, nombre, docente, cupos',
    [course.nombre, course.docente, course.cupos],
  );
  return rows[0];
}

module.exports = { findAll, findById, create };
