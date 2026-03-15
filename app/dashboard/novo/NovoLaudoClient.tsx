'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase';
import { gerarLaudo } from '../../lib/laudoTemplates';

const TIPOS = [
  { id: 'arma', icon: '🔫', label: 'Porte de Arma', desc: 'Aptidão psicológica para porte/aquisição de arma de fogo', premium: false },
  { id: 'transito', icon: '🚗', label: 'Trânsito / CNH', desc: 'Avaliação psicológica para condutores de veículos', premium: false },
  { id: 'educacional', icon: '📚', label: 'Educacional', desc: 'NEE, superdotação, TDAH, dislexia, adaptações pedagógicas', premium: false },
  { id: 'adocao', icon: '👶', label: 'Adoção', desc: 'Habilitação para adoção — ECA Art. 197-C', premium: true },
  { id: 'pericial', icon: '⚖️', label: 'Pericial', desc: 'Laudo pericial para processos judiciais', premium: true },
  { id: 'cargo', icon: '🏛️', label: 'Cargo Público', desc: 'Aptidão psicológica para concursos e cargos públicos', premium: true },
];

type Step = 'tipo' | 'paciente' | 'clinico' | 'gerando' | 'pronto';

export default function NovoLaudoClient() {
  const [step, setStep] = useState<Step>('tipo');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [profile, setProfile] = useState<{ plan: string; full_name?: string; crp?: string } | null>(null);
  const [laudoId, setLaudoId] = useState('');
  const router = useRouter();

  /* Dados paciente */
  const [paciente, setPaciente] = useState({ nome: '', dataNasc: '', sexo: 'Feminino', escolaridade: '', profissao: '' });
  /* Dados clínicos */
  const [clinico, setClinico] = useState({
    dataAvaliacao: new Date().toISOString().split('T')[0],
    instrumentos: '',
    observacoes: '',
    conclusao: 'apto',
    observacoesClinicas: '',
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/login'); return; }
      const { data } = await supabase.from('profiles').select('plan, full_name, crp').eq('id', user.id).single();
      setProfile(data);
    });
  }, [router]);

  async function handleGerar() {
    setStep('gerando');
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    const conteudo = gerarLaudo({
      tipo: selectedTipo,
      paciente,
      clinico,
      psicologo: { nome: profile?.full_name || 'Psicólogo(a)', crp: profile?.crp || '' },
      dataAvaliacao: clinico.dataAvaliacao,
    });

    const { data, error } = await supabase.from('laudos').insert({
      user_id: user.id,
      tipo: selectedTipo,
      paciente_nome: paciente.nome,
      conteudo,
      status: 'gerado',
    }).select('id').single();

    if (error || !data) { alert('Erro ao salvar laudo. Tente novamente.'); setStep('clinico'); return; }
    setLaudoId(data.id);
    setStep('pronto');
  }

  const isPremium = profile?.plan === 'premium';

  /* ── STEP: TIPO ──────────────────────────────── */
  if (step === 'tipo') return (
    <Shell onBack={() => router.push('/dashboard')} title="Tipo de Laudo" subtitle="Selecione o tipo de laudo que deseja gerar" step="1 / 3">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, marginBottom: 32 }}>
        {TIPOS.map(t => {
          const locked = t.premium && !isPremium;
          return (
            <button
              key={t.id}
              onClick={() => !locked && setSelectedTipo(t.id)}
              style={{
                textAlign: 'left', padding: '20px', border: `2px solid ${selectedTipo === t.id ? 'var(--indigo)' : 'var(--border)'}`,
                borderRadius: 12, background: selectedTipo === t.id ? 'var(--indigo-light)' : '#fff',
                cursor: locked ? 'not-allowed' : 'pointer', opacity: locked ? 0.5 : 1, position: 'relative',
              }}
            >
              {locked && <span style={{ position: 'absolute', top: 10, right: 10, background: '#F3F4F6', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, color: '#9CA3AF', textTransform: 'uppercase' }}>Premium</span>}
              <div style={{ fontSize: 24, marginBottom: 8 }}>{t.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.3px', marginBottom: 4 }}>{t.label}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{t.desc}</div>
            </button>
          );
        })}
      </div>
      <button
        disabled={!selectedTipo}
        onClick={() => setStep('paciente')}
        style={{ background: selectedTipo ? 'var(--indigo)' : '#E5E5E5', color: selectedTipo ? '#fff' : '#999', border: 'none', borderRadius: 10, padding: '13px 32px', fontSize: 15, fontWeight: 700, cursor: selectedTipo ? 'pointer' : 'not-allowed' }}
      >
        Continuar →
      </button>
    </Shell>
  );

  /* ── STEP: PACIENTE ───────────────────────────── */
  if (step === 'paciente') return (
    <Shell onBack={() => setStep('tipo')} title="Dados do Paciente" subtitle="Informações que aparecerão no cabeçalho do laudo" step="2 / 3">
      <div style={{ maxWidth: 520 }}>
        {[
          { label: 'Nome completo', key: 'nome', type: 'text', placeholder: 'Nome do paciente' },
          { label: 'Data de nascimento', key: 'dataNasc', type: 'date', placeholder: '' },
          { label: 'Profissão', key: 'profissao', type: 'text', placeholder: 'Ex: Comerciante' },
          { label: 'Escolaridade', key: 'escolaridade', type: 'text', placeholder: 'Ex: Ensino médio completo' },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-sec)' }}>{f.label}</label>
            <input
              type={f.type} placeholder={f.placeholder}
              value={(paciente as Record<string, string>)[f.key]}
              onChange={e => setPaciente(p => ({ ...p, [f.key]: e.target.value }))}
              style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#FAFAFA', color: 'var(--text)' }}
            />
          </div>
        ))}
        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-sec)' }}>Sexo</label>
          <select value={paciente.sexo} onChange={e => setPaciente(p => ({ ...p, sexo: e.target.value }))}
            style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none', background: '#FAFAFA', color: 'var(--text)' }}>
            <option>Feminino</option><option>Masculino</option><option>Não-binário</option>
          </select>
        </div>
        <button
          disabled={!paciente.nome || !paciente.dataNasc}
          onClick={() => setStep('clinico')}
          style={{ background: paciente.nome && paciente.dataNasc ? 'var(--indigo)' : '#E5E5E5', color: paciente.nome && paciente.dataNasc ? '#fff' : '#999', border: 'none', borderRadius: 10, padding: '13px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
        >
          Continuar →
        </button>
      </div>
    </Shell>
  );

  /* ── STEP: CLÍNICO ────────────────────────────── */
  if (step === 'clinico') return (
    <Shell onBack={() => setStep('paciente')} title="Dados Clínicos" subtitle="Informações da avaliação psicológica" step="3 / 3">
      <div style={{ maxWidth: 560 }}>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-sec)' }}>Data da avaliação</label>
          <input type="date" value={clinico.dataAvaliacao}
            onChange={e => setClinico(c => ({ ...c, dataAvaliacao: e.target.value }))}
            style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#FAFAFA', color: 'var(--text)' }}
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-sec)' }}>Instrumentos utilizados</label>
          <input type="text" value={clinico.instrumentos}
            onChange={e => setClinico(c => ({ ...c, instrumentos: e.target.value }))}
            placeholder="Ex: HTP, Bender, Palográfico, entrevista clínica"
            style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#FAFAFA', color: 'var(--text)' }}
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-sec)' }}>Observações clínicas</label>
          <textarea value={clinico.observacoesClinicas}
            onChange={e => setClinico(c => ({ ...c, observacoesClinicas: e.target.value }))}
            rows={4} placeholder="Descreva o comportamento, cognição, afeto, personalidade observados..."
            style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', background: '#FAFAFA', color: 'var(--text)', fontFamily: 'inherit' }}
          />
        </div>
        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 10, color: 'var(--text-sec)' }}>Conclusão</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { val: 'apto', label: '✓ Apto', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
              { val: 'inapto', label: '✗ Inapto', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
              { val: 'apto_restritivo', label: '~ Apto com Restrição', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
            ].map(opt => (
              <button key={opt.val} onClick={() => setClinico(c => ({ ...c, conclusao: opt.val }))}
                style={{ flex: 1, padding: '10px 8px', border: `2px solid ${clinico.conclusao === opt.val ? opt.border : 'var(--border)'}`, borderRadius: 8, background: clinico.conclusao === opt.val ? opt.bg : '#fff', color: clinico.conclusao === opt.val ? opt.color : 'var(--text-sec)', fontWeight: 700, fontSize: 12, cursor: 'pointer', letterSpacing: '-0.2px' }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <button onClick={handleGerar}
          style={{ background: 'var(--indigo)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 36px', fontSize: 16, fontWeight: 800, cursor: 'pointer', letterSpacing: '-0.5px' }}>
          Gerar Laudo ✦
        </button>
      </div>
    </Shell>
  );

  /* ── STEP: GERANDO ────────────────────────────── */
  if (step === 'gerando') return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
      <div style={{ width: 48, height: 48, border: '4px solid var(--indigo-light)', borderTopColor: 'var(--indigo)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-1px', marginBottom: 8 }}>Gerando seu laudo...</div>
        <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Montando o documento conforme normas do CFP</div>
      </div>
    </div>
  );

  /* ── STEP: PRONTO ─────────────────────────────── */
  if (step === 'pronto') return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
      <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-2px', marginBottom: 12 }}>Laudo gerado!</h2>
      <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 32, maxWidth: 400 }}>
        Seu laudo está pronto. Visualize, edite e exporte em PDF ou Word.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <a href={`/dashboard/laudo/${laudoId}`}
          style={{ background: 'var(--indigo)', color: '#fff', padding: '13px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
          Ver laudo →
        </a>
        <button onClick={() => router.push('/dashboard')}
          style={{ background: '#fff', color: 'var(--text)', border: '1.5px solid var(--border)', padding: '13px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          Ir para Dashboard
        </button>
      </div>
    </div>
  );

  return null;
}

/* ── Shell wrapper ─────────────────────────────── */
function Shell({ children, onBack, title, subtitle, step }: {
  children: React.ReactNode; onBack: () => void; title: string; subtitle: string; step: string;
}) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--text-sec)', fontWeight: 600, padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
          ← Voltar
        </button>
        <span style={{ fontWeight: 900, fontSize: 16, letterSpacing: '-0.5px' }}>PsiLaudo</span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Etapa {step}</span>
      </nav>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-2px', margin: '0 0 6px' }}>{title}</h1>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: 0 }}>{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
