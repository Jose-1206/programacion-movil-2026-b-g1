import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../server/index.mjs';

const server = createApp();
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;

test.after(() => new Promise((resolve) => server.close(resolve)));

test('unauthenticated protected request returns 401', async () => {
  const response = await fetch(`${base}/api/checkpoints`);
  assert.equal(response.status, 401);
});

test('login + signed token allows reading and saving a checkpoint', async () => {
  const login = await fetch(`${base}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.DEMO_EMAIL || 'student@geotrail.test', password: process.env.DEMO_PASSWORD || 'GeoTrailDemo#2026' }),
  });
  assert.equal(login.status, 200);
  const { accessToken } = await login.json();
  assert.ok(accessToken.includes('.'));

  const auth = { Authorization: `Bearer ${accessToken}` };
  const empty = await fetch(`${base}/api/checkpoints`, { headers: auth });
  assert.equal(empty.status, 200);
  assert.deepEqual(await empty.json(), []);

  const save = await fetch(`${base}/api/checkpoints`, {
    method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ label: 'East trail gate', latitude: 2.9301, longitude: -75.2893, accuracy: 25 }),
  });
  assert.equal(save.status, 201);
  const item = await save.json();
  assert.equal(item.label, 'East trail gate');
  const list = await fetch(`${base}/api/checkpoints`, { headers: auth });
  assert.equal((await list.json()).length, 1);
});

test('invalid credentials and forged JWT are denied', async () => {
  const login = await fetch(`${base}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.DEMO_EMAIL || 'student@geotrail.test', password: 'wrong' }),
  });
  assert.equal(login.status, 401);
  const protectedResult = await fetch(`${base}/api/checkpoints`, {
    headers: { Authorization: 'Bearer forged.payload.signature' },
  });
  assert.equal(protectedResult.status, 401);
});
