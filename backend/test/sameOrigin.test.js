const test = require('node:test');
const assert = require('node:assert/strict');
const requireSameOrigin = require('../src/middleware/requireSameOrigin');

function run(origin, method = 'POST') {
  const req = { method, get: (name) => name.toLowerCase() === 'origin' ? origin : undefined };
  let error = null;
  let continued = false;
  requireSameOrigin(req, {}, (value) => { error = value || null; continued = !value; });
  return { error, continued };
}

test('same-origin middleware accepts the configured frontend origin', () => {
  process.env.FRONTEND_ORIGIN = 'http://localhost:5173';
  assert.equal(run('http://localhost:5173').continued, true);
});

test('same-origin middleware rejects missing and foreign origins on writes', () => {
  assert.equal(run(undefined).error.status, 403);
  assert.equal(run('https://attacker.example').error.code, 'ORIGIN_NOT_ALLOWED');
});

test('same-origin middleware lets safe methods pass', () => {
  assert.equal(run(undefined, 'GET').continued, true);
});
