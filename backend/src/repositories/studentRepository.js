const db = require('../config/database');

async function findAll() {
  const { rows } = await db.query('SELECT id, nombre, carrera, semestre FROM estudiantes ORDER BY id');
  return rows;
}

async function findById(id) {
  const { rows } = await db.query('SELECT id, nombre, carrera, semestre FROM estudiantes WHERE id = $1', [id]);
  return rows[0] || null;
}

async function create(student) {
  const { rows } = await db.query(
    'INSERT INTO estudiantes (nombre, carrera, semestre) VALUES ($1, $2, $3) RETURNING id, nombre, carrera, semestre',
    [student.nombre, student.carrera, student.semestre],
  );
  return rows[0];
}

module.exports = { findAll, findById, create };
