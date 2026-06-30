import React from 'react';
import { Link } from 'react-router-dom';
import { IconTawaf, IconSai, IconNavigator, IconScissors, IconMoon, IconDoa, IconChevron } from '../components/icons';

// ── Navigator Hero ──────────────────────────────────────────────
function NavigatorHero() {
  return (
    <Link to="/ibadah/navigator" className="block active:opacity-90 transition-opacity">
      <div
        className="relative overflow-hidden rounded-[28px]"
        style={{
          background: 'linear-gradient(145deg, var(--color-primary-deep) 0%, var(--color-primary) 100%)',
          padding: '1px',
        }}
      >
        <div
          className="relative overflow-hidden rounded-[27px] p-6"
          style={{ background: 'linear-gradient(145deg, var(--color-primary-deep) 0%, var(--color-primary) 100%)' }}
        >
          {/* Badge */}
          <div className="relative inline-flex items-center gap-2 mb-5">
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.6)' }} />
            <span className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: 'rgba(255,255,255,0.55)' }}>Panduan Utama</span>
          </div>

          {/* Body */}
          <div className="relative flex items-end justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2
                className="font-display font-bold text-white"
                style={{ fontSize: 'clamp(24px, 6vw, 30px)', letterSpacing: '-0.5px', lineHeight: 1.1 }}
              >
                Pemandu Ibadah
              </h2>
              <p className="mt-2 text-[12px] leading-relaxed text-white/50 max-w-[200px]">
                Ikuti tiap tahap umrah langkah demi langkah — progres tersimpan otomatis.
              </p>
            </div>

            {/* Ikon floated */}
            <div
              className="flex-none flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <IconNavigator className="h-5 w-5 text-white/70" />
            </div>
          </div>

          {/* CTA */}
          <div className="relative mt-5">
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[12px] font-semibold"
              style={{
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(255,255,255,0.16)',
                color: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(8px)',
              }}
            >
              Mulai Navigator <IconChevron className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Counter Card ────────────────────────────────────────────────
function CounterCard({
  to, title, desc, icon, cta,
}: {
  to: string; title: string; desc: string; icon: React.ReactNode; cta: string;
}) {
  return (
    <Link to={to} className="block active:scale-[0.97] transition-transform">
      <div className="h-full flex flex-col rounded-[20px] bg-white border border-[rgba(0,0,0,0.06)] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-[14px] mb-3 text-[#0c2340]"
          style={{ background: 'rgba(12,35,64,0.06)' }}
        >
          {icon}
        </div>
        <h3 className="text-[13px] font-bold text-[#0c2340] leading-snug">{title}</h3>
        <p className="mt-1 text-[11px] leading-relaxed text-[#6b7280] flex-1">{desc}</p>
        <span className="mt-3 inline-flex items-center gap-1 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[#0ea5e9]">
          {cta} <IconChevron className="h-2.5 w-2.5" />
        </span>
      </div>
    </Link>
  );
}

