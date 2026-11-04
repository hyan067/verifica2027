import { ArrowUpRight, Menu, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header({ onStart }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const home = location.pathname === '/';
  return (
    <header className="no-print sticky top-0 z-30 border-b border-slate-200/75 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Verifica 2027, início">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-800 text-white"><ShieldCheck size={22} strokeWidth={2.3} /></span>
          <span className="leading-tight"><span className="block text-lg font-black tracking-tight text-brand-900">verifica<span className="text-accent-600">.</span>2027</span><span className="block text-[10px] font-semibold tracking-[.11em] text-slate-500">ORIENTAÇÃO INDEPENDENTE</span></span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
          {home ? <><a className="text-sm font-semibold text-slate-600 hover:text-brand-800" href="#como-funciona">Como funciona</a><a className="text-sm font-semibold text-slate-600 hover:text-brand-800" href="#valor">O que está incluso</a><a className="text-sm font-semibold text-slate-600 hover:text-brand-800" href="#faq">Dúvidas</a></> : <Link className="text-sm font-semibold text-slate-600 hover:text-brand-800" to="/">Voltar ao início</Link>}
        </nav>
        {home && <button className="btn-primary hidden !px-5 !py-3 md:inline-flex" onClick={onStart}>Começar grátis <ArrowUpRight size={17}/></button>}
        <button className="rounded-lg p-2 text-slate-700 md:hidden" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="border-t border-slate-100 bg-white px-5 pb-5 md:hidden"><div className="flex flex-col gap-4 pt-4 text-sm font-semibold text-slate-700">{home ? <><a onClick={() => setOpen(false)} href="#como-funciona">Como funciona</a><a onClick={() => setOpen(false)} href="#valor">O que está incluso</a><a onClick={() => setOpen(false)} href="#faq">Dúvidas</a><button className="btn-primary" onClick={() => {setOpen(false); onStart();}}>Começar grátis</button></> : <Link to="/" onClick={() => setOpen(false)}>Voltar ao início</Link>}</div></div>}
    </header>
  );
}
