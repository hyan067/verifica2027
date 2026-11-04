import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePerCapita, generateEligibilityReport, INCOME_LIMIT_BRL } from '../src/lib/eligibilityLogic.js';
const profile = (data = {}) => ({ familySize: 4, monthlyIncome: 800, children: 2, registryStatus: 'updated', informationChanged: false, ...data });
test('calcula renda per capita por família', () => { assert.equal(calculatePerCapita(800, 4), 200); assert.equal(calculatePerCapita(10, 0), null); });
test('família de uma pessoa pode estar abaixo do limite', () => { const result = generateEligibilityReport(profile({ familySize: 1, monthlyIncome: 100, children: 0 })); assert.equal(result.status, 'aligned'); assert.equal(result.withinIncomeLimit, true); });
test('valor exatamente igual ao limite está dentro da regra de renda', () => { assert.equal(generateEligibilityReport(profile({ monthlyIncome: 4 * INCOME_LIMIT_BRL })).status, 'aligned'); });
test('registro desatualizado resulta em atenção', () => { assert.equal(generateEligibilityReport(profile({ registryStatus: 'outdated' })).status, 'review'); });
test('renda acima do limite é sinalizada', () => { assert.equal(generateEligibilityReport(profile({ monthlyIncome: 1000 })).status, 'aboveLimit'); });
