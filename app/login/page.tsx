'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) { setError(err.message); setLoading(false); return; }
    router.push('/dashboard');
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <a href="/" style={{ fontWeight: 900, fontSize: 22, letterSpacing: '-1.5px', color: 'var(--text)', textDecoration: 'none', marginBottom: 40 }}>PsiLaudo</a>
      <div style={{ width: '100%', maxWidth: 400, background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: '40px 36px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-1.5px', margin: '0 0 6px' }}>Entrar</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28 }}>Bem-vindo de volta.</p>
        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '12px 14px', fontSize: 13, color: '#DC2626', marginBottom: 20 }}>
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-sec)' }}>E-mail</label>
          <input
            type="email" required value={email} onChange={e => setEmail(e.target.value)}
            placeholder="seuemail@email.com"
            style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, marginBottom: 16, outline: 'none', boxSizing: 'border-box', background: '#FAFAFA', color: 'var(--text)' }}
          />
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-sec)' }}>Senha</label>
          <input
            type="password" required value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, marginBottom: 24, outline: 'none', boxSizing: 'border-box', background: '#FAFAFA', color: 'var(--text)' }}
          />
          <button
            type="submit" disabled={loading}
            style={{ width: '100%', background: loading ? '#9CA3AF' : 'var(--indigo)', color: '#fff', border: 'none', borderRadius: 8, padding: '13px', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '-0.3px' }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 20, marginBottom: 0 }}>
          Não tem conta?{' '}
          <a href="/cadastro" style={{ color: 'var(--indigo)', fontWeight: 600, textDecoration: 'none' }}>Cadastre-se grátis</a>
        </p>
      </div>
    </div>
  );
}
