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

      <div className="px-5 pt-4">
        {/* Placeholder peta — TODO(maps): ganti dengan embed Google Maps */}
        <div className="relative mb-4 flex h-32 items-center justify-center overflow-hidden rounded-2xl border border-ink-800/70 bg-ink-900/60">
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

        <div className="space-y-3">
          {lokasi.map((l) => (
            <Link
              key={l.id}
              to={`/peta/${l.id}`}
              className="flex items-center gap-3 rounded-2xl border border-ink-800/70 bg-ink-900/50 px-4 py-4 active:scale-[0.99]"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-[15px] font-semibold text-parchment-100">
                    {l.nama}
                  </h2>
                </div>
                <p className="mt-0.5 truncate text-xs text-mute-500">{l.ringkas}</p>
                <div className="mt-2 flex items-center gap-3 font-mono text-[11px] text-gold-400/90">
                  <span>{l.kota}</span>
                  <span className="text-mute-500">·</span>
                  <span>{l.jarakKm} km</span>
                </div>
              </div>
              <IconChevron className="h-4 w-4 flex-none text-mute-500" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
