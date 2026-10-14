function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error.code === '23505') {
    if (error.constraint === 'usuarios_email_key') {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese correo electrÃ³nico.', code: 'EMAIL_EXISTS' });
    }
    if (error.constraint === 'uq_matricula_estudiante_curso') {
      return res.status(409).json({ error: 'Ya estÃ¡ matriculado en esta materia durante el semestre actual.', code: 'DUPLICATE_ENROLLMENT' });
    }
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
