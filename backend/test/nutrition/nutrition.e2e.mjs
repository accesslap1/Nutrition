import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';

const baseUrl = `http://127.0.0.1:${process.env.PORT ?? 8000}/api/v1`;
const server = spawn(process.execPath, ['dist/src/main.js'], {
  cwd: process.cwd(),
  env: process.env,
  stdio: ['ignore', 'pipe', 'pipe'],
});

let serverOutput = '';
server.stdout.on('data', (chunk) => { serverOutput += chunk.toString(); });
server.stderr.on('data', (chunk) => { serverOutput += chunk.toString(); });

try {
  await waitForServer();

  const auth = await api('/register', {
    method: 'POST',
    body: {
      name: 'Nutrition E2E',
      email: `nutrition-e2e-${randomUUID()}@example.test`,
      password: 'strong-password',
      passwordConfirmation: 'strong-password',
    },
  });
  assert.ok(auth.accessToken);
  const headers = { authorization: `Bearer ${auth.accessToken}` };

  const food = await api('/nutrition/foods', {
    method: 'POST',
    headers,
    body: {
      name: 'Integration oats',
      brand: 'E2E',
      calories_per_100g: 250,
      protein_per_100g: 12.5,
      carbs_per_100g: 40,
      fat_per_100g: 5,
    },
  });
  assert.ok(food.id);

  const foods = await api('/nutrition/foods?search=Integration', { headers });
  assert.ok(foods.some((candidate) => candidate.id === food.id));

  const meal = await api('/nutrition/meals', {
    method: 'POST',
    headers,
    body: { food_id: food.id, meal_type: 'breakfast', quantity_g: 37.5 },
  });
  assert.deepEqual(
    { calories: meal.calories, protein: meal.protein, carbs: meal.carbs, fat: meal.fat },
    { calories: 93.75, protein: 4.69, carbs: 15, fat: 1.88 },
  );

  const mealsToday = await api('/nutrition/meals/today', { headers });
  assert.deepEqual(mealsToday.totals, { calories: 93.75, protein: 4.69, carbs: 15, fat: 1.88 });
  assert.equal(mealsToday.logs.length, 1);
  assert.equal(mealsToday.logs[0].id, meal.id);

  await api('/nutrition/water', { method: 'POST', headers, body: { amount_ml: 750 } });
  const waterToday = await api('/nutrition/water/today', { headers });
  assert.equal(waterToday.total_ml, 750);
  assert.equal(waterToday.total_L, 0.75);

  await api(`/nutrition/meals/${meal.id}`, { method: 'DELETE', headers });
  const emptyDay = await api('/nutrition/meals/today', { headers });
  assert.deepEqual(emptyDay.totals, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  assert.deepEqual(emptyDay.logs, []);

  console.log('Nutrition production API verification passed');
} catch (error) {
  if (serverOutput) console.error(serverOutput);
  throw error;
} finally {
  server.kill('SIGTERM');
}

async function waitForServer() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Backend exited before becoming ready (${server.exitCode})`);
    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('Backend did not become ready within 30 seconds');
}

async function api(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : undefined;
  assert.ok(response.ok, `${options.method ?? 'GET'} ${path} returned ${response.status}: ${text}`);
  return payload;
}
