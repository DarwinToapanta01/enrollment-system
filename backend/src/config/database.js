const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  throw new Error('Falta la variable de entorno DATABASE_URL. Configúrala en backend/.env.');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on('error', (error) => {
  console.error('Error inesperado en el pool de PostgreSQL:', error.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
