function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error.code === '23505') {
    return res.status(409).json({ error: 'El registro ya existe.', code: 'DUPLICATE_RECORD' });
  }
  if (error.code === '23503') {
    return res.status(400).json({ error: 'La operación hace referencia a un registro inexistente o relacionado.', code: 'INVALID_REFERENCE' });
  }
  if (error.code === '23514' || error.code === '22P02') {
    return res.status(400).json({ error: 'Los datos no cumplen las restricciones requeridas.', code: 'INVALID_DATA' });
  }

  const status = Number.isInteger(error.status) ? error.status : 500;
  if (status >= 500) console.error(error);
  return res.status(status).json({
    error: status >= 500 ? 'Ocurrió un error interno. Intente nuevamente.' : error.message,
    code: error.code || 'INTERNAL_ERROR',
  });
}

module.exports = errorHandler;
