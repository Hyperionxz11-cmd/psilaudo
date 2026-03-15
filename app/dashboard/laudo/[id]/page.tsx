export const dynamic = 'force-dynamic';
import LaudoViewClient from './LaudoViewClient';

export default function LaudoPage({ params }: { params: { id: string } }) {
  return <LaudoViewClient id={params.id} />;
}
