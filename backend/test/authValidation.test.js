const test = require('node:test');
const assert = require('node:assert/strict');
const { validateEmail, validatePassword } = require('../src/utils/authValidation');

test('validateEmail normalizes a valid email', () => {
  assert.equal(validateEmail(' Student@Example.com '), 'student@example.com');
});

test('validateEmail rejects malformed addresses', () => {
  assert.throws(() => validateEmail('not-an-email'), { status: 400, code: 'INVALID_EMAIL' });
});

test('validatePassword accepts a password that meets policy', () => {
  assert.equal(validatePassword('StudentPass123'), 'StudentPass123');
});

test('validatePassword rejects a short or weak password', () => {
  assert.throws(() => validatePassword('Ab1short'), { status: 400, code: 'INVALID_PASSWORD' });
  assert.throws(() => validatePassword('alllowercase123'), { status: 400, code: 'WEAK_PASSWORD' });
});

test('validatePassword rejects input exceeding bcrypt byte limit', () => {
  assert.throws(() => validatePassword('Á'.repeat(40) + 'Aa1'), { status: 400, code: 'INVALID_PASSWORD' });
});
