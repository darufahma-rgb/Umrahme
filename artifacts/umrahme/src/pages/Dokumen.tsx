import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchMyJamaahDocuments, type JamaahDocumentRow, type JamaahDocumentStatus } from '../lib/supabase';

const DOCS: { type: 'paspor' | 'visa' | 'tiket'; label: string; desc: string }[] = [
  { type: 'paspor', label: 'Paspor', desc: 'Dokumen identitas perjalanan' },
  { type: 'visa', label: 'Visa Umrah', desc: 'Izin masuk Arab Saudi' },
  { type: 'tiket', label: 'Tiket Pesawat', desc: 'Penerbangan pergi dan pulang' },
];

const STATUS: Record<JamaahDocumentStatus, { label: string; hint: string; color: string; bg: string; border: string }> = {
  belum: { label: 'Belum diproses', hint: 'Travel belum memperbarui status dokumen ini.', color: '#6b7280', bg: '#f9fafb', border: 'rgba(0,0,0,0.08)' },
  proses: { label: 'Sedang diproses', hint: 'Travel sedang mengurus dokumen ini.', color: '#b45309', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.28)' },
  lengkap: { label: 'Sudah siap', hint: 'Dokumen sudah selesai diurus.', color: '#15803d', bg: 'rgba(22,163,74,0.09)', border: 'rgba(22,163,74,0.25)' },
};

function formatUpdated(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function Dokumen() {
  const { jamaah, tenant } = useAuth();
  const [rows, setRows] = useState<JamaahDocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!tenant?.id || !jamaah?.nomorJamaah) return;
    setLoading(true); setError('');
    fetchMyJamaahDocuments(tenant.id, jamaah.nomorJamaah)
      .then(setRows)
      .catch(() => setError('Status dokumen belum bisa dimuat. Coba lagi nanti.'))
      .finally(() => setLoading(false));
  }, [tenant?.id, jamaah?.nomorJamaah]);

  if (!jamaah) return null;

  const done = DOCS.filter(d => rows.find(r => r.document_type === d.type)?.status === 'lengkap').length;
  const travelName = tenant?.nama_travel ?? 'travel';

  return (
    <div className="mx-auto max-w-3xl px-5 pb-10 pt-8 lg:px-10 lg:pt-10">
      <Link to="/profil" className="mb-4 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3 rotate-180"><path d="M9 18l6-6-6-6" /></svg>
        Kembali
      </Link>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Dari Travel</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-ink lg:text-4xl" style={{ letterSpacing: '-0.5px' }}>Dokumen Saya</h1>
      <p className="mt-1.5 text-[13px] text-charcoal">Status paspor, visa, dan tiket Anda dari {travelName}.</p>

      {loading ? (
        <p className="py-10 text-center font-mono text-[12px] text-ash">Memuat status dokumen...</p>
      ) : error ? (
        <p className="mt-6 rounded-2xl border border-hairline bg-white p-5 text-center text-[13px] text-charcoal">{error}</p>
      ) : (
        <>
          <p className="mt-5 font-mono text-[11px] text-mute">{done} dari {DOCS.length} dokumen sudah siap</p>
          <div className="mt-3 space-y-3">
            {DOCS.map(doc => {
              const row = rows.find(r => r.document_type === doc.type);
              const s = STATUS[row?.status ?? 'belum'];
              return (
                <div key={doc.type} className="rounded-2xl border bg-white p-4 shadow-drop-card" style={{ borderColor: s.border }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[14px] font-bold text-ink">{doc.label}</p>
                      <p className="mt-0.5 text-[11.5px] text-charcoal">{doc.desc}</p>
                    </div>
                    <span className="flex-none rounded-full px-2.5 py-1 text-[10.5px] font-bold" style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>{s.label}</span>
                  </div>
                  <p className="mt-2.5 text-[12px] text-charcoal">{s.hint}</p>
                  {row?.note && <p className="mt-1.5 text-[12px] font-medium text-ink">Catatan: {row.note}</p>}
                  {row && <p className="mt-1.5 font-mono text-[10px] text-mute">Diperbarui {formatUpdated(row.updated_at)}</p>}
                </div>
              );
            })}
          </div>
          <p className="mt-5 text-[11.5px] text-charcoal">Ada pertanyaan soal dokumen? Hubungi pembimbing atau tour leader melalui menu bantuan di beranda.</p>
        </>
      )}
    </div>
  );
}
