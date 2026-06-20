import { Link } from 'react-router-dom';
import { IconPanduan, IconChevron, IconPeta, IconManasikInteraktif } from '../components/icons';

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
      desc: 'Alur lengkap: Miqat → Ihram → Tawaf → Sa\u2019i → Tahallul',
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
        className="px-5 pb-1 pt-8 lg:px-10 lg:pt-10"
        style={{ paddingTop: 'max(2rem, env(safe-area-inset-top))' }}
      >
        <h1 className="font-display text-3xl font-bold leading-tight text-ink lg:text-4xl">Panduan</h1>
        <p className="mt-1 text-sm text-charcoal">
          Pelajari dengan tenang sebelum berangkat.
        </p>
      </header>

      <div className="mt-5 space-y-3 px-5 pb-6 lg:px-10 lg:pb-10 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-4 lg:mt-6">
        {items.map(({ to, label, desc, Icon, highlight }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-4 rounded-md border px-4 py-4 active:scale-[0.99] transition-shadow lg:rounded-xl lg:p-6 lg:flex-col lg:items-start lg:gap-5
              ${highlight
                ? 'border-primary/20 bg-primary/5 hover:shadow-drop-soft'
                : 'border-hairline bg-surface-card hover:shadow-drop-soft'
              }
            `}
          >
            <span
              className={`flex h-12 w-12 flex-none items-center justify-center rounded-md border lg:h-14 lg:w-14
                ${highlight
                  ? 'border-primary/20 bg-primary/10 text-primary'
                  : 'border-hairline bg-surface-bone text-primary'
                }
              `}
            >
              <Icon className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[15px] font-semibold text-ink lg:text-base">{label}</p>
                {highlight && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary">
                    Baru
                  </span>
                )}
              </div>
              <p className="text-xs leading-relaxed text-charcoal lg:mt-1 lg:text-sm">{desc}</p>
            </div>
            <IconChevron className="h-4 w-4 flex-none text-ash lg:hidden" />
            <span className="hidden lg:inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-primary/70 hover:text-primary transition-colors">
              Buka <IconChevron className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
