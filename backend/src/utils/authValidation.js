const HttpError = require('./httpError');

function validateEmail(value) {
  if (typeof value !== 'string') throw new HttpError(400, 'Ingrese un correo electrónico válido.', 'INVALID_EMAIL');
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, 'Ingrese un correo electrónico válido.', 'INVALID_EMAIL');
  }
  return email;
}

function validatePassword(value) {
  const password = typeof value === 'string' ? value : '';
  if (password.length < 10 || Buffer.byteLength(password, 'utf8') > 72) {
    throw new HttpError(400, 'La contraseña debe tener al menos 10 caracteres y un máximo de 72 bytes.', 'INVALID_PASSWORD');
  }
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    throw new HttpError(400, 'La contraseña debe incluir mayúsculas, minúsculas y números.', 'WEAK_PASSWORD');
  }
  return password;
}

module.exports = { validateEmail, validatePassword };
