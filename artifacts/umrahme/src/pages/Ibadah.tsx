import { Link } from 'react-router-dom';
import { IconIbadah, IconDoa, IconChevron } from '../components/icons';

function IconMoon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function IconNavigator({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polygon points="12,6 14.5,14 12,12.5 9.5,14" />
      <polygon points="12,18 9.5,10 12,11.5 14.5,10" className="opacity-40" />
    </svg>
  );
}

function IconSai({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8h16M20 8l-3-3M20 8l-3 3" />
      <path d="M20 16H4M4 16l3-3M4 16l3 3" />
    </svg>
  );
}

function ActionCard({
  to,
  title,
  desc,
  icon,
  cta,
  primary = false,
}: {
  to: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  cta: string;
  primary?: boolean;
}) {
  return (
    <Link to={to} className="block active:scale-[0.99] h-full">
      <div className={`h-full rounded-md border p-5 transition-shadow hover:shadow-drop-soft lg:rounded-xl lg:p-6 ${primary ? 'border-primary/20 bg-primary/5' : 'border-hairline bg-surface-card'}`}>
        <div className="flex items-start gap-4">
          <span className={`flex h-14 w-14 flex-none items-center justify-center rounded-full ${primary ? 'bg-primary text-on-primary' : 'border border-hairline bg-surface-bone text-charcoal'}`}>
            {icon}
          </span>
          <div className="flex-1">
            <h2 className="font-display text-2xl font-bold leading-tight text-ink">
              {title}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-charcoal">
              {desc}
            </p>
          </div>
        </div>
        <span className="mt-4 inline-flex items-center gap-1 font-medium text-primary">
          {cta} <IconChevron className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

export default function Ibadah() {
  const doaLinks = [
    { to: '/doa?kategori=tawaf', label: 'Doa Tawaf', desc: "Bacaan saat mengelilingi Ka'bah" },
    { to: '/doa?kategori=sai', label: "Doa Sa'i", desc: 'Antara Shafa & Marwah' },
    { to: '/doa?kategori=tahallul', label: 'Doa Tahallul', desc: 'Mencukur / memotong rambut' },
  ];

  return (
    <div>
      <header
        className="px-5 pb-1 pt-8 lg:px-10 lg:pt-10"
        style={{ paddingTop: 'max(2rem, env(safe-area-inset-top))' }}
      >
        <p className="font-mono text-[11px] uppercase tracking-widest text-primary">
          Saat di Tanah Suci
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-ink lg:text-4xl">
          Ibadah
        </h1>
        <p className="mt-1 text-sm text-charcoal">
          Buka cepat saat sedang beribadah. Satu layar, satu fokus.
        </p>
      </header>

      {/* Mobile layout */}
      <div className="lg:hidden">
        <section className="mt-5 px-5">
          <ActionCard
            to="/ibadah/navigator"
            title="Ritual Navigator"
            desc="Panduan langkah-demi-langkah seluruh rangkaian umrah. Ikuti satu tahap dalam satu waktu, simpan progres otomatis."
            icon={<IconNavigator className="h-7 w-7" />}
            cta="Mulai Navigator"
            primary
          />
        </section>

        <section className="mt-3 px-5 space-y-3">
          <ActionCard
            to="/ibadah/tawaf"
            title="Counter Tawaf"
            desc="Tombol besar, hitung 7 putaran dengan satu tap. Doa muncul otomatis tanpa pindah halaman."
            icon={<IconIbadah className="h-7 w-7" />}
            cta="Mulai Tawaf"
          />
          <ActionCard
            to="/ibadah/sai"
            title="Counter Sa'i"
            desc="Hitung 7 lintasan Shafa–Marwah. Arah & doa per lintasan tampil otomatis."
            icon={<IconSai className="h-7 w-7" />}
            cta="Mulai Sa'i"
          />
          <ActionCard
            to="/ibadah/jadwal-sholat"
            title="Jadwal Sholat"
            desc="Waktu sholat 5 waktu dengan gauge jam dan pengingat adzan."
            icon={<IconMoon className="h-7 w-7" />}
            cta="Lihat Jadwal"
          />
        </section>

        <section className="mt-7 px-5 pb-6">
          <h3 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-mute">
            Doa Saat Ibadah
          </h3>
          <div className="space-y-3">
            {doaLinks.map((it) => (
              <Link
                key={it.to}
                to={it.to}
                className="flex items-center gap-3 rounded-md border border-hairline bg-surface-card px-4 py-3.5 active:scale-[0.99] transition-shadow hover:shadow-drop-soft"
              >
                <IconDoa className="h-5 w-5 flex-none text-gold" />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium text-ink">{it.label}</p>
                  <p className="truncate text-xs text-charcoal">{it.desc}</p>
                </div>
                <IconChevron className="h-4 w-4 flex-none text-ash" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:block px-10 pb-10 mt-6">
        {/* Navigator full width */}
        <div className="mb-4">
          <ActionCard
            to="/ibadah/navigator"
            title="Ritual Navigator"
            desc="Panduan langkah-demi-langkah seluruh rangkaian umrah. Ikuti satu tahap dalam satu waktu, simpan progres otomatis."
            icon={<IconNavigator className="h-7 w-7" />}
            cta="Mulai Navigator"
            primary
          />
        </div>

        {/* 3-col grid for counters */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <ActionCard
            to="/ibadah/tawaf"
            title="Counter Tawaf"
            desc="Tombol besar, hitung 7 putaran dengan satu tap. Doa muncul otomatis tanpa pindah halaman."
            icon={<IconIbadah className="h-7 w-7" />}
            cta="Mulai Tawaf"
          />
          <ActionCard
            to="/ibadah/sai"
            title="Counter Sa'i"
            desc="Hitung 7 lintasan Shafa–Marwah. Arah & doa per lintasan tampil otomatis."
            icon={<IconSai className="h-7 w-7" />}
            cta="Mulai Sa'i"
          />
          <ActionCard
            to="/ibadah/jadwal-sholat"
            title="Jadwal Sholat"
            desc="Waktu sholat 5 waktu dengan gauge jam dan pengingat adzan."
            icon={<IconMoon className="h-7 w-7" />}
            cta="Lihat Jadwal"
          />
        </div>

        {/* Doa links */}
        <div>
          <h3 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-mute">
            Doa Saat Ibadah
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {doaLinks.map((it) => (
              <Link
                key={it.to}
                to={it.to}
                className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-card px-4 py-3.5 transition-shadow hover:shadow-drop-soft"
              >
                <IconDoa className="h-5 w-5 flex-none text-gold" />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium text-ink">{it.label}</p>
                  <p className="truncate text-xs text-charcoal">{it.desc}</p>
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
