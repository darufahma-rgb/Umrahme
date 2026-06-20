import { Link } from 'react-router-dom';
import { IconPanduan, IconChevron, IconPeta } from '../components/icons';

function IconManasikInteraktif({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M9 8h2l1 2-1 2H9" />
      <circle cx="16" cy="12" r="2.5" />
      <path d="M18 14l1.5 1.5" />
    </svg>
  );
}

// Slot "Panduan" (Mode A — belajar). Hub ke Manasik Interaktif, Tata Cara, Ihram, & Peta.
export default function Panduan() {
  const items: { to: string; label: string; desc: string; Icon: React.FC<{ className?: string }>; highlight?: boolean }[] = [
    {
      to: '/panduan/manasik-interaktif',
      label: 'Manasik Interaktif',
      desc: 'Kenali, urutkan & uji paham — belajar umrah secara interaktif',
      Icon: IconManasikInteraktif,
      highlight: true,
    },
    {
      to: '/panduan/tata-cara',
      label: 'Tata Cara Umrah',
      desc: "Alur lengkap: Miqat \u2192 Ihram \u2192 Tawaf \u2192 Sa\u2019i \u2192 Tahallul",
      Icon: IconPanduan,
    },
    {
      to: '/panduan/ihram',
      label: 'Panduan Ihram',
      desc: 'Niat, larangan, & cara memakai ihram',
      Icon: IconPanduan,
    },
    {
      to: '/peta',
      label: 'Peta Lokasi',
      desc: 'Masjid & tempat bersejarah',
      Icon: IconPeta,
    },
  ];

  return (
    <div>
      <header
        className="px-5 pb-1 pt-8"
        style={{ paddingTop: 'max(2rem, env(safe-area-inset-top))' }}
      >
        <h1 className="font-display text-3xl font-semibold text-parchment-100">Panduan</h1>
        <p className="mt-1 text-sm text-mute-500">
          Pelajari dengan tenang sebelum berangkat.
        </p>
      </header>

      <div className="mt-5 space-y-3 px-5 pb-6">
        {items.map(({ to, label, desc, Icon, highlight }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-4 rounded-2xl border px-4 py-4 active:scale-[0.99] transition-colors
              ${highlight
                ? 'border-rose-600/40 bg-rose-600/8 hover:border-rose-600/60'
                : 'border-ink-800/70 bg-ink-900/50 hover:border-ink-700'
              }
            `}
          >
            <span
              className={`flex h-12 w-12 flex-none items-center justify-center rounded-2xl border
                ${highlight
                  ? 'border-rose-600/30 bg-rose-600/10 text-rose-400'
                  : 'border-ink-800 bg-ink-950 text-rose-400'
                }
              `}
            >
              <Icon className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[15px] font-semibold text-parchment-100">{label}</p>
                {highlight && (
                  <span className="rounded-full bg-rose-600/20 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-rose-400">
                    Baru
                  </span>
                )}
              </div>
              <p className="text-xs leading-relaxed text-mute-500">{desc}</p>
            </div>
            <IconChevron className="h-4 w-4 flex-none text-mute-500" />
          </Link>
        ))}
      </div>
    </div>
  );
}
