/**
 * Análise educativa, NÃO é uma decisão do MDS.
 * Referência consultada em 04/11/2026:
 * https://www.gov.br/pt-br/servicos/receber-o-bolsa-familia
 * https://www.gov.br/mds/pt-br/acoes-e-programas/cadastro-unico/Cadastro-unico/
 * Regras 2027 ainda precisam ser confirmadas quando publicadas.
 */
export const INCOME_LIMIT_BRL = 218;
export const CRITERIA_REFERENCE = 'Regras públicas consultadas em 04/11/2026; valores de 2027 não confirmados';

export function formatBRL(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function calculatePerCapita(monthlyIncome, familySize) {
  const income = Number(monthlyIncome);
  const count = Number(familySize);
  if (!Number.isFinite(income) || income < 0 || !Number.isInteger(count) || count < 1) return null;
  return Math.round((income / count) * 100) / 100;
}

export function generateEligibilityReport(profile) {
  const perCapita = calculatePerCapita(profile.monthlyIncome, profile.familySize);
  if (perCapita === null) throw new Error('Perfil de renda inválido.');

  const withinIncomeLimit = (Number(profile.monthlyIncome) / Number(profile.familySize)) <= INCOME_LIMIT_BRL;
  const registryNeedsAttention = profile.registryStatus !== 'updated' || Boolean(profile.informationChanged);
  const status = !withinIncomeLimit ? 'aboveLimit' : registryNeedsAttention ? 'review' : 'aligned';

  const labels = {
    aligned: 'Renda declarada dentro do limite de entrada',
    review: 'Renda compatível; cadastro precisa de atenção',
    aboveLimit: 'Renda acima do limite de entrada vigente',
  };

  const reasons = [
    `Renda mensal informada: ${formatBRL(Number(profile.monthlyIncome))} para ${profile.familySize} integrante(s).`,
    `Renda por pessoa calculada: ${formatBRL(perCapita)}. Limite de referência: ${formatBRL(INCOME_LIMIT_BRL)}.`,
    withinIncomeLimit
      ? 'A renda informada atende ao limite de entrada divulgado; isso não garante concessão.'
      : 'A renda informada supera o limite geral de entrada; existem regras de permanência específicas para quem já recebe o benefício.',
  ];

  if (profile.children > 0) reasons.push(`${profile.children} criança(s) ou adolescente(s) informada(s): os dados escolares e familiares também devem estar corretos.`);
  if (profile.registryStatus === 'outdated') reasons.push('Você indicou que o CadÚnico pode estar desatualizado.');
  if (profile.registryStatus === 'unregistered') reasons.push('Você indicou que a família ainda não possui CadÚnico.');
  if (profile.informationChanged) reasons.push('Mudanças de renda, endereço ou composição familiar devem ser declaradas corretamente.');
  if (profile.familySize === 1) reasons.push('Cadastros unipessoais podem exigir entrevista domiciliar, observadas as exceções oficiais.');

  const actions = [
    {
      title: 'Conferir seus dados no CadÚnico',
      detail: 'Verifique a situação do cadastro e compare os dados existentes com a realidade da família.',
      priority: 'Essencial',
    },
  ];

  if (profile.registryStatus === 'unregistered') actions.push({
    title: 'Solicitar inscrição no CadÚnico',
    detail: 'Procure o CRAS ou posto responsável do seu município. A inscrição oficial é gratuita.',
    priority: 'Prioritário',
  });
  if (profile.registryStatus === 'outdated' || profile.informationChanged || profile.registryStatus === 'unknown') actions.push({
    title: 'Confirmar a necessidade de atualização',
    detail: 'O cadastro deve ser atualizado a cada 24 meses ou quando houver alterações relevantes. Consulte o atendimento municipal.',
    priority: 'Prioritário',
  });
  if (!withinIncomeLimit) actions.push({
    title: 'Verificar regras aplicáveis à situação da família',
    detail: 'Confira todas as rendas efetivamente recebidas. Se a família já é beneficiária, pergunte sobre a Regra de Proteção; ela não é uma regra geral de entrada.',
    priority: 'Importante',
  });
  if (profile.familySize === 1) actions.push({
    title: 'Confirmar requisitos de atendimento unipessoal',
    detail: 'Pergunte ao posto sobre eventual entrevista domiciliar e as exceções previstas em norma.',
    priority: 'Importante',
  });
  if (profile.children > 0) actions.push({
    title: 'Revisar a composição familiar',
    detail: 'Mantenha corretas as informações de crianças e adolescentes, inclusive escola, quando aplicável.',
    priority: 'Importante',
  });
  actions.push({
    title: 'Acompanhar os canais oficiais',
    detail: 'Somente a gestão do programa confirma seleção, concessão, suspensão ou manutenção do benefício.',
    priority: 'Orientação',
  });

  return {
    status,
    title: labels[status],
    perCapita,
    withinIncomeLimit,
    registryNeedsAttention,
    familySize: Number(profile.familySize),
    monthlyIncome: Number(profile.monthlyIncome),
    children: Number(profile.children),
    reasons,
    actions,
    reference: CRITERIA_REFERENCE,
  };
}
