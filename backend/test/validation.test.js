const test = require('node:test');
const assert = require('node:assert/strict');
const { requiredText, positiveInteger, recordId } = require('../src/utils/validation');

test('requiredText trims valid text', () => {
  assert.equal(requiredText('  Ana Torres  ', 'nombre', 120), 'Ana Torres');
});

test('requiredText rejects blank text', () => {
  assert.throws(() => requiredText(' ', 'nombre', 120), { status: 400, code: 'VALIDATION_ERROR' });
});

test('positiveInteger accepts a valid semester', () => {
  assert.equal(positiveInteger('8', 'semestre', 20), 8);
});

test('positiveInteger rejects values outside range', () => {
  assert.throws(() => positiveInteger(0, 'semestre', 20), { status: 400, code: 'VALIDATION_ERROR' });
  assert.throws(() => positiveInteger('abc', 'semestre', 20), { status: 400, code: 'VALIDATION_ERROR' });
});

test('recordId rejects invalid identifiers', () => {
  assert.throws(() => recordId('-1', 'estudianteId'), { status: 400, code: 'VALIDATION_ERROR' });
});
