import { Link } from 'react-router-dom';
import { IconPanduan, IconPeta, IconManasikInteraktif } from '../components/icons';

const accentMap: Record<string, { tile: string; icon: string; bar: string; label: string }> = {
  maroon: {
    tile: 'bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5',
    icon: 'text-primary',
    bar: 'from-primary/30 to-primary/10',
    label: 'text-primary',
  },
  gold: {
    tile: 'bg-gradient-to-br from-gold/25 via-gold/12 to-gold/5',
    icon: 'text-gold',
    bar: 'from-gold/30 to-gold/10',
    label: 'text-gold',
  },
  green: {
    tile: 'bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-emerald-500/5',
    icon: 'text-emerald-600',
    bar: 'from-emerald-500/30 to-emerald-500/10',
    label: 'text-emerald-600',
  },
  blue: {
    tile: 'bg-gradient-to-br from-sky-500/20 via-sky-500/10 to-sky-500/5',
    icon: 'text-sky-600',
    bar: 'from-sky-500/30 to-sky-500/10',
    label: 'text-sky-600',
  },
};

export default function Panduan() {
  const items: {
    to: string;
    label: string;
    desc: string;
    Icon: React.FC<{ className?: string }>;
    highlight?: boolean;
    accent: string;
  }[] = [
    {
      to: '/panduan/manasik-interaktif',
      label: 'Manasik Interaktif',
      desc: 'Kenali, urutkan & uji paham secara interaktif',
      Icon: IconManasikInteraktif,
      highlight: true,
      accent: 'maroon',
    },
    {
      to: '/panduan/tata-cara',
      label: 'Tata Cara Umrah',
      desc: 'Miqat → Ihram → Tawaf → Sa\u2019i → Tahallul',
      Icon: IconPanduan,
      accent: 'gold',
    },
    {
      to: '/panduan/ihram',
      label: 'Panduan Ihram',
      desc: 'Niat, larangan & cara memakai ihram',
      Icon: IconPanduan,
      accent: 'green',
    },
    {
      to: '/peta',
      label: 'Peta Lokasi',
      desc: '19 masjid & tempat bersejarah',
      Icon: IconPeta,
      accent: 'blue',
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
        {items.map(({ to, label, desc, Icon, highlight, accent }) => {
          const a = accentMap[accent];
          return (
            <Link
              key={to}
              to={to}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface-card shadow-drop-soft transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] ${a.tile}`}
            >
              {/* gradient top bar */}
              <span className={`absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r ${a.bar}`} aria-hidden />

              <div className="flex flex-col gap-3 p-4">
                {/* ikon + badge */}
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/70 shadow-sm backdrop-blur-sm">
                    <Icon className={`h-5 w-5 ${a.icon}`} />
                  </div>
                  {highlight && (
                    <span className={`rounded-full bg-white/80 px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider ${a.label} shadow-sm`}>
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
                <span className={`font-mono text-[9px] uppercase tracking-wider ${a.label} opacity-70 transition-opacity group-hover:opacity-100`}>
                  Buka →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
