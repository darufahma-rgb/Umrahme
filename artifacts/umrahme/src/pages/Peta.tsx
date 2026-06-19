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

        {/* List mobile / Grid desktop */}
        <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-3">
          {lokasi.map((l) => (
            <Link
              key={l.id}
              to={`/peta/${l.id}`}
              className="flex items-center gap-3 rounded-2xl border border-ink-800/70 bg-ink-900/50 px-4 py-4 transition-colors hover:border-ink-700 hover:bg-ink-900 active:scale-[0.99] lg:flex-col lg:items-start lg:gap-3"
            >
              <div className="min-w-0 flex-1 lg:flex-none lg:w-full">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="truncate text-[15px] font-semibold text-parchment-100">{l.nama}</h2>
                  <IconChevron className="h-4 w-4 flex-none text-mute-500 lg:hidden" />
                </div>
                <p className="mt-0.5 truncate text-xs text-mute-500 lg:whitespace-normal lg:line-clamp-2">
                  {l.ringkas}
                </p>
                <div className="mt-2 flex items-center gap-3 font-mono text-[11px] text-gold-400/90">
                  <span>{l.kota}</span>
                  <span className="text-mute-500">·</span>
                  <span>{l.jarakKm} km</span>
                </div>
              </div>
              {/* Chevron desktop — sudut kanan atas */}
              <div className="hidden lg:flex w-full justify-end">
                <span className="font-mono text-[10px] uppercase tracking-wider text-rose-400 flex items-center gap-1">
                  Detail <IconChevron className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
