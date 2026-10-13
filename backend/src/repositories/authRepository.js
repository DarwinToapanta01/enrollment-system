const db = require('../config/database');

async function findByEmail(email) {
  const { rows } = await db.query(
    `SELECT u.id, u.estudiante_id AS "estudianteId", u.email, u.password_hash AS "passwordHash", u.rol,
            e.nombre, e.carrera, e.semestre
     FROM usuarios u JOIN estudiantes e ON e.id = u.estudiante_id WHERE u.email = $1`, [email]);
  return rows[0] || null;
}

async function findPublicById(id) {
  const { rows } = await db.query(
    `SELECT u.id, u.estudiante_id AS "estudianteId", u.email, u.rol,
            e.nombre, e.carrera, e.semestre
     FROM usuarios u JOIN estudiantes e ON e.id = u.estudiante_id WHERE u.id = $1`, [id]);
  return rows[0] || null;
}

async function createStudentAccount({ nombre, carrera, semestre, email, passwordHash }) {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const student = await client.query(
      'INSERT INTO estudiantes (nombre, carrera, semestre) VALUES ($1, $2, $3) RETURNING id',
      [nombre, carrera, semestre]);
    const studentId = student.rows[0].id;
    const user = await client.query(
      `INSERT INTO usuarios (estudiante_id, email, password_hash, rol)
       VALUES ($1, $2, $3, 'ESTUDIANTE')
       RETURNING id, estudiante_id AS "estudianteId", email, rol`,
      [studentId, email, passwordHash]);
    await client.query('COMMIT');
    return { ...user.rows[0], nombre, carrera, semestre };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { findByEmail, findPublicById, createStudentAccount };
