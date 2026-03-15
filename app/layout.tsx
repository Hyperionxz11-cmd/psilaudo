import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PsiLaudo — Laudos Psicológicos em Minutos',
  description: 'Gere laudos psicológicos profissionais em minutos. Laudo para porte de arma, trânsito, educacional e mais. Conforme as normas do CFP.',
  keywords: 'laudo psicológico, laudo porte de arma, laudo trânsito, laudo educacional, psicólogo, gerador de laudo',
  openGraph: {
    title: 'PsiLaudo — Laudos Psicológicos em Minutos',
    description: 'Gere laudos psicológicos profissionais em minutos.',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#FAFAFA" />
      </head>
      <body>{children}</body>
    </html>
  );
}
