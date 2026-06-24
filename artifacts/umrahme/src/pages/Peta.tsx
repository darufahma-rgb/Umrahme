import { useState } from 'react';
import { Link } from 'react-router-dom';
import { lokasiByTipe, daftarLokasi } from '../data/lokasi';
import type { TipeLokasi } from '../types';
import PageHeader from '../components/PageHeader';
import { IconChevron, IconPeta } from '../components/icons';

const tabs: { id: TipeLokasi; label: string }[] = [
  { id: 'masjid', label: 'Masjid' },
  { id: 'sejarah', label: 'Tempat Bersejarah' },
];

function CityBadge({ kota }: { kota: string }) {
  const isMakkah = kota === 'Makkah';
  const isArafah = kota === 'Arafah';
  return (
    <span
      className="inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide"
      style={{
        background: isMakkah ? 'rgba(212,162,78,0.14)' : isArafah ? 'rgba(212,162,78,0.08)' : 'rgba(var(--color-primary-rgb,67,56,202),0.09)',
        color: isMakkah ? '#a07020' : isArafah ? '#8a6010' : 'var(--color-primary)',
        border: `1px solid ${isMakkah ? 'rgba(212,162,78,0.25)' : isArafah ? 'rgba(212,162,78,0.15)' : 'rgba(var(--color-primary-rgb,67,56,202),0.15)'}`,
      }}
    >
      {kota}
    </span>
  );
}


const KOTA_ORDER: Record<string, number> = { Makkah: 0, Arafah: 1, Madinah: 2 };
const PRIORITY_IDS = ['masjidil-haram', 'masjid-nabawi'];

function sortLokasi(list: ReturnType<typeof lokasiByTipe>) {
  return [...list].sort((a, b) => {
    const ai = PRIORITY_IDS.indexOf(a.id);
    const bi = PRIORITY_IDS.indexOf(b.id);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return (KOTA_ORDER[a.kota] ?? 3) - (KOTA_ORDER[b.kota] ?? 3);
  });
}

export default function Peta() {
  const [tab, setTab] = useState<TipeLokasi>('masjid');
  const lokasi = sortLokasi(lokasiByTipe(tab));

  const totalMasjid = daftarLokasi.filter((l) => l.tipe === 'masjid').length;
  const totalSejarah = daftarLokasi.filter((l) => l.tipe === 'sejarah').length;

  return (
    <div>
      <PageHeader title="Peta Lokasi" eyebrow="Panduan" backTo="/panduan" />

      <div className="px-5 pt-4 pb-8 lg:px-8 lg:max-w-5xl lg:mx-auto">
        {/* Banner informasi */}
        <div className="relative mb-4 flex h-28 lg:h-36 items-center justify-center overflow-hidden rounded-md border border-hairline bg-surface-bone">
          <div
            className="absolute inset-0 opacity-[0.20]"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, var(--color-primary,#4338ca) 0 1px, transparent 1px 14px)' }}
            aria-hidden
          />
          <div className="relative text-center">
            <IconPeta className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-1.5 font-mono text-[11px] uppercase tracking-wider text-mute">
              Ketuk lokasi untuk lihat detail &amp; Google Maps
            </p>
          </div>
        </div>

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

        {/* Jumlah lokasi per tab */}
        <p className="mb-3 font-mono text-[11px] text-mute">
          {tab === 'masjid' ? totalMasjid : totalSejarah} lokasi
        </p>

        {/* ── List MOBILE ─────────────────────────────────────────── */}
        <div className="space-y-2.5 lg:hidden">
          {lokasi.map((l) => (
            <Link
              key={l.id}
              to={`/peta/${l.id}`}
              className="group flex gap-3.5 rounded-xl border border-hairline bg-surface-card p-3 active:scale-[0.99] hover:border-hairline-strong hover:shadow-drop-soft transition-all"
            >
              {/* Thumbnail kiri — ukuran tetap, tidak menyusut */}
              <div className="relative h-[72px] w-[72px] flex-none overflow-hidden rounded-lg bg-surface-bone">
                {l.gambar ? (
                  <img src={l.gambar} alt={l.nama} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <>
                    <div className="absolute inset-0 opacity-[0.18]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #d4a24e 0 1px, transparent 1px 8px)' }} aria-hidden />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <IconPeta className="h-5 w-5 text-gold/60" />
                    </div>
                  </>
                )}
              </div>

              {/* Konten kanan */}
              <div className="flex min-w-0 flex-1 flex-col justify-center py-0.5">
                {/* Baris 1: nama + badge kota */}
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-[15px] font-bold leading-tight text-ink">{l.nama}</h2>
                  <span className={`flex-none rounded-md px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                    l.kota === 'Madinah' ? 'bg-primary/10 text-primary' : 'bg-gold/15 text-gold'
                  }`}>
                    {l.kota}
                  </span>
                </div>

                {/* Baris 2: nama arab */}
                {l.namaArab && (
                  <p className="mt-0.5 font-arab text-[15px] leading-snug text-gold" dir="rtl">
                    {l.namaArab}
                  </p>
                )}

                {/* Baris 3: ringkas (maks 2 baris) */}
                <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-charcoal">{l.ringkas}</p>

                {/* Baris 4: meta — jarak saja, ringkas, tidak wrap */}
                <div className="mt-1.5 flex items-center gap-1.5 font-mono text-[10.5px] text-mute">
                  <IconPeta className="h-3 w-3 text-gold/70" />
                  <span>{l.jarakKm} km dari pusat</span>
                </div>
              </div>

              {/* Chevron */}
              <div className="flex flex-none items-center">
                <IconChevron className="h-4 w-4 text-ash group-hover:text-charcoal transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        {/* ── Grid DESKTOP ─────────────────────────────────────────── */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-3">
          {lokasi.map((l) => (
            <Link
              key={l.id}
              to={`/peta/${l.id}`}
              className="group flex gap-4 rounded-xl border border-hairline bg-surface-card p-3.5 transition-all hover:border-hairline-strong hover:shadow-drop-soft"
            >
              {/* Thumbnail */}
              <div className="relative h-24 w-24 flex-none overflow-hidden rounded-lg bg-surface-bone">
                {l.gambar ? (
                  <img src={l.gambar} alt={l.nama} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                ) : (
                  <>
                    <div className="absolute inset-0 opacity-[0.18]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #d4a24e 0 1px, transparent 1px 8px)' }} aria-hidden />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <IconPeta className="h-6 w-6 text-gold/60" />
                    </div>
                  </>
                )}
              </div>

              {/* Konten */}
              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-[16px] font-bold leading-tight text-ink">{l.nama}</h2>
                  <span className={`flex-none rounded-md px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                    l.kota === 'Madinah' ? 'bg-primary/10 text-primary' : 'bg-gold/15 text-gold'
                  }`}>
                    {l.kota}
                  </span>
                </div>
                {l.namaArab && (
                  <p className="mt-0.5 font-arab text-[15px] leading-snug text-gold" dir="rtl">{l.namaArab}</p>
                )}
                <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-charcoal">{l.ringkas}</p>
                <div className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] text-mute">
                  <IconPeta className="h-3 w-3 text-gold/70" />
                  <span>{l.jarakKm} km dari pusat</span>
                </div>
              </div>

              <div className="flex flex-none items-center">
                <IconChevron className="h-4 w-4 text-ash group-hover:text-charcoal transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
