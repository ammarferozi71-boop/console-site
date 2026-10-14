import { test } from 'node:test';
import assert from 'node:assert/strict';
import { monthlyEquivalent, comparePlans, yearlySaving, regions } from '../lib/tools/subs.mjs';

const rows = [
  { id: 1, service: 'Service A', tier: 'Top', region: 'US', price: 20, currency: 'USD', period: 'month', perks: ['Online play', 'Game catalogue'] },
  { id: 2, service: 'Service A', tier: 'Basic', region: 'US', price: 10, currency: 'USD', period: 'month', perks: ['Online play'] },
  { id: 3, service: 'Service B', tier: 'Plus', region: 'US', price: 120, currency: 'USD', period: 'year', perks: ['Online play', 'Game catalogue'] },
  { id: 4, service: 'Service B', tier: 'Plus', region: 'US', price: 15, currency: 'USD', period: 'month', perks: ['Online play', 'Game catalogue'] },
  { id: 5, service: 'Service A', tier: 'Top', region: 'UK', price: 15, currency: 'GBP', period: 'month', perks: ['Online play'] },
];

test('monthly equivalent', () => {
  assert.equal(monthlyEquivalent(rows[2]), 10);
  assert.equal(monthlyEquivalent({ id: 9, price: 29.99, period: 'quarter' }), 10);
  assert.throws(() => monthlyEquivalent({ id: 9, price: 5, period: 'week' }));
});

test('plans compared within one region, cheapest first, best billing period chosen', () => {
  const plans = comparePlans(rows, 'US');
  assert.deepEqual(plans.map((p) => `${p.service} ${p.tier}`), ['Service A Basic', 'Service B Plus', 'Service A Top']);
  assert.equal(plans[1].best.period, 'year');
});

test('must-have perk filter', () => {
  const plans = comparePlans(rows, 'US', { mustHave: ['catalogue'] });
  assert.ok(plans.every((p) => p.perks.some((x) => /catalogue/i.test(x))));
  assert.equal(plans.length, 2);
});

test('regions never mix and mixed currencies in one region throw', () => {
  assert.equal(comparePlans(rows, 'UK').length, 1);
  assert.throws(() => comparePlans([...rows, { ...rows[0], id: 6, currency: 'CAD' }], 'US'));
  assert.deepEqual(regions(rows), ['UK', 'US']);
});

test('yearly saving', () => {
  assert.equal(yearlySaving(rows, 'Service B', 'Plus', 'US'), 60);
  assert.equal(yearlySaving(rows, 'Service A', 'Top', 'US'), null);
});
