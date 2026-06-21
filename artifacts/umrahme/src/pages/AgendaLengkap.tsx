import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { supabase, type AgendaItemRow } from '../lib/supabase';
import { IconChevron } from '../components/icons';

function formatTanggalHeader(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatJam(jam: string | null) {
  if (!jam) return null;
  return jam.slice(0, 5);
}

function isToday(iso: string) {
  const today = new Date().toISOString().split('T')[0];
  return iso === today;
}

export default function AgendaLengkap() {
  const { tenant } = useAuth();
  const [items, setItems] = useState<AgendaItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!tenant?.id) { setLoading(false); return; }
    supabase
      .from('agenda_items')
      .select('*')
      .eq('tenant_id', tenant.id)
      .order('tanggal', { ascending: true })
      .order('jam_mulai', { ascending: true })
      .then(({ data, error: err }) => {
        if (err) { setError('Gagal memuat agenda.'); }
        else { setItems((data as AgendaItemRow[]) ?? []); }
        setLoading(false);
      });
  }, [tenant?.id]);

  // Kelompokkan per tanggal
  const grouped: Record<string, AgendaItemRow[]> = {};
  for (const item of items) {
    if (!grouped[item.tanggal]) grouped[item.tanggal] = [];
    grouped[item.tanggal].push(item);
  }
  const tanggalList = Object.keys(grouped).sort();

  return (
    <div className="min-h-screen bg-canvas">
      <PageHeader
        title="Agenda Perjalanan"
        eyebrow={tenant?.nama_travel ?? 'Agenda'}
        backTo="/beranda"
      />

      <div className="px-4 pb-10 pt-4">
        {loading && (
          <div className="py-20 text-center">
            <p className="font-mono text-[12px] uppercase tracking-widest text-stone">Memuat agenda...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4">
            <p className="text-[13px] text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && tanggalList.length === 0 && (
          <div className="py-20 text-center">
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ background: 'rgba(14,165,233,0.08)', border: '1.5px solid rgba(14,165,233,0.15)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2 v4 M8 2 v4 M3 10 h18" />
              </svg>
            </div>
            <p className="text-[15px] font-semibold text-ink">Belum ada agenda</p>
            <p className="mt-1 text-[13px] text-charcoal">Admin travel belum menambahkan jadwal perjalanan.</p>
          </div>
        )}

        {!loading && tanggalList.length > 0 && (
          <div className="space-y-6">
            {tanggalList.map((tgl) => {
              const hari = grouped[tgl];
              const today = isToday(tgl);
              return (
                <div key={tgl}>
                  {/* Tanggal header */}
                  <div className="mb-2 flex items-center gap-2.5">
                    <div
                      className="h-2 w-2 rounded-full flex-none"
                      style={{ background: today ? 'var(--color-primary)' : '#d1d5db' }}
                    />
                    <p
                      className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em]"
                      style={{ color: today ? 'var(--color-primary)' : '#6b7280' }}
                    >
                      {formatTanggalHeader(tgl)}
                      {today && (
                        <span className="ml-2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest" style={{ background: 'var(--color-primary)', color: '#fff', letterSpacing: '0.12em' }}>
                          Hari Ini
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Item list */}
                  <div className="space-y-2 pl-4" style={{ borderLeft: `2px solid ${today ? 'var(--color-primary)' : '#e5e7eb'}`, paddingLeft: '16px' }}>
                    {hari.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border bg-white px-4 py-3.5"
                        style={{ borderColor: today ? 'rgba(14,165,233,0.14)' : 'rgba(0,0,0,0.06)' }}
                      >
                        <div className="flex items-start gap-3">
                          {/* Jam */}
                          <div className="flex-none pt-0.5">
                            {formatJam(item.jam_mulai) ? (
                              <span className="font-mono text-[12px] font-bold" style={{ color: 'var(--color-primary)' }}>
                                {formatJam(item.jam_mulai)}
                              </span>
                            ) : (
                              <span className="font-mono text-[12px]" style={{ color: '#d1d5db' }}>—:—</span>
                            )}
                          </div>

                          {/* Konten */}
                          <div className="min-w-0 flex-1">
                            <p className="text-[14px] font-semibold leading-snug text-ink">{item.judul}</p>
                            {item.lokasi && (
                              <p className="mt-0.5 flex items-center gap-1 text-[12px] text-charcoal">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" /><circle cx="12" cy="10" r="3" />
                                </svg>
                                {item.lokasi}
                              </p>
                            )}
                            {item.deskripsi && (
                              <p className="mt-1 text-[12px] leading-relaxed text-mute">{item.deskripsi}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA kembali ke beranda */}
        {!loading && tanggalList.length > 0 && (
          <Link
            to="/beranda"
            className="mt-8 flex items-center justify-center gap-2 rounded-2xl border border-hairline bg-white px-5 py-3.5 text-[13px] font-semibold text-charcoal transition-all active:scale-[0.98]"
          >
            Kembali ke Beranda <IconChevron className="h-3.5 w-3.5 rotate-180" />
          </Link>
        )}
      </div>
    </div>
  );
}
