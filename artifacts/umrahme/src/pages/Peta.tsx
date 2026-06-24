import { useState } from 'react';
import { Link } from 'react-router-dom';
import { lokasiByKota, daftarLokasi, type KotaFilter } from '../data/lokasi';
import type { Lokasi } from '../types';
import PageHeader from '../components/PageHeader';
import { IconPeta } from '../components/icons';

const tabs: { id: KotaFilter; label: string }[] = [
  { id: 'Makkah', label: 'Makkah' },
  { id: 'Madinah', label: 'Madinah' },
];

const PRIORITY_IDS = ['masjidil-haram', 'masjid-nabawi'];

function sortLokasi(list: Lokasi[]) {
  return [...list].sort((a, b) => {
    const ai = PRIORITY_IDS.indexOf(a.id);
    const bi = PRIORITY_IDS.indexOf(b.id);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return 0;
  });
}

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function TipeBadge({ tipe }: { tipe: string }) {
  const isMasjid = tipe === 'masjid';
  return (
    <span
      className="inline-flex h-5 flex-none items-center rounded-full px-2 font-mono text-[9px] uppercase tracking-wider"
      style={{
        background: isMasjid ? 'rgba(67,56,202,0.09)' : 'rgba(212,162,78,0.14)',
        color: isMasjid ? 'var(--color-primary,#4338ca)' : '#a07020',
        border: `1px solid ${isMasjid ? 'rgba(67,56,202,0.15)' : 'rgba(212,162,78,0.25)'}`,
      }}
    >
      {isMasjid ? 'Masjid' : 'Bersejarah'}
    </span>
  );
}

function LokasiCard({ l }: { l: Lokasi }) {
  const tipeLabel = l.tipe === 'masjid' ? 'Masjid' : 'Bersejarah';

  return (
    <Link
      to={`/peta/${l.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface-card shadow-drop-soft transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]"
    >
      {/* ── Foto atas ─────────────────────────────────── */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-bone">
        {l.gambar ? (
          <img
            src={l.gambar}
            alt={l.nama}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <>
            <div
              className="absolute inset-0 opacity-[0.18]"
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, #d4a24e 0 1px, transparent 1px 10px)' }}
              aria-hidden
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <IconPeta className="h-7 w-7 text-gold/50" />
              {l.namaArab && (
                <span className="font-arab text-[13px] text-gold/60" dir="rtl">{l.namaArab}</span>
              )}
            </div>
          </>
        )}
        {/* Bookmark button */}
        <button
          type="button"
          aria-label="Simpan"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition hover:bg-white"
        >
          <BookmarkIcon className="h-4 w-4 text-ink" />
        </button>
      </div>

      {/* ── Konten bawah ──────────────────────────────── */}
      <div className="flex flex-1 flex-col px-3.5 pt-3 pb-3.5">
        {/* Nama + badge tipe */}
        <div className="flex items-start justify-between gap-1">
          <h2 className="text-[16px] font-bold leading-snug text-ink" style={{ wordBreak: 'break-word' }}>
            {l.nama}
          </h2>
          <TipeBadge tipe={l.tipe} />
        </div>

        {/* Deskripsi singkat */}
        <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-[1.45] text-[#6b7280]">
          {l.ringkas}
        </p>

        {/* ── Garis pemisah + Statistik 3 kolom ───── */}
        <div className="mt-3 border-t border-hairline pt-2.5 flex items-start">
          {/* Kolom 1: Jarak */}
          <div className="flex flex-1 flex-col gap-[3px]">
            <span className="flex items-center gap-0.5 text-[14px] font-bold leading-none text-ink">
              <IconPeta className="h-3 w-3 flex-none text-gold" />
              {l.jarakKm}
            </span>
            <span className="font-mono text-[9.5px] uppercase tracking-widest text-[#9ca3af]">KM</span>
          </div>
          {/* Divider */}
          <div className="mx-1 h-8 w-px bg-hairline self-center" />
          {/* Kolom 2: Kota */}
          <div className="flex flex-1 flex-col gap-[3px]">
            <span className="text-[13px] font-bold leading-none text-ink">{l.kota}</span>
            <span className="font-mono text-[9.5px] uppercase tracking-widest text-[#9ca3af]">Kota</span>
          </div>
          {/* Divider */}
          <div className="mx-1 h-8 w-px bg-hairline self-center" />
          {/* Kolom 3: Tipe */}
          <div className="flex flex-1 flex-col gap-[3px]">
            <span className="text-[13px] font-bold leading-none text-ink">{tipeLabel}</span>
            <span className="font-mono text-[9.5px] uppercase tracking-widest text-[#9ca3af]">Tipe</span>
          </div>
        </div>

        {/* ── Tombol CTA ────────────────────────────── */}
        <button
          type="button"
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-[#111] py-2.5 text-[13px] font-semibold text-white transition group-hover:bg-[#222]"
        >
          <IconPeta className="h-3.5 w-3.5 text-white/60" />
          Lihat Detail
        </button>
      </div>
    </Link>
  );
}

export default function Peta() {
  const [tab, setTab] = useState<KotaFilter>('Makkah');
  const lokasi = sortLokasi(lokasiByKota(tab));

  return (
    <div>
      <PageHeader title="Peta Lokasi" eyebrow="Panduan" backTo="/panduan" />

      <div className="px-4 pt-4 pb-8 sm:px-5 lg:px-8 lg:max-w-5xl lg:mx-auto">
        {/* Tab kategori */}
        <div className="mb-3 flex gap-1.5 rounded-full border border-hairline bg-surface-bone p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`min-h-[36px] flex-1 rounded-full px-2 text-[13px] font-medium transition ${
                tab === t.id ? 'bg-primary text-on-primary' : 'text-mute active:bg-surface-card hover:text-body'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Jumlah lokasi */}
        <p className="mb-3 font-mono text-[11px] text-mute">
          {lokasi.length} lokasi
        </p>

        {/* Grid kartu */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lokasi.map((l) => (
            <LokasiCard key={l.id} l={l} />
          ))}
        </div>
      </div>
    </div>
  );
}
