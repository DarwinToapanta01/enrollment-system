const HttpError = require('./httpError');

function requiredText(value, field, maxLength) {
  if (typeof value !== 'string' || value.trim().length < 2 || value.trim().length > maxLength) {
    throw new HttpError(400, `El campo ${field} es obligatorio y debe contener entre 2 y ${maxLength} caracteres.`, 'VALIDATION_ERROR');
  }
  return value.trim();
}

function positiveInteger(value, field, max) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1 || number > max) {
    throw new HttpError(400, `El campo ${field} debe ser un número entero entre 1 y ${max}.`, 'VALIDATION_ERROR');
  }
  return number;
}

function recordId(value, field) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 1) {
    throw new HttpError(400, `El identificador ${field} no es válido.`, 'VALIDATION_ERROR');
  }
  return number;
}

module.exports = { requiredText, positiveInteger, recordId };
