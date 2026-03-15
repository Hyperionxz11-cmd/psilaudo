'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../lib/supabase';

interface Profile {
  id: string;
  email: string;
  plan: string;
  full_name?: string;
  crp?: string;
}

interface Laudo {
  id: string;
  tipo: string;
  paciente_nome: string;
  created_at: string;
  status: string;
}

const TIPO_LABELS: Record<string, string> = {
  arma: 'Porte de Arma',
  transito: 'Trânsito / CNH',
  educacional: 'Educacional',
  adocao: 'Adoção',
  pericial: 'Pericial',
  cargo: 'Cargo Público',
};

const TIPO_ICONS: Record<string, string> = {
  arma: '🔫', transito: '🚗', educacional: '📚', adocao: '👶', pericial: '⚖️', cargo: '🏛️',
};

export default function DashboardClient() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [laudos, setLaudos] = useState<Laudo[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(prof);
      const { data: ls } = await supabase.from('laudos').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      setLaudos(ls || []);
      setLoading(false);
    })();
  }, [router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--indigo)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  const isPremium = profile?.plan === 'premium';
  const monthUsed = laudos.filter(l => {
    const d = new Date(l.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const freeLimit = 2;
  const canCreate = isPremium || monthUsed < freeLimit;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Nav */}
      <nav style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-1px' }}>PsiLaudo</span>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {!isPremium && (
            <a href="/pricing" style={{ background: 'var(--indigo)', color: '#fff', padding: '7px 14px', borderRadius: 7, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              Upgrade →
            </a>
          )}
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)', padding: 0 }}>
            Sair
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-2px', margin: '0 0 4px' }}>
            Olá{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}. 👋
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>
            {isPremium ? 'Plano Premium · Laudos ilimitados' : `Plano Gratuito · ${monthUsed}/${freeLimit} laudos este mês`}
          </p>
        </div>

        {/* Usage bar (free only) */}
        {!isPremium && (
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
              <span>Uso mensal</span>
              <span style={{ color: monthUsed >= freeLimit ? '#DC2626' : 'var(--text-sec)' }}>{monthUsed}/{freeLimit} laudos</span>
            </div>
            <div style={{ background: 'var(--border)', borderRadius: 4, height: 6 }}>
              <div style={{ background: monthUsed >= freeLimit ? '#DC2626' : 'var(--indigo)', height: 6, borderRadius: 4, width: `${Math.min((monthUsed / freeLimit) * 100, 100)}%`, transition: 'width 0.4s ease' }} />
            </div>
            {monthUsed >= freeLimit && (
              <p style={{ fontSize: 12, color: '#DC2626', marginTop: 10, marginBottom: 0 }}>
                Limite atingido.{' '}
                <a href="/pricing" style={{ color: 'var(--indigo)', fontWeight: 700, textDecoration: 'none' }}>Faça upgrade por R$79/mês →</a>
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
          <button
            onClick={() => canCreate ? router.push('/dashboard/novo') : router.push('/pricing')}
            style={{ background: canCreate ? 'var(--indigo)' : '#9CA3AF', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 24px', fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.3px' }}
          >
            {canCreate ? '+ Novo Laudo' : 'Limite atingido — Upgrade'}
          </button>
        </div>

        {/* Laudos list */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
            Meus Laudos
          </h2>
          {laudos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>📄</div>
              <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Nenhum laudo ainda.</p>
              <p style={{ fontSize: 14 }}>Clique em "Novo Laudo" para começar.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              {laudos.map(l => (
                <div key={l.id} style={{ background: '#fff', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: 20 }}>{TIPO_ICONS[l.tipo] || '📄'}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: '-0.3px' }}>{l.paciente_nome}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        {TIPO_LABELS[l.tipo] || l.tipo} · {new Date(l.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  <a href={`/dashboard/laudo/${l.id}`} style={{ fontSize: 13, fontWeight: 600, color: 'var(--indigo)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                    Ver laudo →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
