import { ArrowRight, ArrowUpRight, BadgeCheck, Calculator, Check, ClipboardCheck, FileText, ShieldCheck, UsersRound } from 'lucide-react';

export default function Hero({ onStart }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/60 bg-gradient-to-b from-[#f6f9ff] via-white to-paper">
      <div className="pointer-events-none absolute -right-40 top-0 h-[620px] w-[740px] rounded-full bg-blue-100/45 blur-[95px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-[370px] w-[450px] rounded-full bg-teal-100/25 blur-[100px]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 pb-24 pt-16 sm:px-8 md:pt-24 lg:grid-cols-[1.08fr_.92fr] lg:pb-32">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-2 text-xs font-bold text-accent-700"><ShieldCheck size={15}/> Análise independente · Referências públicas do MDS</div>
          <h1 className="max-w-2xl text-[clamp(2.65rem,5vw,4.7rem)] font-black leading-[1.1] tracking-[-.055em] text-[#15254b]">Prepare sua família para o <span className="text-brand-700">Bolsa Família em 2027.</span></h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">Entenda como a renda familiar, a composição da casa e a situação do CadÚnico se relacionam com os critérios <strong className="font-semibold text-slate-800">publicados até agora</strong>. Sem promessas de aprovação e sem consulta a bases governamentais.</p>
          <div className="mt-9 flex flex-wrap items-center gap-3"><button onClick={onStart} className="btn-primary !px-7 !py-4">Iniciar pré-análise gratuita <ArrowRight size={18}/></button><a href="#como-funciona" className="btn-outline !py-4">Entenda o processo <ArrowUpRight size={17}/></a></div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-slate-500"><span className="flex items-center gap-2"><Check className="text-accent-600" size={15}/> Resultado básico gratuito</span><span className="flex items-center gap-2"><Check className="text-accent-600" size={15}/> Relatório detalhado opcional: R$ 15</span><span className="flex items-center gap-2"><Check className="text-accent-600" size={15}/> Sem armazenamento permanente</span></div>
        </div>
        <div className="relative mx-auto w-full max-w-[520px] lg:ml-auto" aria-label="Exemplo ilustrativo de relatório">
          <div className="absolute -inset-5 rotate-[-4deg] rounded-[36px] border border-blue-100 bg-gradient-to-bl from-blue-200/50 to-white/40" />
          <div className="relative overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-float">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><div className="flex items-center gap-2.5"><span className="rounded-lg bg-blue-50 p-2 text-brand-800"><ClipboardCheck size={20}/></span><div><p className="text-sm font-extrabold text-slate-900">Visão geral do diagnóstico</p><p className="text-xs text-slate-400">Exemplo ilustrativo</p></div></div><span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">Exemplo</span></div>
            <div className="p-6">
              <div className="mb-5 flex items-center justify-between"><div><p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Critério de renda vigente</p><p className="mt-1 text-[34px] font-black tracking-tight text-[#15254b]">R$ 218<span className="ml-1 text-sm font-medium text-slate-400">/ pessoa</span></p></div><span className="rounded-2xl bg-teal-50 p-3 text-accent-600"><Calculator size={25}/></span></div>
              <div className="grid grid-cols-2 gap-3"><div className="rounded-xl border border-slate-100 bg-slate-50 p-4"><UsersRound size={17} className="text-slate-500"/><p className="mt-3 text-xs text-slate-500">Composição familiar</p><p className="mt-1 text-sm font-extrabold text-slate-800">Dados declarados</p></div><div className="rounded-xl border border-slate-100 bg-slate-50 p-4"><FileText size={17} className="text-slate-500"/><p className="mt-3 text-xs text-slate-500">Situação do CadÚnico</p><p className="mt-1 text-sm font-extrabold text-slate-800">Verificação orientativa</p></div></div>
              <div className="mt-5 rounded-xl border border-teal-100 bg-teal-50/70 p-4"><div className="flex gap-3"><span className="mt-0.5 rounded-full bg-teal-100 p-1 text-accent-700"><Check size={14}/></span><div><p className="text-sm font-bold text-slate-800">Mais clareza sobre seus próximos passos</p><p className="mt-1 text-xs leading-5 text-slate-600">Cálculo explicado, pontos de atenção e fontes para consulta oficial.</p></div></div></div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5"><span className="flex items-center gap-2 text-xs font-medium text-slate-500"><BadgeCheck size={16} className="text-accent-600"/> Metodologia transparente</span><span className="text-[11px] font-medium text-slate-400">Referência: nov/2026</span></div>
            </div>
          </div>
          <div className="absolute -bottom-8 -left-4 hidden items-center gap-3 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-xl sm:flex"><span className="rounded-full bg-teal-50 p-2 text-accent-600"><ShieldCheck size={19}/></span><div><p className="text-xs font-bold text-slate-800">Seus dados sob seu controle</p><p className="text-[11px] text-slate-400">Apague as respostas a qualquer momento</p></div></div>
        </div>
      </div>
    </section>
  );
}
