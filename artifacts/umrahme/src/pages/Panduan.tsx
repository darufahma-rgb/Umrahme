import { Link } from 'react-router-dom';
import { IconPanduan, IconChevron, IconPeta, IconManasikInteraktif } from '../components/icons';

const accentMap: Record<string, { tile: string; icon: string; bar: string }> = {
  maroon: { tile: 'bg-gradient-to-br from-primary/15 to-primary/5', icon: 'text-primary', bar: 'bg-primary' },
  gold:   { tile: 'bg-gradient-to-br from-gold/20 to-gold/5',       icon: 'text-gold',    bar: 'bg-gold' },
  green:  { tile: 'bg-gradient-to-br from-emerald-500/15 to-emerald-500/5', icon: 'text-emerald-600', bar: 'bg-emerald-500' },
  blue:   { tile: 'bg-gradient-to-br from-sky-500/15 to-sky-500/5', icon: 'text-sky-600', bar: 'bg-sky-500' },
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
      desc: 'Kenali, urutkan & uji paham — belajar umrah secara interaktif',
      Icon: IconManasikInteraktif,
      highlight: true,
      accent: 'maroon',
    },
    {
      to: '/panduan/tata-cara',
      label: 'Tata Cara Umrah',
      desc: 'Alur lengkap: Miqat → Ihram → Tawaf → Sa\u2019i → Tahallul',
      Icon: IconPanduan,
      accent: 'gold',
    },
    {
      to: '/panduan/ihram',
      label: 'Panduan Ihram',
      desc: 'Niat, larangan, & cara memakai ihram',
      Icon: IconPanduan,
      accent: 'green',
    },
    {
      to: '/peta',
      label: 'Peta Lokasi',
      desc: '19 masjid & tempat bersejarah, lengkap dengan Google Maps',
      Icon: IconPeta,
      accent: 'blue',
    },
  ];

  return (
    <div>
      <header
        className="px-5 pb-1 pt-8 lg:px-10 lg:pt-10"
        style={{ paddingTop: 'max(2rem, env(safe-area-inset-top))' }}
      >
        <h1 className="font-display text-3xl font-bold leading-tight text-ink lg:text-4xl">Panduan</h1>
        <p className="mt-1 text-sm text-charcoal">
          Pelajari dengan tenang sebelum berangkat.
        </p>
      </header>

      <div className="mt-5 space-y-3.5 px-5 pb-6 lg:px-10 lg:pb-10 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-4 lg:mt-6">
        {items.map(({ to, label, desc, Icon, highlight, accent }) => {
          const a = accentMap[accent];
          return (
            <Link
              key={to}
              to={to}
              className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-hairline bg-surface-card p-4 shadow-drop-soft transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99] lg:p-5"
            >
              <span className={`absolute left-0 top-0 h-full w-1 ${a.bar} opacity-70`} aria-hidden />

              <div className={`flex h-14 w-14 flex-none items-center justify-center rounded-2xl ${a.tile}`}>
                <Icon className={`h-7 w-7 ${a.icon}`} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-[17px] font-bold leading-tight text-ink">{label}</h2>
                  {highlight && (
                    <span className="flex-none rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-primary">
                      Baru
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[13px] leading-snug text-charcoal">{desc}</p>
              </div>

              <IconChevron className="h-5 w-5 flex-none text-ash transition-transform group-hover:translate-x-0.5 group-hover:text-charcoal" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
