'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../lib/supabase';

interface Laudo {
  id: string;
  tipo: string;
  paciente_nome: string;
  conteudo: string;
  created_at: string;
  status: string;
}

export default function LaudoViewClient({ id }: { id: string }) {
  const [laudo, setLaudo] = useState<Laudo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      const { data } = await supabase.from('laudos').select('*').eq('id', id).eq('user_id', user.id).single();
      setLaudo(data);
      setLoading(false);
    })();
  }, [id, router]);

  function handleCopy() {
    if (!laudo) return;
    navigator.clipboard.writeText(laudo.conteudo);
    alert('Laudo copiado para a área de transferência!');
  }

  function handlePrint() {
    window.print();
  }

  function handleDownloadTxt() {
    if (!laudo) return;
    const blob = new Blob([laudo.conteudo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laudo_${laudo.paciente_nome.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--indigo)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  if (!laudo) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 40 }}>🔍</div>
      <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Laudo não encontrado.</p>
      <button onClick={() => router.push('/dashboard')} style={{ background: 'var(--indigo)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 700 }}>
        Voltar ao Dashboard
      </button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Nav */}
      <nav className="no-print" style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'var(--text-sec)', padding: 0 }}>
          ← Dashboard
        </button>
        <span style={{ fontWeight: 900, fontSize: 16, letterSpacing: '-0.5px' }}>PsiLaudo</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleCopy} style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 7, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--text-sec)' }}>
            Copiar
          </button>
          <button onClick={handleDownloadTxt} style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 7, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--text-sec)' }}>
            ⬇ .txt
          </button>
          <button onClick={handlePrint} style={{ background: 'var(--indigo)', color: '#fff', border: 'none', borderRadius: 7, padding: '7px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            🖨 Imprimir / PDF
          </button>
        </div>
      </nav>

      {/* Laudo content */}
      <div style={{ maxWidth: 760, margin: '40px auto', padding: '0 24px' }}>
        <div className="no-print" style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
            Gerado em {new Date(laudo.created_at).toLocaleDateString('pt-BR')} às {new Date(laudo.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-1px', margin: '0 0 4px' }}>{laudo.paciente_nome}</h1>
        </div>

        <div id="laudo-content" style={{
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '48px',
          fontFamily: '"Courier New", "Courier", monospace',
          fontSize: 13,
          lineHeight: 1.8,
          color: '#111',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}>
          {laudo.conteudo}
        </div>

        <div className="no-print" style={{ marginTop: 20, padding: '16px 20px', background: 'var(--indigo-light)', borderRadius: 10, fontSize: 13, color: 'var(--indigo)', fontWeight: 500 }}>
          💡 <strong>Dica:</strong> Use "Imprimir / PDF" e selecione "Salvar como PDF" para exportar. Adicione sua assinatura digital ou carimbada antes de entregar.
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          #laudo-content { border: none !important; border-radius: 0 !important; padding: 0 !important; box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}
