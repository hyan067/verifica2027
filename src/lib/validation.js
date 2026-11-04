/** Validação matemática de CPF. Não consulta bases governamentais. */
export function onlyDigits(value) {
  return String(value ?? '').replace(/\D/g, '');
}

export function isValidCPF(input) {
  const cpf = onlyDigits(input);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const digitFor = (position) => {
    const sum = [...cpf.slice(0, position)].reduce(
      (total, digit, index) => total + Number(digit) * (position + 1 - index),
      0,
    );
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return digitFor(9) === Number(cpf[9]) && digitFor(10) === Number(cpf[10]);
}

export function formatCPF(value) {
  return onlyDigits(value)
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? '').trim());
}

export function validateProfile(profile) {
  const count = Number(profile.familySize);
  const income = Number(profile.monthlyIncome);
  const dependents = Number(profile.children);
  const errors = {};
  if (!Number.isInteger(count) || count < 1 || count > 30) errors.familySize = 'Informe entre 1 e 30 integrantes.';
  if (profile.monthlyIncome === '' || profile.monthlyIncome === null || profile.monthlyIncome === undefined || !Number.isFinite(income) || income < 0 || income > 100000000) errors.monthlyIncome = 'Informe uma renda mensal válida.';
  if (!Number.isInteger(dependents) || dependents < 0 || dependents > count) errors.children = 'O número de crianças não pode ultrapassar o de integrantes.';
  if (!['updated', 'outdated', 'unregistered', 'unknown'].includes(profile.registryStatus)) errors.registryStatus = 'Selecione uma opção.';
  return errors;
}
