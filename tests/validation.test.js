import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidCPF, formatCPF, validateProfile } from '../src/lib/validation.js';
test('CPF rejeita sequências repetidas, comprimento errado e dígito inválido', () => { assert.equal(isValidCPF('111.111.111-11'), false); assert.equal(isValidCPF('123'), false); assert.equal(isValidCPF('529.982.247-26'), false); });
test('CPF valida ambos os dígitos verificadores', () => { assert.equal(isValidCPF('529.982.247-25'), true); assert.equal(formatCPF('52998224725'), '529.982.247-25'); });
test('validação de perfil rejeita dependentes maiores do que integrantes', () => { assert.ok(validateProfile({familySize:2, monthlyIncome:100, children:3, registryStatus:'updated'}).children); });
