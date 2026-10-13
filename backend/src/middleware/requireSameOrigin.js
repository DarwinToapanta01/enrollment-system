const HttpError = require('../utils/httpError');

module.exports = function requireSameOrigin(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const expected = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
  const origin = req.get('origin');
  if (!origin || origin !== expected) {
    return next(new HttpError(403, 'Origen de la solicitud no permitido.', 'ORIGIN_NOT_ALLOWED'));
  }
  return next();
};
