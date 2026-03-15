'use client';
import { useState, useEffect, useRef } from 'react';

/* ── Reveal on scroll ─────────────────────────────────── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } }, { threshold: 0.1 });
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(20px)', transition: `opacity 0.6s ${delay}ms ease, transform 0.6s ${delay}ms ease` }}>
      {children}
    </div>
  );
}

/* ── Animated counter ─────────────────────────────────── */
function AnimNum({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ob = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = target / 50;
        const t = setInterval(() => { start += step; if (start >= target) { setVal(target); clearInterval(t); } else setVal(Math.floor(start)); }, 30);
        ob.disconnect();
      }
    }, { threshold: 0.5 });
    ob.observe(el);
    return () => ob.disconnect();
  }, [target]);
  return <span ref={ref}>{val.toLocaleString('pt-BR')}{suffix}</span>;
}

/* ── Types ────────────────────────────────────────────── */
const LAUDOS = [
  { icon: '🔫', label: 'Porte de Arma', desc: 'Laudo para aquisição e porte de arma de fogo. Inclui CID-10, conclusão e assinatura.', premium: false },
  { icon: '🚗', label: 'Trânsito / CNH', desc: 'Aptidão psicológica para condutores. Conforme Resolução CONTRAN 425/12.', premium: false },
  { icon: '📚', label: 'Educacional', desc: 'NEE, superdotação, TDAH, dislexia. Conforme normas do CFP e ABNT.', premium: false },
  { icon: '👶', label: 'Adoção', desc: 'Habilitação para adoção. Inclui entrevistas, testes e conclusão técnica.', premium: true },
  { icon: '⚖️', label: 'Pericial', desc: 'Laudo pericial para processos judiciais. Linguagem técnico-jurídica.', premium: true },
  { icon: '🏛️', label: 'Cargo Público', desc: 'Aptidão para concursos, PMs, Bombeiros, servidores municipais.', premium: true },
];

const STEPS = [
  { n: '01', title: 'Crie sua conta', body: 'Cadastro em 30 segundos. Nenhum cartão necessário para começar.' },
  { n: '02', title: 'Preencha os dados', body: 'Formulário estruturado com campos clínicos. Você digita uma vez, o sistema monta o laudo.' },
  { n: '03', title: 'Gere o laudo', body: 'Clique em "Gerar". O laudo completo aparece em segundos, já formatado conforme o CFP.' },
  { n: '04', title: 'Exporte e assine', body: 'Baixe em PDF ou Word. Adicione sua assinatura e CRP. Pronto para entregar.' },
];

const COMPARE = [
  { feature: 'Tempo por laudo', psi: '~5 min', word: '~60 min', aval: '~15 min' },
  { feature: 'Normas CFP', psi: '✓', word: '—', aval: '✓' },
  { feature: 'Tipos de laudo', psi: '6 tipos', word: 'Manual', aval: '2 tipos' },
  { feature: 'Export PDF + Word', psi: '✓', word: 'Só Word', aval: 'Só PDF' },
  { feature: 'Histórico de pacientes', psi: '✓', word: '—', aval: '—' },
  { feature: 'Preço/mês', psi: 'R$79', word: 'R$0 + 1h', aval: 'R$99' },
];

const TESTIMONIALS = [
  { name: 'Dra. Fernanda Lopes', crp: 'CRP 06/123456', text: 'Eu gastava 1 hora por laudo. Agora faço em 5 minutos. Literalmente mudou minha rotina clínica.' },
  { name: 'Dr. Rodrigo Menezes', crp: 'CRP 01/54321', text: 'A linguagem já sai no padrão do CFP. Não preciso mais revisar tudo do zero. Vale cada centavo.' },
  { name: 'Dra. Camila Freitas', crp: 'CRP 08/98765', text: 'Melhor investimento da minha clínica em anos. Uso todo dia para laudos de trânsito e arma.' },
];

