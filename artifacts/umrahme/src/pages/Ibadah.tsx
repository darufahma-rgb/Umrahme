import { Link } from 'react-router-dom';
import MihrabCard from '../components/MihrabCard';
import { IconIbadah, IconDoa, IconChevron } from '../components/icons';

function IconMoon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

// Ikon Sa'i — dua garis horisontal bolak-balik (Shafa ↔ Marwah)
function IconSai({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8h16M20 8l-3-3M20 8l-3 3" />
      <path d="M20 16H4M4 16l3-3M4 16l3 3" />
    </svg>
  );
}

export default function Ibadah() {
  return (
    <div>
      <header
        className="px-5 pb-1 pt-8"
        style={{ paddingTop: 'max(2rem, env(safe-area-inset-top))' }}
      >
        <p className="font-mono text-[11px] uppercase tracking-widest text-rose-400">
          Saat di Tanah Suci
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-parchment-100">
          Ibadah
        </h1>
        <p className="mt-1 text-sm text-mute-500">
          Buka cepat saat sedang beribadah. Satu layar, satu fokus.
        </p>
      </header>

      {/* Dua aksi utama — setara secara visual */}
      <section className="mt-5 px-5 space-y-3">
        <Link to="/ibadah/tawaf" className="block active:scale-[0.99]">
          <MihrabCard fill="#261019" bodyClassName="px-5 pb-6 pt-2">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-rose-600 text-parchment-100 shadow-glow">
                <IconIbadah className="h-7 w-7" />
              </span>
              <div className="flex-1">
                <h2 className="font-display text-2xl font-semibold text-parchment-100">
                  Counter Tawaf
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-mute-500">
                  Tombol besar, hitung 7 putaran dengan satu tap. Doa muncul otomatis
                  tanpa pindah halaman.
                </p>
              </div>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 font-medium text-rose-400">
              Mulai Tawaf <IconChevron className="h-4 w-4" />
            </span>
          </MihrabCard>
        </Link>

        <Link to="/ibadah/sai" className="block active:scale-[0.99]">
          <MihrabCard fill="#261019" bodyClassName="px-5 pb-6 pt-2">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-rose-600 text-parchment-100 shadow-glow">
                <IconSai className="h-7 w-7" />
              </span>
              <div className="flex-1">
                <h2 className="font-display text-2xl font-semibold text-parchment-100">
                  Counter Sa'i
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-mute-500">
                  Hitung 7 lintasan Shafa–Marwah. Arah & doa per lintasan tampil otomatis.
                </p>
              </div>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 font-medium text-rose-400">
              Mulai Sa'i <IconChevron className="h-4 w-4" />
            </span>
          </MihrabCard>
        </Link>
      </section>

      {/* Jadwal Sholat */}
      <section className="mt-3 px-5">
        <Link to="/ibadah/jadwal-sholat" className="block active:scale-[0.99]">
          <MihrabCard fill="#18090F" bodyClassName="px-5 pb-5 pt-2">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl border border-ink-800/60 bg-ink-900/80 text-mute-500">
                <IconMoon className="h-7 w-7" />
              </span>
              <div className="flex-1">
                <h2 className="font-display text-2xl font-semibold text-parchment-100">
                  Jadwal Sholat
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-mute-500">
                  Waktu sholat 5 waktu dengan gauge jam dan pengingat adzan.
                </p>
              </div>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 font-medium text-rose-400">
              Lihat Jadwal <IconChevron className="h-4 w-4" />
            </span>
          </MihrabCard>
        </Link>
      </section>

      {/* Sekunder — doa terkait */}
      <section className="mt-7 px-5">
        <h3 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-mute-500">
          Doa Saat Ibadah
        </h3>
        <div className="space-y-3">
          {[
            { to: '/doa?kategori=tawaf', label: 'Doa Tawaf', desc: 'Bacaan saat mengelilingi Ka\u2019bah' },
            { to: '/doa?kategori=sai', label: "Doa Sa'i", desc: 'Antara Shafa & Marwah' },
            { to: '/doa?kategori=tahallul', label: 'Doa Tahallul', desc: 'Mencukur / memotong rambut' },
          ].map((it) => (
            <Link
              key={it.to}
              to={it.to}
              className="flex items-center gap-3 rounded-2xl border border-ink-800/70 bg-ink-900/50 px-4 py-3.5 active:scale-[0.99]"
            >
              <IconDoa className="h-5 w-5 flex-none text-gold-400" />
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-medium text-parchment-100">{it.label}</p>
                <p className="truncate text-xs text-mute-500">{it.desc}</p>
              </div>
              <IconChevron className="h-4 w-4 flex-none text-mute-500" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
