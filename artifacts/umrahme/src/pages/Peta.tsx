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

      <div className="px-5 pt-4 pb-8 lg:px-8 lg:max-w-5xl lg:mx-auto">
        {/* Banner informasi */}
        <div className="relative mb-4 flex h-32 lg:h-44 items-center justify-center overflow-hidden rounded-md border border-hairline bg-surface-bone">
          <div
            className="absolute inset-0 opacity-[0.25]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, #0ea5e9 0 1px, transparent 1px 14px)',
            }}
            aria-hidden
          />
          <div className="relative text-center">
            <IconPeta className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-1.5 font-mono text-[11px] uppercase tracking-wider text-mute">
              Ketuk lokasi untuk lihat detail & Google Maps
            </p>
          </div>
        </div>

        {/* Tab kategori */}
        <div className="mb-4 flex gap-1.5 rounded-full border border-hairline bg-surface-bone p-1">
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

        {/* List mobile */}
        <div className="space-y-3 lg:hidden">
          {lokasi.map((l) => (
            <Link
              key={l.id}
              to={`/peta/${l.id}`}
              className="flex items-center gap-3 rounded-md border border-hairline bg-surface-card px-4 py-4 active:scale-[0.99] hover:shadow-drop-soft transition-shadow"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="truncate text-[15px] font-semibold text-ink">{l.nama}</h2>
                  <IconChevron className="h-4 w-4 flex-none text-ash" />
                </div>
                {l.namaArab && (
                  <p className="text-right font-arab text-sm text-gold leading-loose" dir="rtl">
                    {l.namaArab}
                  </p>
                )}
                <p className="mt-0.5 truncate text-xs text-charcoal">{l.ringkas}</p>
                <div className="mt-2 flex items-center gap-3 font-mono text-[11px] text-gold">
                  <span>{l.kota}</span>
                  <span className="text-ash">·</span>
                  <span>{l.jarakKm} km</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Grid desktop */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-3">
          {lokasi.map((l) => {
            const isFeatured = l.id === 'masjidil-haram' || l.id === 'masjid-nabawi';
            return (
              <Link
                key={l.id}
                to={`/peta/${l.id}`}
                className={`group relative overflow-hidden rounded-md border transition-shadow hover:shadow-drop-soft ${
                  isFeatured ? 'lg:col-span-2 border-hairline-strong bg-surface-card' : 'lg:col-span-1 border-hairline bg-surface-card'
                }`}
              >
                {isFeatured && (
                  <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="block w-full h-[14px]" aria-hidden>
                    <path
                      d="M0,10 L0,6 C0,2 24,0.3 50,0.3 C76,0.3 100,2 100,6 L100,10"
                      fill="transparent"
                      stroke="#d4a24e"
                      strokeWidth="1"
                      strokeOpacity="0.5"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                )}

                <div className={`flex flex-col gap-2 ${isFeatured ? 'px-5 pb-5 pt-2' : 'px-4 py-4'}`}>
                  {isFeatured && (
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary/70">
                      Lokasi Utama
                    </span>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h2
                        className={`font-semibold leading-tight text-ink ${
                          isFeatured ? 'text-[18px]' : 'text-[14px]'
                        }`}
                      >
                        {l.nama}
                      </h2>
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
                      isFeatured ? 'text-[13px] line-clamp-2' : 'text-[12px] line-clamp-1'
                    }`}
                  >
                    {l.ringkas}
                  </p>
                  <div className="flex items-center gap-3 font-mono text-[11px] text-gold mt-1">
                    <span>{l.kota}</span>
                    <span className="text-ash">·</span>
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
