import { useEffect, useState } from 'react';
import { ArrowRight, Check, ClipboardList, LockKeyhole, X } from 'lucide-react';
import { validateProfile } from '../lib/validation.js';

const initialProfile = {
  familySize: '4', monthlyIncome: '', children: '0', registryStatus: 'unknown', informationChanged: false,
};

export default function QuestionnaireModal({ open, onClose, onComplete }) {
  const [profile, setProfile] = useState(initialProfile);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);
  if (!open) return null;

  const change = (key, value) => {
    setProfile((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  };
  const submit = (event) => {
    event.preventDefault();
    const nextErrors = validateProfile(profile);
    if (profile.monthlyIncome === '') nextErrors.monthlyIncome = 'Informe a renda mensal total. Se não houver renda, digite zero.';
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return; }
    onComplete({
      familySize: Number(profile.familySize),
      monthlyIncome: Number(profile.monthlyIncome),
      children: Number(profile.children),
      registryStatus: profile.registryStatus,
      informationChanged: Boolean(profile.informationChanged),
    });
    setProfile(initialProfile);
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="questionnaire-title" className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 p-6 sm:p-8"><div><span className="eyebrow">Etapa 1 · Diagnóstico gratuito</span><h2 id="questionnaire-title" className="mt-2 text-2xl font-black tracking-tight text-slate-900">Vamos conhecer sua família.</h2><p className="mt-2 text-sm text-slate-500">Aproximadamente 2 minutos. Não pedimos CPF nesta etapa.</p></div><button onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" aria-label="Fechar formulário"><X size={21}/></button></div>
        <form onSubmit={submit} className="space-y-6 p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="field-label">Pessoas que moram e compõem a família <span className="text-red-500">*</span><input className="field" type="number" min="1" max="30" step="1" required value={profile.familySize} onChange={(e) => change('familySize', e.target.value)} aria-invalid={Boolean(errors.familySize)} /><span className="mt-1 block text-xs font-normal text-slate-500">Inclua você e os integrantes da família.</span>{errors.familySize && <span className="mt-1 block text-xs font-semibold text-red-600">{errors.familySize}</span>}</label>
            <label className="field-label">Renda mensal total da família (R$) <span className="text-red-500">*</span><input className="field" type="number" inputMode="decimal" min="0" step="0.01" placeholder="Ex.: 1200,00" required value={profile.monthlyIncome} onChange={(e) => change('monthlyIncome', e.target.value)} aria-invalid={Boolean(errors.monthlyIncome)} /><span className="mt-1 block text-xs font-normal text-slate-500">Some os valores efetivamente recebidos.</span>{errors.monthlyIncome && <span className="mt-1 block text-xs font-semibold text-red-600">{errors.monthlyIncome}</span>}</label>
            <label className="field-label">Crianças e adolescentes na família<input className="field" type="number" min="0" max="30" step="1" value={profile.children} onChange={(e) => change('children', e.target.value)} aria-invalid={Boolean(errors.children)}/>{errors.children && <span className="mt-1 block text-xs font-semibold text-red-600">{errors.children}</span>}</label>
            <label className="field-label">Situação do CadÚnico <span className="text-red-500">*</span><select className="field" value={profile.registryStatus} onChange={(e) => change('registryStatus', e.target.value)}><option value="updated">Cadastrado e atualizado</option><option value="outdated">Cadastrado, mas desatualizado</option><option value="unregistered">Ainda não estou cadastrado</option><option value="unknown">Não sei informar</option></select></label>
          </div>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700"><input type="checkbox" checked={profile.informationChanged} onChange={(e) => change('informationChanged', e.target.checked)} className="mt-1 h-4 w-4 accent-brand-800"/><span>Houve alguma mudança de renda, endereço ou pessoas da família depois da última atualização cadastral.</span></label>
          <div className="flex gap-3 rounded-xl bg-blue-50 p-4 text-xs leading-6 text-slate-600"><LockKeyhole size={18} className="mt-0.5 shrink-0 text-brand-800"/><span>As respostas permanecem somente na memória da página, durante esta sessão. Nenhuma consulta governamental é realizada.</span></div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5"><p className="flex items-center gap-1.5 text-xs text-slate-500"><Check size={15} className="text-accent-600"/> Resumo sem custo</p><button className="btn-primary" type="submit"><ClipboardList size={18}/> Ver minha pré-análise <ArrowRight size={17}/></button></div>
        </form>
      </div>
    </div>
  );
}
