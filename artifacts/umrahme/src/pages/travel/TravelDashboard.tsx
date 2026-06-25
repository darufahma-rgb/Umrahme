import React from 'react';
import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { useTravelAuth } from '../../context/TravelAuthContext';
import TravelLayout from '../../components/travel/TravelLayout';
import { fetchJamaah, createJamaah, deleteJamaah, updateJamaah, type JamaahAccountRow } from '../../lib/supabase';

const FASE_OPTIONS: { value: JamaahAccountRow['fase']; label: string }[] = [
  { value: 'persiapan', label: 'Persiapan' },
  { value: 'tanah-suci', label: 'Di Tanah Suci' },
  { value: 'selesai', label: 'Selesai' },
];

const inputBase: React.CSSProperties = {
  border: '1px solid rgba(0,0,0,0.09)',
  background: '#fafaf9',
  color: '#111827',
  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
};

function StyledInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl px-4 py-3 text-sm transition-all duration-150 focus:outline-none ${props.className ?? ''}`}
      style={{ ...inputBase, ...props.style }}
      onFocus={e => {
        e.currentTarget.style.border = '1px solid #0ea5e9';
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.12)';
        e.currentTarget.style.background = '#ffffff';
        props.onFocus?.(e);
      }}
      onBlur={e => {
        e.currentTarget.style.border = '1px solid rgba(0,0,0,0.09)';
        e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.04)';
        e.currentTarget.style.background = '#fafaf9';
        props.onBlur?.(e);
      }}
    />
  );
}

const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid rgba(0,0,0,0.06)',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)',
};

export default function TravelDashboard() {
  const { tenant } = useTravelAuth();

  const [jamaahList, setJamaahList] = useState<JamaahAccountRow[]>([]);
  const [jamaahLoading, setJamaahLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const slugUrl = tenant?.slug
    ? `${window.location.origin}/t/${tenant.slug}`
    : null;

  const handleCopySlug = useCallback(() => {
    if (!slugUrl) return;
    navigator.clipboard.writeText(slugUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [slugUrl]);

  // Form tambah jamaah
  const [jmNama, setJmNama] = useState('');
  const [jmNomorJamaah, setJmNomorJamaah] = useState('');
  const [jmRombongan, setJmRombongan] = useState('');
  const [jmBus, setJmBus] = useState('');
  const [jmKamar, setJmKamar] = useState('');
  const [jmFase, setJmFase] = useState<JamaahAccountRow['fase']>('persiapan');
  const [jmError, setJmError] = useState('');
  const [jmSubmitting, setJmSubmitting] = useState(false);

  async function loadJamaah() {
    if (!tenant?.id) return;
    setJamaahLoading(true);
    fetchJamaah(tenant.id).then(setJamaahList).catch(() => {}).finally(() => setJamaahLoading(false));
  }

  useEffect(() => {
    loadJamaah();
  }, [tenant?.id]);

  async function handleAddJamaah(e: FormEvent) {
    e.preventDefault();
    if (!tenant?.id) return;
    setJmError('');
    setJmSubmitting(true);

    try {
      await createJamaah(tenant.id, null, { nama: jmNama.trim(), nomor_jamaah: jmNomorJamaah.trim(), rombongan: jmRombongan.trim() || null, nomor_bus: jmBus.trim() || null, nomor_kamar: jmKamar.trim() || null, fase: jmFase });
      setJmNama(''); setJmNomorJamaah(''); setJmRombongan(''); setJmBus(''); setJmKamar(''); setJmFase('persiapan');
      await loadJamaah();
    } catch (err: unknown) {
      setJmError(err instanceof Error ? err.message : 'Gagal menambah jamaah.');
    }
    setJmSubmitting(false);
  }

  async function handleDeleteJamaah(jamaahId: string, nama: string) {
    if (!tenant?.id || !confirm(`Hapus jamaah "${nama}"? Akses login mereka akan dicabut.`)) return;
    await deleteJamaah(tenant.id, jamaahId);
    setJamaahList(prev => prev.filter(j => j.id !== jamaahId));
  }

  async function handleUpdateFase(jamaahId: string, val: string) {
    if (!tenant?.id) return;
    const fase_override = (val === '' ? null : val) as JamaahAccountRow['fase'] | null;
    await updateJamaah(tenant.id, jamaahId, { fase_override } as Partial<JamaahAccountRow>);
    setJamaahList(prev => prev.map(j => j.id === jamaahId ? { ...j, fase_override } : j));
  }

  if (!tenant) {
    return (
      <TravelLayout>
        <div className="py-20 text-center">
          <p className="text-[15px] font-semibold" style={{ color: '#374151' }}>
            Akun ini belum terhubung ke tenant manapun.
          </p>
          <p className="text-[13px] mt-1" style={{ color: '#9ca3af' }}>
            Hubungi administrator untuk menghubungkan akun Anda ke travel agency.
          </p>
        </div>
      </TravelLayout>
    );
  }

  return (
    <TravelLayout>
      {/* ── Info Tenant ── */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: '#9ca3af' }}>
              Portal Travel Agency
            </p>
            <h1 className="font-bold" style={{ fontSize: '28px', color: '#111827', letterSpacing: '-0.02em' }}>
              {tenant.nama_travel}
            </h1>
          </div>
          {/* Ringkasan statistik */}
          <div className="flex gap-3 flex-none">
            <div className="rounded-2xl px-5 py-3 text-center" style={cardStyle}>
              <p className="font-mono text-[28px] font-bold" style={{ color: '#111827', letterSpacing: '-1px' }}>
                {jamaahList.length}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] mt-0.5" style={{ color: '#9ca3af' }}>
                Total Jamaah
              </p>
              {/* TODO: track last_login untuk hitung "sudah aktivasi" */}
            </div>
          </div>
        </div>

        {/* Kode aktivasi — read only */}
        <div className="mt-4 inline-flex items-center gap-3 rounded-xl px-4 py-3"
          style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.14)' }}>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em]" style={{ color: '#0ea5e9' }}>
              Kode Aktivasi Jamaah
            </p>
            <p className="font-mono text-[20px] font-bold tracking-[0.12em]" style={{ color: '#0284c7', letterSpacing: '0.1em' }}>
              {tenant.activation_code}
            </p>
          </div>
          <div className="h-10 w-px" style={{ background: 'rgba(14,165,233,0.18)' }} />
          <p className="text-[12px] max-w-[220px]" style={{ color: '#0369a1' }}>
            Bagikan kode ini ke jamaah untuk login ke aplikasi.
          </p>
        </div>

        {/* Link slug branded — tampil hanya jika tenant punya slug */}
        {slugUrl && (
          <div className="mt-3 flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.18)' }}>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em]" style={{ color: '#059669' }}>
                Link Login Branded
              </p>
              <p className="font-mono text-[12px] font-semibold truncate mt-0.5" style={{ color: '#047857' }}>
                {slugUrl}
              </p>
            </div>
            <button
              onClick={handleCopySlug}
              className="flex-none flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold transition-all active:scale-95"
              style={{
                background: copied ? 'rgba(16,185,129,0.18)' : 'rgba(16,185,129,0.12)',
                color: '#059669',
                border: '1px solid rgba(16,185,129,0.22)',
              }}
            >
              {copied ? (
                <>
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Tersalin!
                </>
              ) : (
                <>
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Salin Link
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* ── Form Tambah Jamaah ── */}
      <div className="mb-5">
        <h2 className="font-bold mb-4" style={{ fontSize: '18px', color: '#111827', letterSpacing: '-0.02em' }}>
          Daftar Jamaah
        </h2>

        <div className="rounded-2xl px-6 py-6 mb-4"
          style={{ ...cardStyle, border: '1px solid rgba(14,165,233,0.14)' }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] mb-4" style={{ color: '#6b7280' }}>
            Tambah Jamaah Baru
          </p>
          <form onSubmit={handleAddJamaah} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>
                  Nama Lengkap <span style={{ color: '#f87171' }}>*</span>
                </p>
                <StyledInput
                  type="text"
                  value={jmNama}
                  onChange={e => setJmNama(e.target.value)}
                  placeholder="Sesuai data pendaftaran"
                  required
                />
              </div>
              <div>
                <p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>
                  Nomor Jamaah <span style={{ color: '#f87171' }}>*</span>
                </p>
                <StyledInput
                  type="text"
                  value={jmNomorJamaah}
                  onChange={e => setJmNomorJamaah(e.target.value)}
                  placeholder="UMR-2026-0001"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Rombongan</p>
                <StyledInput
                  type="text"
                  value={jmRombongan}
                  onChange={e => setJmRombongan(e.target.value)}
                  placeholder="Rombongan A"
                />
              </div>
              <div>
                <p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Nomor Bus</p>
                <StyledInput
                  type="text"
                  value={jmBus}
                  onChange={e => setJmBus(e.target.value)}
                  placeholder="Bus 3"
                />
              </div>
              <div>
                <p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Nomor Kamar</p>
                <StyledInput
                  type="text"
                  value={jmKamar}
                  onChange={e => setJmKamar(e.target.value)}
                  placeholder="804"
                />
              </div>
            </div>
            <div style={{ maxWidth: '200px' }}>
              <p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Fase</p>
              <select
                value={jmFase}
                onChange={e => setJmFase(e.target.value as JamaahAccountRow['fase'])}
                className="w-full rounded-xl px-4 py-3 text-sm transition-all duration-150 focus:outline-none appearance-none"
                style={{ ...inputBase, cursor: 'pointer' }}
                onFocus={e => {
                  e.currentTarget.style.border = '1px solid #0ea5e9';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.12)';
                  e.currentTarget.style.background = '#ffffff';
                }}
                onBlur={e => {
                  e.currentTarget.style.border = '1px solid rgba(0,0,0,0.09)';
                  e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.04)';
                  e.currentTarget.style.background = '#fafaf9';
                }}
              >
                {FASE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {jmError && (
              <p className="text-[12px]" style={{ color: '#dc2626' }}>{jmError}</p>
            )}

            <button
              type="submit"
              disabled={jmSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 text-[12px] font-semibold rounded-xl transition-all duration-150 disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(14,165,233,0.28)',
              }}
            >
              {jmSubmitting ? (
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              )}
              Tambah Jamaah
            </button>
          </form>
        </div>

        {/* ── Tabel Daftar Jamaah ── */}
        <div className="rounded-2xl overflow-hidden" style={cardStyle}>
          {jamaahLoading ? (
            <div className="py-10 text-center font-mono text-[12px]" style={{ color: '#d1d5db' }}>
              Memuat daftar jamaah...
            </div>
          ) : jamaahList.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-[13px]" style={{ color: '#9ca3af' }}>
                Belum ada jamaah terdaftar. Tambahkan jamaah pertama di atas.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: '#fafaf9' }}>
                    {['Nama', 'No. Jamaah', 'Rombongan', 'Bus', 'Kamar', 'Fase', ''].map(h => (
                      <th
                        key={h}
                        className="text-left font-mono text-[10px] uppercase tracking-[0.12em] px-4 py-3 whitespace-nowrap"
                        style={{ color: '#9ca3af' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {jamaahList.map((j, i) => (
                    <tr
                      key={j.id}
                      style={{ borderBottom: i < jamaahList.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}
                    >
                      <td className="px-4 py-3.5 text-[13px] font-semibold" style={{ color: '#111827' }}>
                        {j.nama}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px]" style={{ color: '#6b7280' }}>
                        {j.nomor_jamaah}
                      </td>
                      <td className="px-4 py-3.5 text-[12px]" style={{ color: '#6b7280' }}>
                        {j.rombongan ?? '—'}
                      </td>
                      <td className="px-4 py-3.5 text-[12px]" style={{ color: '#6b7280' }}>
                        {j.nomor_bus ?? '—'}
                      </td>
                      <td className="px-4 py-3.5 text-[12px]" style={{ color: '#6b7280' }}>
                        {j.nomor_kamar ?? '—'}
                      </td>
                      <td className="px-4 py-3.5">
                        <select
                          value={j.fase_override ?? ''}
                          onChange={e => handleUpdateFase(j.id, e.target.value)}
                          className="rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all duration-150 focus:outline-none appearance-none cursor-pointer"
                          style={{
                            border: '1px solid rgba(0,0,0,0.09)',
                            background:
                              j.fase_override === 'persiapan'
                                ? 'rgba(245,158,11,0.08)'
                                : j.fase_override === 'tanah-suci'
                                ? 'rgba(16,185,129,0.08)'
                                : j.fase_override === 'selesai'
                                ? 'rgba(107,114,128,0.08)'
                                : 'rgba(99,102,241,0.08)',
                            color:
                              j.fase_override === 'persiapan'
                                ? '#b45309'
                                : j.fase_override === 'tanah-suci'
                                ? '#059669'
                                : j.fase_override === 'selesai'
                                ? '#6b7280'
                                : '#4f46e5',
                          }}
                        >
                          <option value="">Otomatis (dari jadwal)</option>
                          {FASE_OPTIONS.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteJamaah(j.id, j.nama)}
                          className="font-mono text-[11px] px-3 py-1.5 rounded-lg transition-all duration-150"
                          style={{ color: '#9ca3af', border: '1px solid rgba(0,0,0,0.07)' }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.color = '#dc2626';
                            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(220,38,38,0.25)';
                            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.05)';
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af';
                            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.07)';
                            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                          }}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </TravelLayout>
  );
}
