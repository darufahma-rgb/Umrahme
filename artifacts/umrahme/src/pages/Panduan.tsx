import React from 'react';
import { Link } from 'react-router-dom';
import { IconPanduan, IconPeta, IconManasikInteraktif } from '../components/icons';

export default function Panduan() {
  const items: {
    to: string;
    label: string;
    desc: string;
    Icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
    highlight?: boolean;
  }[] = [
    {
      to: '/panduan/manasik-interaktif',
      label: 'Manasik Interaktif',
      desc: 'Kenali, urutkan & uji paham secara interaktif',
      Icon: IconManasikInteraktif,
      highlight: true,
    },
    {
      to: '/panduan/tata-cara',
      label: 'Tata Cara Umrah',
      desc: 'Miqat → Ihram → Tawaf → Sa\u2019i → Tahallul',
      Icon: IconPanduan,
    },
    {
      to: '/panduan/ihram',
      label: 'Panduan Ihram',
      desc: 'Niat, larangan & cara memakai ihram',
      Icon: IconPanduan,
    },
    {
      to: '/panduan/miqat',
      label: 'Panduan Miqat',
      desc: '5 titik miqat & aturan ihram — jangan sampai terlewat',
      Icon: IconPeta,
    },
    {
      to: '/panduan/faq-fikih',
      label: 'Tanya Jawab Fikih',
      desc: 'Haid, batal wudhu, lupa putaran, kursi roda & lainnya',
      Icon: IconPanduan,
    },
    {
      to: '/panduan/glosarium',
      label: 'Glosarium Istilah',
      desc: 'Kamus istilah umrah: ihram, tahallul, raml, dll',
      Icon: IconPanduan,
    },
    {
      to: '/peta',
      label: 'Peta Lokasi',
      desc: '19 masjid & tempat bersejarah',
      Icon: IconPeta,
    },
  ];

  return (
    <div>
      <header
        className="px-5 pb-1 pt-8 lg:px-8 lg:pt-10"
        style={{ paddingTop: 'max(2rem, env(safe-area-inset-top))' }}
      >
        <h1 className="font-display text-3xl font-bold leading-tight text-ink lg:text-4xl">Panduan</h1>
        <p className="mt-1 text-sm text-charcoal">
          Pelajari dengan tenang sebelum berangkat.
        </p>
      </header>

      <div className="mt-5 grid grid-cols-2 gap-3 px-5 pb-6 lg:px-8 lg:pb-10 lg:gap-4">
        {items.map(({ to, label, desc, Icon, highlight }) => (
          <Link
            key={to}
            to={to}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface-card shadow-drop-soft transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
            style={{
              background:
                'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 15%, white) 0%, color-mix(in srgb, var(--color-primary) 5%, white) 100%)',
            }}
          >
            {/* gradient top bar */}
            <span
              className="absolute left-0 top-0 h-0.5 w-full"
              style={{
                background:
                  'linear-gradient(to right, color-mix(in srgb, var(--color-primary) 50%, transparent), transparent)',
              }}
              aria-hidden
            />

            <div className="flex flex-col gap-3 p-4">
              {/* ikon + badge */}
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/70 shadow-sm backdrop-blur-sm">
                  <Icon className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
                </div>
                {highlight && (
                  <span
                    className="rounded-full bg-white/80 px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider shadow-sm"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Baru
                  </span>
                )}
              </div>

              {/* teks */}
              <div>
                <h2 className="font-display text-[14px] font-bold leading-tight text-ink">{label}</h2>
                <p className="mt-1 text-[11.5px] leading-snug text-charcoal line-clamp-2">{desc}</p>
              </div>
            </div>

            {/* footer arrow */}
            <div className="mt-auto flex items-center justify-end px-4 pb-3">
              <span
                className="font-mono text-[9px] uppercase tracking-wider opacity-70 transition-opacity group-hover:opacity-100"
                style={{ color: 'var(--color-primary)' }}
              >
                Buka →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