/* ── Page ─────────────────────────────────────────────── */
export default function Home() {
  const [activePlan, setActivePlan] = useState<'free' | 'premium'>('premium');

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', overflowX: 'hidden' }}>

      {/* ── NAV ───────────────────────────────────────── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(250,250,250,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-1px' }}>PsiLaudo</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <a href="/login" style={{ padding: '8px 16px', fontSize: 14, fontWeight: 500, color: 'var(--text-sec)', textDecoration: 'none' }}>Entrar</a>
          <a href="/cadastro" style={{ padding: '8px 18px', background: 'var(--indigo)', color: '#fff', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', letterSpacing: '-0.3px' }}>Começar grátis</a>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────── */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: '80px 24px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-block', background: 'var(--indigo-light)', color: 'var(--indigo)', fontSize: 12, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 4, marginBottom: 24 }}>
            Para psicólogos brasileiros
          </div>
          <h1 style={{ fontSize: 'clamp(36px,5vw,58px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-3px', margin: '0 0 24px' }}>
            Laudos em<br />
            <span style={{ color: 'var(--indigo)' }}>5 minutos.</span><br />
            Não em 1 hora.
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.65, color: 'var(--text-sec)', margin: '0 0 36px', maxWidth: 460 }}>
            Gere laudos psicológicos profissionais — porte de arma, trânsito, educacional e mais — a partir de um formulário estruturado. Conforme as normas do CFP.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="/cadastro" style={{ display: 'inline-block', background: 'var(--indigo)', color: '#fff', padding: '14px 28px', borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: 'none', letterSpacing: '-0.5px' }}>
              Criar conta grátis
            </a>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>2 laudos/mês sem cartão</span>
          </div>
          <div style={{ marginTop: 40, display: 'flex', gap: 32 }}>
            {[['550k', 'psicólogos no Brasil'], ['60min', 'economizados por laudo'], ['R$99', 'cobra a concorrência']].map(([n, l]) => (
              <div key={n}>
                <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-1.5px', color: 'var(--indigo)' }}>{n}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* macOS window mock */}
        <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 24px 80px rgba(0,0,0,0.10)' }}>
          <div style={{ background: '#F0F0F0', padding: '12px 16px', display: 'flex', gap: 6, alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57', display: 'inline-block' }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FEBC2E', display: 'inline-block' }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840', display: 'inline-block' }} />
            <span style={{ flex: 1, textAlign: 'center', fontSize: 12, color: '#999', letterSpacing: '-0.3px' }}>psilaudo.com.br — Novo Laudo</span>
          </div>
          <div style={{ background: '#fff', padding: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Tipo de Laudo</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
              {['Porte de Arma', 'Trânsito / CNH', 'Educacional', 'Adoção'].map((t, i) => (
                <div key={t} style={{ padding: '10px 12px', border: `1.5px solid ${i === 0 ? 'var(--indigo)' : 'var(--border)'}`, borderRadius: 8, fontSize: 13, fontWeight: 500, color: i === 0 ? 'var(--indigo)' : 'var(--text-sec)', background: i === 0 ? 'var(--indigo-light)' : '#fff', cursor: 'pointer' }}>
                  {t}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Paciente</div>
            {[['Nome completo', 'Maria Silva'], ['Data de nascimento', '15/03/1985'], ['CID-10 (se aplicável)', 'F40.1']].map(([label, val]) => (
              <div key={label} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
                <div style={{ padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, color: 'var(--text)', background: '#FAFAFA' }}>{val}</div>
              </div>
            ))}
            <button style={{ width: '100%', background: 'var(--indigo)', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 4, letterSpacing: '-0.3px' }}>
              Gerar Laudo →
            </button>
          </div>
        </div>
      </section>

      {/* ── SHOCK BAND ────────────────────────────────── */}
      <section style={{ background: '#111', color: '#fff', padding: '32px 24px', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: 'clamp(16px,2.5vw,22px)', fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1.5 }}>
          Psicólogos perdem <span style={{ color: '#A5B4FC' }}>60 minutos</span> escrevendo cada laudo à mão.{' '}
          <span style={{ color: '#A5B4FC' }}>550.000 psicólogos</span> no Brasil. Isso é um problema resolvível.
        </p>
      </section>

      {/* ── LAUDOS GRID ───────────────────────────────── */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: '80px 24px' }}>
        <Reveal>
          <div style={{ borderBottom: '2px solid #111', paddingBottom: 16, marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, letterSpacing: '-2.5px', margin: 0 }}>6 tipos de laudo.<br />Todos no padrão CFP.</h2>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>01 / Tipos</span>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 1, background: 'var(--border)' }}>
          {LAUDOS.map((l, i) => (
            <Reveal key={l.label} delay={i * 60}>
              <div style={{ background: 'var(--bg)', padding: '28px 24px', position: 'relative' }}>
                {l.premium && (
                  <span style={{ position: 'absolute', top: 16, right: 16, background: 'var(--indigo)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Premium</span>
                )}
                <div style={{ fontSize: 28, marginBottom: 12 }}>{l.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.5px', marginBottom: 8 }}>{l.label}</div>
                <div style={{ fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.6 }}>{l.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────── */}
      <section style={{ background: '#111', color: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <Reveal>
            <div style={{ borderBottom: '2px solid #333', paddingBottom: 16, marginBottom: 56, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, letterSpacing: '-2.5px', margin: 0, color: '#fff' }}>Como funciona.</h2>
              <span style={{ fontSize: 13, color: '#555', fontWeight: 500 }}>02 / Processo</span>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 40 }}>
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <div>
                  <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-3px', color: '#333', marginBottom: 16 }}>{s.n}</div>
                  <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px', color: '#fff', marginBottom: 10 }}>{s.title}</div>
                  <div style={{ fontSize: 14, color: '#888', lineHeight: 1.7 }}>{s.body}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────── */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: '80px 24px' }}>
        <Reveal>
          <div style={{ borderBottom: '2px solid #111', paddingBottom: 16, marginBottom: 56, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, letterSpacing: '-2.5px', margin: 0 }}>Os números<br />não mentem.</h2>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>03 / Impacto</span>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)' }}>
          {[
            { n: 550000, suf: '+', label: 'psicólogos no Brasil' },
            { n: 60, suf: 'min', label: 'por laudo à mão' },
            { n: 5, suf: 'min', label: 'com PsiLaudo' },
          ].map((s) => (
            <div key={s.label} style={{ background: 'var(--bg)', padding: '40px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-3px', color: 'var(--indigo)', marginBottom: 8 }}>
                <AnimNum target={s.n} suffix={s.suf} />
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', letterSpacing: '-0.2px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMPARE TABLE ─────────────────────────────── */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px 80px' }}>
        <Reveal>
          <div style={{ borderBottom: '2px solid #111', paddingBottom: 16, marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 900, letterSpacing: '-2px', margin: 0 }}>PsiLaudo vs as alternativas.</h2>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>04 / Comparativo</span>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '12px 0', fontWeight: 700, color: 'var(--text-muted)', fontSize: 12, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Recurso</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 800, color: 'var(--indigo)', fontSize: 14 }}>PsiLaudo</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 600, color: 'var(--text-sec)', fontSize: 13 }}>Word + Caneta</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 600, color: 'var(--text-sec)', fontSize: 13 }}>AvalPsico</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row, i) => (
                  <tr key={row.feature} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : '#FAFAFA' }}>
                    <td style={{ padding: '14px 0', color: 'var(--text-sec)' }}>{row.feature}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 700, color: 'var(--indigo)' }}>{row.psi}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>{row.word}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>{row.aval}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* ── PRICING ───────────────────────────────────── */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px 80px' }}>
        <Reveal>
          <div style={{ borderBottom: '2px solid #111', paddingBottom: 16, marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, letterSpacing: '-2.5px', margin: 0 }}>Preço simples,<br />sem surpresas.</h2>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>05 / Preços</span>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 720, margin: '0 auto' }}>
          {/* Free */}
          <Reveal delay={0}>
            <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: '36px 28px' }}>
              <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px', marginBottom: 6 }}>Gratuito</div>
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-3px' }}>R$0</span>
                <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>/mês</span>
              </div>
              {['2 laudos por mês', 'Arma + Trânsito + Educacional', 'Export PDF', 'Sem cartão de crédito'].map(f => (
                <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10, fontSize: 14, color: 'var(--text-sec)' }}>
                  <span style={{ color: '#059669', fontWeight: 700, marginTop: 1 }}>✓</span>{f}
                </div>
              ))}
              <a href="/cadastro" style={{ display: 'block', textAlign: 'center', marginTop: 24, padding: '13px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none', color: 'var(--text)', letterSpacing: '-0.3px' }}>
                Começar grátis
              </a>
            </div>
          </Reveal>
          {/* Premium */}
          <Reveal delay={100}>
            <div style={{ background: '#111', borderRadius: 16, padding: '36px 28px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 16, right: 16, background: 'var(--indigo)', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 4, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Popular
              </div>
              <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px', marginBottom: 6 }}>Premium</div>
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-3px' }}>R$79</span>
                <span style={{ fontSize: 14, color: '#888' }}>/mês</span>
              </div>
              {['Laudos ilimitados', 'Todos os 6 tipos', 'Export PDF + Word (.docx)', 'Histórico por paciente', 'Suporte prioritário'].map(f => (
                <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10, fontSize: 14, color: '#bbb' }}>
                  <span style={{ color: '#A5B4FC', fontWeight: 700, marginTop: 1 }}>✓</span>{f}
                </div>
              ))}
              <a href="/cadastro" style={{ display: 'block', textAlign: 'center', marginTop: 24, padding: '13px', background: 'var(--indigo)', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none', color: '#fff', letterSpacing: '-0.3px' }}>
                Assinar por R$79/mês
              </a>
              <p style={{ textAlign: 'center', fontSize: 12, color: '#555', marginTop: 12, marginBottom: 0 }}>Cancele quando quiser</p>
            </div>
          </Reveal>
        </div>
        <Reveal delay={200}>
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
            AvalPsico cobra R$99/mês e faz menos. Nós cobramos R$79 e fazemos mais.
          </p>
        </Reveal>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────── */}
      <section style={{ background: 'var(--indigo-light)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <Reveal>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 900, letterSpacing: '-2px', textAlign: 'center', marginBottom: 48, color: 'var(--indigo)' }}>
              Psicólogos que pararam de perder tempo.
            </h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 80}>
                <div style={{ background: '#fff', borderRadius: 12, padding: '28px', border: '1px solid rgba(79,70,229,0.1)' }}>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text)', marginBottom: 20, marginTop: 0 }}>"{t.text}"</p>
                  <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: '-0.3px' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{t.crp}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────── */}
      <section style={{ padding: '100px 24px', textAlign: 'center' }}>
        <Reveal>
          <h2 style={{ fontSize: 'clamp(32px,5vw,64px)', fontWeight: 900, letterSpacing: '-3px', margin: '0 0 20px', lineHeight: 1.05 }}>
            Seu próximo laudo<br />em <span style={{ color: 'var(--indigo)' }}>5 minutos</span>.
          </h2>
          <p style={{ fontSize: 18, color: 'var(--text-sec)', marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
            Sem cartão de crédito. Sem contratos. Cancele quando quiser.
          </p>
          <a href="/cadastro" style={{ display: 'inline-block', background: 'var(--indigo)', color: '#fff', padding: '16px 36px', borderRadius: 12, fontSize: 18, fontWeight: 800, textDecoration: 'none', letterSpacing: '-0.5px' }}>
            Criar conta grátis →
          </a>
          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>Conforme as normas do CFP · LGPD compliant</p>
        </Reveal>
      </section>

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.5px' }}>PsiLaudo</span>
        <div style={{ display: 'flex', gap: 24, fontSize: 13, color: 'var(--text-muted)' }}>
          <a href="/privacidade" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacidade</a>
          <a href="/termos" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Termos</a>
          <a href="mailto:contato@psilaudo.com.br" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contato</a>
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>© 2026 PsiLaudo. Todos os direitos reservados.</span>
      </footer>

    </div>
  );
}
