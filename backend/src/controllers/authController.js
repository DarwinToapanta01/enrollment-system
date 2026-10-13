const service = require('../services/authService');

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api',
  maxAge: 2 * 60 * 60 * 1000,
});

async function register(req, res) {
  const result = await service.register(req.body);
  res.cookie('access_token', result.token, cookieOptions());
  res.status(201).json({ user: result.user, mensaje: 'Cuenta de estudiante creada correctamente.' });
}

async function login(req, res) {
  const result = await service.login(req.body);
  res.cookie('access_token', result.token, cookieOptions());
  res.json({ user: result.user, mensaje: 'Inicio de sesión correcto.' });
}

async function me(req, res) { res.json(await service.getCurrentUser(req.auth.userId)); }

function logout(req, res) {
  res.clearCookie('access_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/api' });
  res.status(204).end();
}

module.exports = { register, login, me, logout };
