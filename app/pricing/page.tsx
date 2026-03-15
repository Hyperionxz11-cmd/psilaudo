'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../lib/supabase';

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCheckout() {
    setLoading(true);
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push('/cadastro'); return; }

    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${session.access_token}` },
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else { alert('Erro ao iniciar checkout. Tente novamente.'); setLoading(false); }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <a href="/" style={{ fontWeight: 900, fontSize: 22, letterSpacing: '-1.5px', color: 'var(--text)', textDecoration: 'none', marginBottom: 48 }}>PsiLaudo</a>

      <h1 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900, letterSpacing: '-3px', textAlign: 'center', margin: '0 0 12px' }}>
        Laudos ilimitados<br />por <span style={{ color: 'var(--indigo)' }}>R$79/mês</span>
      </h1>
      <p style={{ fontSize: 16, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 48, maxWidth: 420 }}>
        AvalPsico cobra R$99 e faz menos. Cancele quando quiser.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, width: '100%', maxWidth: 680, marginBottom: 32 }}>
        {/* Free */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: '32px 24px' }}>
          <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 6 }}>Gratuito</div>
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-2.5px' }}>R$0</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>/mês</span>
          </div>
          {['2 laudos por mês', 'Arma + Trânsito + Educacional', 'Export PDF'].map(f => (
            <div key={f} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-sec)', marginBottom: 8, alignItems: 'flex-start' }}>
              <span style={{ color: '#059669', fontWeight: 700 }}>✓</span>{f}
            </div>
          ))}
          <a href="/dashboard" style={{ display: 'block', textAlign: 'center', marginTop: 20, padding: '12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none', color: 'var(--text)' }}>
            Continuar grátis
          </a>
        </div>

        {/* Premium */}
        <div style={{ background: '#111', borderRadius: 16, padding: '32px 24px', color: '#fff', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 14, right: 14, background: 'var(--indigo)', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 4, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Recomendado
          </div>
          <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 6 }}>Premium</div>
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-2.5px' }}>R$79</span>
            <span style={{ fontSize: 13, color: '#888' }}>/mês</span>
          </div>
          {['Laudos ilimitados', 'Todos os 6 tipos', 'Export PDF + Word', 'Histórico por paciente', 'Suporte prioritário'].map(f => (
            <div key={f} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#bbb', marginBottom: 8, alignItems: 'flex-start' }}>
              <span style={{ color: '#A5B4FC', fontWeight: 700 }}>✓</span>{f}
            </div>
          ))}
          <button onClick={handleCheckout} disabled={loading}
            style={{ width: '100%', background: loading ? '#555' : 'var(--indigo)', color: '#fff', border: 'none', borderRadius: 8, padding: '13px', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 20, letterSpacing: '-0.3px' }}>
            {loading ? 'Redirecionando...' : 'Assinar por R$79/mês →'}
          </button>
          <p style={{ textAlign: 'center', fontSize: 11, color: '#555', marginTop: 10, marginBottom: 0 }}>Cancele a qualquer momento</p>
        </div>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
        Pagamento seguro via Stripe · LGPD compliant · Nota fiscal disponível
      </p>
    </div>
  );
}
