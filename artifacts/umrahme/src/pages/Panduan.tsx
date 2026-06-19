import { Link } from 'react-router-dom';
import { IconPanduan, IconChevron, IconPeta } from '../components/icons';

// Slot "Panduan" (Mode A — belajar). Hub ke Tata Cara, Ihram, & Peta.
export default function Panduan() {
  const items = [
    {
      to: '/panduan/tata-cara',
      label: 'Tata Cara Umrah',
      desc: 'Alur lengkap: Miqat → Ihram → Tawaf → Sa’i → Tahallul',
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

      <div className="mt-5 space-y-3 px-5">
        {items.map(({ to, label, desc, Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-4 rounded-2xl border border-ink-800/70 bg-ink-900/50 px-4 py-4 active:scale-[0.99]"
          >
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl border border-ink-800 bg-ink-950 text-rose-400">
              <Icon className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-parchment-100">{label}</p>
              <p className="text-xs leading-relaxed text-mute-500">{desc}</p>
            </div>
            <IconChevron className="h-4 w-4 flex-none text-mute-500" />
          </Link>
        ))}
      </div>
    </div>
  );
}
