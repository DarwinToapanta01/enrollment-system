require('dotenv').config();
const app = require('./app');
const { pool } = require('./config/database');
const port = Number(process.env.PORT) || 3000;

const server = app.listen(port, () => {
  console.log(`API de Matrícula Universitaria disponible en http://localhost:${port}`);
});

async function shutdown(signal) {
  console.log(`\n${signal} recibido. Cerrando servidor...`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
