import { Link } from 'react-router-dom';
import { IconTawaf, IconSai, IconNavigator, IconScissors, IconMoon, IconDoa, IconChevron } from '../components/icons';

// ── Ikon lokal ─────────────────────────────────────────────────
function IconCompass({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M16.24 7.76 L14.12 14.12 L7.76 16.24 L9.88 9.88 Z" fill="currentColor" stroke="none" opacity="0.3"/>
      <path d="M16.24 7.76 L14.12 14.12 L7.76 16.24 L9.88 9.88 Z" />
    </svg>
  );
}

// ── Hero Navigator Card ─────────────────────────────────────────
function NavigatorHero() {
  return (
    <Link to="/ibadah/navigator" className="block active:scale-[0.99] transition-transform">
      <div
        className="relative overflow-hidden rounded-3xl p-5 min-h-[160px] flex flex-col justify-between"
        style={{ background: 'linear-gradient(135deg, #0c2340 0%, #0a3d62 55%, #0ea5e9 130%)' }}
      >
        {/* Dekorasi */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/[0.05]" />
        <div className="pointer-events-none absolute -bottom-10 right-10 h-32 w-32 rounded-full bg-sky-300/[0.08]" />
        <div className="pointer-events-none absolute top-4 right-4 h-20 w-20 rounded-full bg-sky-400/[0.06]" />

        {/* Badge */}
        <div className="relative flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-300 animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/80">Panduan Utama</span>
          </span>
        </div>

        {/* Content */}
        <div className="relative mt-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-[26px] font-bold leading-tight text-white" style={{ letterSpacing: '-0.5px' }}>
                Ritual Navigator
              </h2>
              <p className="mt-1 text-[12px] leading-relaxed text-white/65 max-w-[220px]">
                Ikuti tiap tahap umrah langkah demi langkah — progres tersimpan otomatis.
              </p>
            </div>
            <div
              className="flex-none flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <IconCompass className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-bold text-primary shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
            Mulai Navigator <IconChevron className="h-3 w-3" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Counter Card (compact, 2-col) ───────────────────────────────
function CounterCard({
  to, title, desc, icon, cta, color,
}: {
  to: string; title: string; desc: string;
  icon: React.ReactNode; cta: string;
  color: { bg: string; icon: string; text: string };
}) {
  return (
    <Link to={to} className="block active:scale-[0.97] transition-transform">
      <div className="h-full rounded-2xl border border-hairline bg-white p-4 shadow-drop-card flex flex-col gap-3">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl"
          style={{ background: color.bg }}
        >
          <span style={{ color: color.icon }}>{icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-[14px] font-bold leading-tight text-ink">{title}</h3>
          <p className="mt-1 text-[11px] leading-relaxed text-charcoal">{desc}</p>
        </div>
        <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-wider" style={{ color: color.text }}>
          {cta} <IconChevron className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}

// ── Halaman ────────────────────────────────────────────────────
export default function Ibadah() {
  const doaLinks = [
    { to: '/doa?kategori=tawaf', label: 'Doa Tawaf', desc: "Saat mengelilingi Ka'bah" },
    { to: '/doa?kategori=sai',   label: "Doa Sa'i",  desc: 'Antara Shafa & Marwah' },
    { to: '/doa?kategori=tahallul', label: 'Doa Tahallul', desc: 'Mencukur / memotong rambut' },
  ];

  const counters = [
    {
      to: '/ibadah/tawaf',
      title: 'Counter Tawaf',
      desc: '7 putaran Ka\'bah — tap sekali, doa muncul otomatis.',
      icon: <IconTawaf className="h-5 w-5" />,
      cta: 'Mulai Tawaf',
      color: { bg: 'rgba(14,165,233,0.10)', icon: '#0ea5e9', text: '#0ea5e9' },
    },
    {
      to: '/ibadah/sai',
      title: "Counter Sa'i",
      desc: '7 lintasan Shafa–Marwah. Arah & doa per lintasan.',
      icon: <IconSai className="h-5 w-5" />,
      cta: "Mulai Sa'i",
      color: { bg: 'rgba(16,185,129,0.10)', icon: '#10b981', text: '#10b981' },
    },
    {
      to: '/ibadah/tahallul',
      title: 'Tahallul',
      desc: 'Langkah terakhir — potong rambut, keluar dari ihram.',
      icon: <IconScissors className="h-5 w-5" />,
      cta: 'Panduan',
      color: { bg: 'rgba(212,162,78,0.12)', icon: '#a07828', text: '#a07828' },
    },
    {
      to: '/ibadah/jadwal-sholat',
      title: 'Jadwal Sholat',
      desc: 'Waktu sholat 5 waktu + gauge jam & pengingat adzan.',
      icon: <IconMoon className="h-5 w-5" />,
      cta: 'Lihat Jadwal',
      color: { bg: 'rgba(99,102,241,0.10)', icon: '#6366f1', text: '#6366f1' },
    },
  ];

  return (
    <div className="min-h-screen bg-canvas">

      {/* ───── MOBILE ───── */}
      <div className="lg:hidden">

        {/* Header */}
        <header className="px-5 pt-8 pb-4" style={{ paddingTop: 'max(2rem, env(safe-area-inset-top))' }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">Saat di Tanah Suci</p>
          <h1 className="mt-1 font-display text-[32px] font-bold leading-none text-ink" style={{ letterSpacing: '-1px' }}>
            Ibadah
          </h1>
          <p className="mt-1.5 text-[12px] text-charcoal">Satu layar, satu fokus. Buka cepat saat beribadah.</p>
        </header>

        {/* Navigator hero */}
        <section className="px-5">
          <NavigatorHero />
        </section>

        {/* Section label */}
        <div className="px-5 mt-5 mb-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-mute">Panduan & Counter</p>
        </div>

        {/* Counter 2-col grid */}
        <section className="px-5 pb-2">
          <div className="grid grid-cols-2 gap-3">
            {counters.map((c) => (
              <CounterCard key={c.to} {...c} />
            ))}
          </div>
        </section>

        {/* Doa section */}
        <section className="px-5 mt-5 pb-8">
          <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.28em] text-mute">Doa Saat Ibadah</p>
          <div className="overflow-hidden rounded-2xl border border-hairline bg-white shadow-drop-card divide-y divide-hairline">
            {doaLinks.map((it) => (
              <Link
                key={it.to}
                to={it.to}
                className="flex items-center gap-3 px-4 py-3.5 active:bg-surface-bone transition-colors"
              >
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-surface-bone">
                  <IconDoa className="h-4 w-4 text-gold" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-ink">{it.label}</p>
                  <p className="text-[11px] text-charcoal">{it.desc}</p>
                </div>
                <IconChevron className="h-3.5 w-3.5 flex-none text-ash" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ───── DESKTOP ───── */}
      <div className="hidden lg:block px-10 pb-10">
        <header className="pt-10 pb-6">
          <p className="font-mono text-[11px] uppercase tracking-widest text-primary">Saat di Tanah Suci</p>
          <h1 className="mt-1 font-display text-4xl font-bold leading-tight text-ink">Ibadah</h1>
          <p className="mt-1 text-sm text-charcoal">Buka cepat saat sedang beribadah. Satu layar, satu fokus.</p>
        </header>

        <NavigatorHero />

        <div className="mt-5 grid grid-cols-4 gap-4 mb-8">
          {counters.map((c) => (
            <CounterCard key={c.to} {...c} />
          ))}
        </div>

        <div>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-mute">Doa Saat Ibadah</p>
          <div className="grid grid-cols-3 gap-3">
            {doaLinks.map((it) => (
              <Link
                key={it.to}
                to={it.to}
                className="flex items-center gap-3 rounded-2xl border border-hairline bg-white px-4 py-3.5 hover:bg-surface-bone transition-colors shadow-drop-card"
              >
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-surface-bone">
                  <IconDoa className="h-4 w-4 text-gold" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-ink">{it.label}</p>
                  <p className="text-xs text-charcoal">{it.desc}</p>
                </div>
                <IconChevron className="h-4 w-4 flex-none text-ash" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
