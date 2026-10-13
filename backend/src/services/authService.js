const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const repository = require('../repositories/authRepository');
const { requiredText, positiveInteger } = require('../utils/validation');
const HttpError = require('../utils/httpError');
const { validateEmail, validatePassword } = require('../utils/authValidation');

const CARRERAS_PERMITIDAS = [
  'Ing en Tecnologías de la Información',
  'Ing en Software',
  'Ing en Biotecnología',
];

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET debe configurarse con al menos 32 caracteres.');
  }
  return secret;
}

function publicUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

function createToken(user) {
  return jwt.sign(
    { studentId: String(user.estudianteId), role: user.rol },
    getJwtSecret(),
    { subject: String(user.id), expiresIn: '2h', issuer: 'matricula-universitaria' }
  );
}

async function register(input = {}) {
  getJwtSecret();
  const nombre = requiredText(input.nombre, 'nombre', 120);

  const carrera = requiredText(input.carrera, 'carrera', 160);

  if (!CARRERAS_PERMITIDAS.includes(carrera)) {
    throw new HttpError(
      400,
      'La carrera seleccionada no está permitida.',
      'INVALID_CAREER'
    );
  }

  const semestre = positiveInteger(input.semestre, 'semestre', 9);
  const email = validateEmail(input.email);
  const password = validatePassword(input.password);
  if (await repository.findByEmail(email)) {
    throw new HttpError(409, 'Ya existe una cuenta con ese correo electrónico.', 'EMAIL_EXISTS');
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await repository.createStudentAccount({ nombre, carrera, semestre, email, passwordHash });
  return { user, token: createToken(user) };
}

async function login(input = {}) {
  getJwtSecret();
  const email = validateEmail(input.email);
  const password = typeof input.password === 'string' ? input.password : '';
  const user = await repository.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new HttpError(401, 'Correo o contraseña incorrectos.', 'INVALID_CREDENTIALS');
  }
  return { user: publicUser(user), token: createToken(user) };
}

async function getCurrentUser(id) {
  const user = await repository.findPublicById(id);
  if (!user) throw new HttpError(401, 'La cuenta ya no está disponible.', 'ACCOUNT_NOT_FOUND');
  return user;
}

module.exports = { register, login, getCurrentUser };
