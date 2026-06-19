import { useState } from 'react';
import { Link } from 'react-router-dom';
import { lokasiByTipe } from '../data/lokasi';
import type { TipeLokasi } from '../types';
import PageHeader from '../components/PageHeader';
import { IconChevron, IconPeta } from '../components/icons';

const tabs: { id: TipeLokasi; label: string }[] = [
  { id: 'masjid', label: 'Masjid' },
  { id: 'sejarah', label: 'Tempat Bersejarah' },
];

export default function Peta() {
  const [tab, setTab] = useState<TipeLokasi>('masjid');
  const lokasi = lokasiByTipe(tab);

  return (
    <div>
      <PageHeader title="Peta Lokasi" eyebrow="Panduan" backTo="/panduan" />

      <div className="px-5 pt-4 lg:px-8 lg:max-w-5xl lg:mx-auto">
        {/* Placeholder peta */}
        <div className="relative mb-4 flex h-32 lg:h-44 items-center justify-center overflow-hidden rounded-2xl border border-ink-800/70 bg-ink-900/60">
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, #C2185B 0 1px, transparent 1px 14px)',
            }}
            aria-hidden
          />
          <div className="relative text-center">
            <IconPeta className="mx-auto h-6 w-6 text-rose-400" />
            <p className="mt-1.5 font-mono text-[11px] uppercase tracking-wider text-mute-500">
              Peta interaktif — segera hadir
            </p>
          </div>
        </div>

        {/* Tab kategori */}
        <div className="mb-4 flex gap-1.5 rounded-xl border border-ink-800 bg-ink-900/60 p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`min-h-[40px] flex-1 rounded-lg px-2 text-[13px] font-medium transition ${
                tab === t.id ? 'bg-rose-600 text-parchment-100' : 'text-mute-500 active:bg-ink-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* List mobile — tidak berubah */}
        <div className="space-y-3 lg:hidden">
          {lokasi.map((l) => (
            <Link
              key={l.id}
              to={`/peta/${l.id}`}
              className="flex items-center gap-3 rounded-2xl border border-ink-800/70 bg-ink-900/50 px-4 py-4 active:scale-[0.99]"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="truncate text-[15px] font-semibold text-parchment-100">{l.nama}</h2>
                  <IconChevron className="h-4 w-4 flex-none text-mute-500" />
                </div>
                <p className="mt-0.5 truncate text-xs text-mute-500">{l.ringkas}</p>
                <div className="mt-2 flex items-center gap-3 font-mono text-[11px] text-gold-400/90">
                  <span>{l.kota}</span>
                  <span className="text-mute-500">·</span>
                  <span>{l.jarakKm} km</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Grid desktop — bento asimetris, lokasi utama lebih besar */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-3">
          {lokasi.map((l) => {
            const isFeatured = l.id === 'masjidil-haram' || l.id === 'masjid-nabawi';
            return (
              <Link
                key={l.id}
                to={`/peta/${l.id}`}
                className={`group relative overflow-hidden rounded-2xl border transition-colors hover:border-ink-700 ${
                  isFeatured ? 'lg:col-span-2' : 'lg:col-span-1'
                } ${isFeatured ? 'border-ink-800/80' : 'border-ink-800/60'}`}
                style={{
                  background: isFeatured
                    ? 'radial-gradient(ellipse at 90% 10%, rgba(194,24,91,0.07) 0%, transparent 50%), linear-gradient(155deg, #18090F 0%, #0D0509 100%)'
                    : 'linear-gradient(155deg, #18090F 0%, #0D0509 100%)',
                }}
              >
                {/* Mihrab arc signature — hanya pada kartu featured */}
                {isFeatured && (
                  <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="block w-full h-[14px]" aria-hidden>
                    <path
                      d="M0,10 L0,6 C0,2 24,0.3 50,0.3 C76,0.3 100,2 100,6 L100,10"
                      fill="transparent"
                      stroke="#D4A24E"
                      strokeWidth="1"
                      strokeOpacity="0.45"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                )}

                <div className={`flex flex-col gap-2 ${isFeatured ? 'px-5 pb-5 pt-2' : 'px-4 py-4'}`}>
                  {isFeatured && (
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-rose-400/70">
                      Lokasi Utama
                    </span>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <h2
                      className={`font-semibold leading-tight text-parchment-100 ${
                        isFeatured ? 'text-[18px]' : 'text-[14px]'
                      }`}
                    >
                      {l.nama}
                    </h2>
                    <IconChevron className="h-4 w-4 flex-none text-mute-500 mt-0.5 group-hover:text-parchment-100/50 transition-colors" />
                  </div>
                  <p
                    className={`leading-relaxed text-mute-500 ${
                      isFeatured ? 'text-[13px] line-clamp-2' : 'text-[12px] line-clamp-1'
                    }`}
                  >
                    {l.ringkas}
                  </p>
                  <div className="flex items-center gap-3 font-mono text-[11px] text-gold-400/80 mt-1">
                    <span>{l.kota}</span>
                    <span className="text-mute-500">·</span>
                    <span>{l.jarakKm} km</span>
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
