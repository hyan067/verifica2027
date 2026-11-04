import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, CheckCircle2, CreditCard, Info, LockKeyhole, ShieldCheck, X } from 'lucide-react';
import { formatCPF, isValidCPF, isValidEmail } from '../lib/validation.js';

const isLive = import.meta.env.VITE_PAYMENT_MODE === 'live';
const apiUrl = (import.meta.env.VITE_PAYMENT_API_URL || '').replace(/\/$/, '');

/**
 * Demo: NÃO cria pagamentos nem simula uma confirmação real.
 * Live: requer servidor próprio e PSP; dados pessoais nunca são mandados ao PSP diretamente daqui.
 * Backend esperado: POST /api/pix/create { productId } => { chargeId, brCode }
 *                  GET /api/pix/status?chargeId=... => { status:'pending'|'paid'|'expired' }
 * Só o servidor deve confiar em webhooks assinados do PSP e liberar o produto.
 */
export default function CheckoutModal({ open, onClose, onSuccess }) {
  const [step, setStep] = useState('details');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [brCode, setBrCode] = useState('');
  const [chargeId, setChargeId] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !isLive || step !== 'qr' || !chargeId || !apiUrl) return undefined;
    let active = true;
    const check = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/pix/status?chargeId=${encodeURIComponent(chargeId)}`, { credentials: 'include', cache: 'no-store' });
        if (!response.ok) return;
        const data = await response.json();
        if (!active) return;
        if (data.status === 'paid') { active = false; onSuccess('verified'); }
        if (data.status === 'expired') { setError('Este Pix expirou. Volte e gere uma nova cobrança.'); }
      } catch { /* Erro de rede transitório: tentar na próxima consulta. */ }
    };
    check();
    const timer = window.setInterval(check, 4000);
    return () => { active = false; window.clearInterval(timer); };
  }, [chargeId, open, onSuccess, step]);

  if (!open) return null;

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (name.trim().length < 2) return setError('Informe o nome para identificação do pedido.');
    if (!isValidEmail(email)) return setError('Informe um e-mail válido.');
    if (cpf && !isValidCPF(cpf)) return setError('CPF inválido. Confira os dígitos verificadores.');
    if (!accepted) return setError('Leia e aceite as condições do serviço privado.');
    if (!isLive) {
      setBrCode('DEMONSTRACAO-VERIFICA2027-NAO-REALIZE-PAGAMENTO-SEM-PIX-VALIDO');
      setStep('qr');
      setCpf(''); // CPF nunca é armazenado no estado global.
      return;
    }
    if (!apiUrl) return setError('Checkout indisponível: API de pagamentos não configurada.');
    setBusy(true);
    try {
      const response = await fetch(`${apiUrl}/api/pix/create`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify({ productId: 'relatorio-15' }),
      });
      if (!response.ok) throw new Error('Não foi possível iniciar a cobrança.');
      const data = await response.json();
      if (!data.chargeId || !data.brCode) throw new Error('Resposta de cobrança inválida.');
      setChargeId(data.chargeId);
      setBrCode(data.brCode);
      setCpf('');
      setStep('qr');
    } catch (err) { setError(err.message || 'Falha no checkout.'); }
    finally { setBusy(false); }
  };
  const close = () => { setCpf(''); setName(''); setEmail(''); setAccepted(false); setStep('details'); setError(''); setBrCode(''); setChargeId(''); onClose(); };
  const testUnlock = () => { if (isLive) return; close(); onSuccess('demo'); };

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
    <div role="dialog" aria-modal="true" aria-labelledby="checkout-title" className="max-h-[94vh] w-full max-w-lg overflow-y-auto rounded-[24px] bg-white shadow-2xl">
      <div className="flex items-start justify-between border-b border-slate-100 p-6 sm:p-8"><div><p className="eyebrow">{isLive ? 'Pagamento opcional' : 'Ambiente de demonstração'}</p><h2 id="checkout-title" className="mt-2 text-2xl font-black tracking-tight text-slate-900">Relatório personalizado</h2><p className="mt-2 text-sm text-slate-500">Análise explicada e checklist de próximos passos.</p></div><button onClick={close} aria-label="Fechar checkout" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={21}/></button></div>
      <div className="p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5"><div><p className="text-sm font-extrabold text-slate-900">Relatório individual</p><p className="mt-1 text-xs text-slate-500">Compra privada e opcional</p></div><p className="text-2xl font-black tracking-tight text-brand-800">R$ 15,00</p></div>
        {step === 'details' ? <form onSubmit={submit} className="space-y-4" noValidate>
          <label className="field-label">Nome para o pedido<input className="field" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required /></label>
          <label className="field-label">E-mail<input className="field" placeholder="voce@email.com" value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required/></label>
          <label className="field-label">CPF (opcional, apenas validação local)<input className="field" placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(formatCPF(e.target.value))} inputMode="numeric" autoComplete="off"/><span className="mt-1 block text-xs font-normal text-slate-500">Não é necessário para a análise; não é enviado nem salvo.</span></label>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 text-xs leading-5 text-slate-600"><input type="checkbox" className="mt-1 h-4 w-4 accent-brand-800" checked={accepted} onChange={(e) => setAccepted(e.target.checked)}/><span>Entendo que este é um <strong>serviço privado de orientação</strong>, não uma taxa do governo, e que o relatório não garante inscrição, aprovação ou pagamento de benefícios.</span></label>
          {error && <p className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700" role="alert">{error}</p>}
          <button type="submit" disabled={busy} className="btn-primary w-full"><CreditCard size={18}/>{busy ? 'Gerando cobrança...' : isLive ? 'Gerar Pix de R$ 15,00' : 'Ver Pix de demonstração'}</button>
          <p className="flex items-center justify-center gap-2 text-xs text-slate-500"><LockKeyhole size={15}/> {isLive ? 'Pagamento processado por provedor integrado' : 'Nenhuma cobrança será efetuada neste protótipo'}</p>
        </form> : <div className="text-center">
          <div className={`mb-5 flex items-start gap-3 rounded-xl p-4 text-left text-xs leading-6 ${isLive ? 'bg-blue-50 text-brand-800' : 'border border-amber-100 bg-amber-50 text-amber-900'}`}><Info size={20} className="mt-0.5 shrink-0"/>{isLive ? 'Pague somente se o nome do recebedor e o valor estiverem corretos. A confirmação depende do provedor de pagamentos.' : 'SIMULAÇÃO: este QR Code não é um Pix válido. Não tente pagar. Use o botão abaixo apenas para visualizar o relatório de exemplo.'}</div>
          <div className="mx-auto inline-flex rounded-2xl border border-slate-200 bg-white p-5"><QRCodeSVG value={brCode} size={205} marginSize={2} level="M" aria-label={isLive ? 'QR Code Pix' : 'QR Code fictício para demonstração'} /></div>
          {isLive ? <><p className="mt-4 text-sm font-semibold text-slate-700">Aguardando confirmação do pagamento pelo servidor...</p><button onClick={() => { navigator.clipboard?.writeText(brCode).catch(() => {}); }} className="btn-outline mt-4 w-full">Copiar Pix copia e cola</button></> : <><p className="mt-4 text-xs font-bold uppercase tracking-wider text-amber-700">QR fictício · nenhuma transação</p><button onClick={testUnlock} className="btn-primary mt-5 w-full"><CheckCircle2 size={18}/> Visualizar relatório de exemplo</button></>}
          {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-700" role="alert">{error}</p>}
          <button onClick={() => { setStep('details'); setError(''); }} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-brand-800"><ArrowLeft size={14}/> Voltar</button>
        </div>}
        <div className="mt-6 flex items-start gap-2 border-t border-slate-100 pt-5 text-xs leading-5 text-slate-500"><ShieldCheck size={18} className="shrink-0 text-accent-600"/><span>Nenhum valor é cobrado pelo CadÚnico ou pelo Bolsa Família. Este valor refere-se exclusivamente ao serviço privado.</span></div>
      </div>
    </div>
  </div>;
}
