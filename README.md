import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';

test('health endpoint works', async () => {
  const app = createApp();
  const response = await request(app).get('/api/health');
  assert.equal(response.status, 200);
  assert.equal(response.body.status, 'ok');
});

test('public home endpoint works', async () => {
  const app = createApp();
  const response = await request(app).get('/api/public/home?lang=tg');
  assert.equal(response.status, 200);
  assert.equal(response.body.brand, 'МАОРИФ ИСТИКЛОЛ');
});
