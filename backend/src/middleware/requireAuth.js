const jwt = require('jsonwebtoken');
const HttpError = require('../utils/httpError');

module.exports = function requireAuth(req, res, next) {
  const token = req.cookies?.access_token;
  if (!token) return next(new HttpError(401, 'Debe iniciar sesión para acceder a esta función.', 'AUTH_REQUIRED'));
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) return next(new Error('JWT_SECRET debe configurarse con al menos 32 caracteres.'));
  try {
    const payload = jwt.verify(token, secret, { issuer: 'matricula-universitaria', algorithms: ['HS256'] });
    if (!payload.sub || !payload.studentId || payload.role !== 'ESTUDIANTE') {
      throw new Error('Claims de autenticación inválidos.');
    }
    req.auth = { userId: payload.sub, studentId: payload.studentId, role: payload.role };
    return next();
  } catch {
    return next(new HttpError(401, 'La sesión no es válida o ha expirado. Inicie sesión nuevamente.', 'INVALID_TOKEN'));
  }
};
