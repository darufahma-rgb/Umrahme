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

function LokasiThumb({ gambar, nama }: { gambar?: string; nama: string }) {
  return (
    <div className="relative h-16 w-16 flex-none overflow-hidden rounded-md border border-hairline bg-surface-bone">
      {gambar ? (
        <img src={gambar} alt={nama} className="h-full w-full object-cover" />
      ) : (
        <>
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, #d4a24e 0 1px, transparent 1px 8px)' }}
            aria-hidden
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <IconPeta className="h-5 w-5 text-gold/60" />
          </div>
        </>
      )}
    </div>
  );
}

function LokasiThumbLarge({ gambar, nama }: { gambar?: string; nama: string }) {
  return (
    <div className="relative w-full overflow-hidden rounded-t-md bg-surface-bone" style={{ height: '100px' }}>
      {gambar ? (
        <img src={gambar} alt={nama} className="h-full w-full object-cover" />
      ) : (
        <>
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, #d4a24e 0 1px, transparent 1px 10px)' }}
            aria-hidden
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <IconPeta className="h-7 w-7 text-gold/50" />
          </div>
        </>
      )}
    </div>
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
              className="flex items-center gap-3 rounded-md border border-hairline bg-surface-card p-3 active:scale-[0.99] hover:shadow-drop-soft transition-shadow"
            >
              <LokasiThumb gambar={l.gambar} nama={l.nama} />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                      <h2 className="text-[15px] font-semibold text-ink leading-tight">{l.nama}</h2>
                      <CityBadge kota={l.kota} />
                    </div>
                    {l.namaArab && (
                      <p className="font-arab text-sm text-gold leading-loose" dir="rtl">
                        {l.namaArab}
                      </p>
                    )}
                    <p className="mt-0.5 text-xs text-charcoal line-clamp-2 leading-relaxed">{l.ringkas}</p>
                    <div className="mt-1.5 flex items-center gap-2 font-mono text-[11px] text-mute">
                      <span>{l.jarakKm} km</span>
                      {l.jamKunjungan && (
                        <>
                          <span className="text-ash">·</span>
                          <span className="truncate">{l.jamKunjungan}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <IconChevron className="h-4 w-4 flex-none text-ash mt-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Grid DESKTOP ─────────────────────────────────────────── */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-3">
          {lokasi.map((l) => {
            const isFeatured = l.id === 'masjidil-haram' || l.id === 'masjid-nabawi';
            return (
              <Link
                key={l.id}
                to={`/peta/${l.id}`}
                className={`group relative overflow-hidden rounded-md border transition-shadow hover:shadow-drop-soft ${
                  isFeatured
                    ? 'lg:col-span-2 border-hairline-strong bg-surface-card'
                    : 'lg:col-span-1 border-hairline bg-surface-card'
                }`}
              >
                {/* Thumbnail desktop */}
                <LokasiThumbLarge gambar={l.gambar} nama={l.nama} />

                <div className={`flex flex-col gap-1.5 ${isFeatured ? 'px-5 pb-5 pt-3' : 'px-4 py-3'}`}>
                  {isFeatured && (
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary/70">
                      Lokasi Utama
                    </span>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                        <h2
                          className={`font-semibold leading-tight text-ink ${isFeatured ? 'text-[17px]' : 'text-[14px]'}`}
                        >
                          {l.nama}
                        </h2>
                        <CityBadge kota={l.kota} />
                      </div>
                      {l.namaArab && (
                        <p className="font-arab text-sm text-gold leading-loose" dir="rtl">
                          {l.namaArab}
                        </p>
                      )}
                    </div>
                    <IconChevron className="h-4 w-4 flex-none text-ash mt-0.5 group-hover:text-charcoal transition-colors" />
                  </div>

                  <p
                    className={`leading-relaxed text-charcoal ${
                      isFeatured ? 'text-[13px] line-clamp-2' : 'text-[12px] line-clamp-2'
                    }`}
                  >
                    {l.ringkas}
                  </p>

                  <div className="flex items-center gap-2 font-mono text-[11px] text-mute mt-0.5">
                    <span>{l.jarakKm} km</span>
                    {l.jamKunjungan && (
                      <>
                        <span className="text-ash">·</span>
                        <span className="truncate">{l.jamKunjungan}</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