// ── Halaman ─────────────────────────────────────────────────────
export default function Ibadah() {
  const doaLinks = [
    { to: '/doa?kategori=tawaf',    label: 'Doa Tawaf',    desc: "Saat mengelilingi Ka'bah" },
    { to: '/doa?kategori=sai',      label: "Doa Sa'i",     desc: 'Antara Shafa & Marwah' },
    { to: '/doa?kategori=tahallul', label: 'Doa Tahallul', desc: 'Mencukur / memotong rambut' },
  ];

  const counters = [
    {
      to:    '/ibadah/tawaf',
      title: 'Counter Tawaf',
      desc:  '7 putaran dengan satu tap. Doa muncul otomatis.',
      icon:  <IconTawaf className="h-5 w-5" />,
      cta:   'Mulai Tawaf',
    },
    {
      to:    '/ibadah/sai',
      title: "Counter Sa'i",
      desc:  '7 lintasan Shafa–Marwah. Arah & doa per lintasan.',
      icon:  <IconSai className="h-5 w-5" />,
      cta:   "Mulai Sa'i",
    },
    {
      to:    '/ibadah/tahallul',
      title: 'Tahallul',
      desc:  'Langkah terakhir — potong rambut, keluar ihram.',
      icon:  <IconScissors className="h-5 w-5" />,
      cta:   'Panduan',
    },
    {
      to:    '/ibadah/jadwal-sholat',
      title: 'Jadwal Sholat',
      desc:  'Waktu 5 sholat + pengingat adzan real-time.',
      icon:  <IconMoon className="h-5 w-5" />,
      cta:   'Lihat Jadwal',
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#f5f4f0' }}>

      {/* ───── MOBILE ───── */}
      <div className="lg:hidden">

        {/* Header */}
        <header
          className="px-5 pb-5"
          style={{ paddingTop: 'max(2.5rem, env(safe-area-inset-top))' }}
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-primary mb-1">
            Saat di Tanah Suci
          </p>
          <h1
            className="font-display font-bold text-ink"
            style={{ fontSize: 'clamp(28px, 8vw, 36px)', letterSpacing: '-1px', lineHeight: 1 }}
          >
            Ibadah
          </h1>
          <p className="mt-1.5 text-[11px] text-charcoal">
            Satu layar, satu fokus — buka cepat saat beribadah.
          </p>
        </header>

        {/* Navigator hero */}
        <section className="px-4">
          <NavigatorHero />
        </section>

        {/* Counter grid */}
        <section className="px-4 mt-4">
          <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.28em] text-[#9ca3af]">Panduan & Counter</p>
          <div className="grid grid-cols-2 gap-3">
            {counters.map((c) => (
              <CounterCard key={c.to} {...c} />
            ))}
          </div>
        </section>

        {/* Doa section */}
        <section className="px-4 mt-5 pb-8">
          <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.28em] text-[#9ca3af]">Doa Saat Ibadah</p>
          <div className="overflow-hidden rounded-[20px] border border-[rgba(0,0,0,0.06)] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)] divide-y divide-[rgba(0,0,0,0.05)]">
            {doaLinks.map((it) => (
              <Link
                key={it.to}
                to={it.to}
                className="flex items-center gap-3 px-4 py-3.5 active:bg-[#fafaf8] transition-colors"
              >
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-xl" style={{ background: 'rgba(212,162,78,0.10)' }}>
                  <IconDoa className="h-4 w-4 text-[#a07828]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-[#0c2340]">{it.label}</p>
                  <p className="text-[11px] text-[#9ca3af]">{it.desc}</p>
                </div>
                <IconChevron className="h-3.5 w-3.5 flex-none text-[#d1d5db]" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ───── DESKTOP ───── */}
      <div className="hidden lg:block">
        <header className="px-10 pb-6 pt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-1">Saat di Tanah Suci</p>
          <h1 className="font-display text-4xl font-bold text-ink" style={{ letterSpacing: '-1.5px' }}>Ibadah</h1>
          <p className="mt-1 text-sm text-charcoal">Buka cepat saat sedang beribadah. Satu layar, satu fokus.</p>
        </header>

        <div className="px-10 pb-10">
          <NavigatorHero />

          <div className="mt-4 grid grid-cols-4 gap-4 mb-8">
            {counters.map((c) => (
              <CounterCard key={c.to} {...c} />
            ))}
          </div>

          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#9ca3af]">Doa Saat Ibadah</p>
          <div className="grid grid-cols-3 gap-3">
            {doaLinks.map((it) => (
              <Link
                key={it.to}
                to={it.to}
                className="flex items-center gap-3 rounded-[20px] border border-[rgba(0,0,0,0.06)] bg-white px-4 py-3.5 hover:bg-[#fafaf8] transition-colors shadow-[0_2px_12px_rgba(0,0,0,0.05)]"
              >
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-xl" style={{ background: 'rgba(212,162,78,0.10)' }}>
                  <IconDoa className="h-4 w-4 text-[#a07828]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-[#0c2340]">{it.label}</p>
                  <p className="text-xs text-[#9ca3af]">{it.desc}</p>
                </div>
                <IconChevron className="h-4 w-4 flex-none text-[#d1d5db]" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
