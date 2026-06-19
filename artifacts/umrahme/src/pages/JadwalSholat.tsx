import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { jadwalMakkah, type WaktuSholat } from '../data/jadwalSholat';

// -----------------------------------------------------------------------
// Ikon waktu sholat — inline SVG minimal
// -----------------------------------------------------------------------
function IconWaktu({ tipe, className = '' }: { tipe: WaktuSholat['ikonTipe']; className?: string }) {
  if (tipe === 'subuh' || tipe === 'isya') {
    // Bulan sabit
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    );
  }
  if (tipe === 'maghrib') {
    // Matahari terbenam di cakrawala
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17 18a5 5 0 0 0-10 0" />
        <path d="M12 9V2" />
        <path d="M4.22 10.22 5.64 11.64" />
        <path d="M1 18h3M20 18h3" />
        <path d="M18.36 11.64 19.78 10.22" />
      </svg>
    );
  }
  if (tipe === 'ashar') {
    // Matahari miring / sebagian
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12" />
      </svg>
    );
  }
  // Dzuhur — matahari penuh
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
    </svg>
  );
}

// -----------------------------------------------------------------------
// Gauge arc — setengah lingkaran progress hari
// -----------------------------------------------------------------------
function GaugeArc({ progressMenit }: { progressMenit: number }) {
  const totalMenit = 1440;
  const progress = Math.min(1, Math.max(0, progressMenit / totalMenit));

  // SVG dimensions
  const w = 300, h = 162, cx = 150, cy = 150, r = 120, sw = 14;

  // Track path (full semicircle, counterclockwise on screen = upper arc)
  const trackPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 0 ${cx + r} ${cy}`;

  // Progress endpoint: angle dari π ke 0 saat progress 0→1
  const angle = Math.PI * (1 - progress);
  const px = cx + r * Math.cos(angle);
  const py = cy - r * Math.sin(angle);
  const progressPath = progress > 0.005
    ? `M ${cx - r} ${cy} A ${r} ${r} 0 0 0 ${px.toFixed(2)} ${py.toFixed(2)}`
    : null;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="mx-auto"
      aria-hidden
    >
      <defs>
        <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C2185B" />
          <stop offset="60%" stopColor="#C2185B" />
          <stop offset="100%" stopColor="#D4A24E" />
        </linearGradient>
        {/* Glow filter untuk progress arc */}
        <filter id="gaugeGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Track arc */}
      <path
        d={trackPath}
        fill="none"
        stroke="#261019"
        strokeWidth={sw}
        strokeLinecap="round"
      />

      {/* Progress arc */}
      {progressPath && (
        <path
          d={progressPath}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth={sw}
          strokeLinecap="round"
          filter="url(#gaugeGlow)"
        />
      )}

      {/* Dot di ujung progress */}
      {progress > 0.01 && (
        <circle
          cx={px}
          cy={py}
          r="6"
          fill="#D4A24E"
          opacity="0.9"
          filter="url(#gaugeGlow)"
        />
      )}

      {/* Titik awal (kiri) */}
      <circle cx={cx - r} cy={cy} r="5" fill="#261019" stroke="#C2185B" strokeWidth="1.5" opacity="0.6" />
      {/* Titik akhir (kanan) */}
      <circle cx={cx + r} cy={cy} r="5" fill="#261019" stroke="#D4A24E" strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}

// -----------------------------------------------------------------------
// Toggle notifikasi (UI-only untuk MVP)
// -----------------------------------------------------------------------
function ToggleNotif({ defaultOn = true }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className={`relative h-6 w-11 flex-none rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${
        on ? 'bg-rose-600' : 'bg-ink-800'
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-parchment-100 shadow transition-transform ${
          on ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

// -----------------------------------------------------------------------
// Halaman utama
// -----------------------------------------------------------------------
export default function JadwalSholat() {
  const jadwal = jadwalMakkah;

  // Jam real-time — update tiap detik
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const jam = now.getHours().toString().padStart(2, '0');
  const menit = now.getMinutes().toString().padStart(2, '0');
  const detik = now.getSeconds().toString().padStart(2, '0');
  const progressMenit = now.getHours() * 60 + now.getMinutes();

  // Sholat berikutnya (berdasarkan waktu saat ini)
  const sholatBerikutnya = jadwal.waktuList.find((w) => {
    const [h, m] = w.jamMulai.split(':').map(Number);
    return h * 60 + m > progressMenit;
  });

  return (
    <div className="pb-24">
      <PageHeader title="Jadwal Sholat" eyebrow="Ibadah" backTo="/ibadah" />

      {/* ── Gauge & waktu ── */}
      <div className="relative mt-5 px-5">
        {/* Background glow halus */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-48 opacity-[0.06]"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, #C2185B 0%, transparent 70%)' }}
          aria-hidden
        />

        {/* Nama kota */}
        <p className="relative text-center font-mono text-[11px] uppercase tracking-[0.25em] text-mute-500">
          {jadwal.kota}
        </p>

        {/* SVG Arc */}
        <div className="relative mt-1">
          <GaugeArc progressMenit={progressMenit} />

          {/* Jam di tengah arc */}
          <div className="absolute inset-x-0 bottom-4 flex flex-col items-center">
            <p className="font-display text-5xl font-semibold tabular-nums leading-none text-parchment-100">
              {jam}:{menit}
            </p>
            <p className="mt-1 font-mono text-[13px] text-mute-500 tabular-nums">{detik}</p>
          </div>
        </div>

        {/* Subuh & Isya di kiri-kanan arc */}
        <div className="relative mt-1 flex items-start justify-between px-2">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-mute-500">Subuh</p>
            <p className="mt-0.5 font-mono text-[14px] font-semibold text-parchment-100">{jadwal.jamSubuh}</p>
          </div>
          {sholatBerikutnya && (
            <div className="text-center">
              <p className="font-mono text-[9px] uppercase tracking-widest text-rose-400/80">Berikutnya</p>
              <p className="mt-0.5 font-mono text-[13px] font-semibold text-rose-400">{sholatBerikutnya.nama}</p>
              <p className="font-mono text-[11px] text-mute-500">{sholatBerikutnya.jamMulai}</p>
            </div>
          )}
          <div className="text-right">
            <p className="font-mono text-[9px] uppercase tracking-widest text-mute-500">Isya</p>
            <p className="mt-0.5 font-mono text-[14px] font-semibold text-parchment-100">{jadwal.jamIsya}</p>
          </div>
        </div>
      </div>

      {/* ── List 5 waktu sholat ── */}
      <section className="mt-6 px-5">
        <h2 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-mute-500">
          Waktu Sholat
        </h2>

        <div className="overflow-hidden rounded-2xl border border-ink-800/70"
          style={{ background: 'linear-gradient(160deg, #18090F 0%, #0D0509 100%)' }}
        >
          {jadwal.waktuList.map((w, i) => {
            const [h, m] = w.jamMulai.split(':').map(Number);
            const isSekarang = (() => {
              const mulaiMenit = h * 60 + m;
              const [ah, am] = w.jamAkhir.split(':').map(Number);
              const akhirMenit = ah * 60 + am;
              return progressMenit >= mulaiMenit && progressMenit < akhirMenit;
            })();
            const sudahLewat = h * 60 + m < progressMenit && !isSekarang;

            return (
              <div
                key={w.id}
                className={`flex min-h-[64px] items-center gap-4 px-4 py-3.5 ${
                  i < jadwal.waktuList.length - 1 ? 'border-b border-ink-800/50' : ''
                } ${isSekarang ? 'bg-rose-600/8' : ''}`}
              >
                {/* Ikon waktu */}
                <div
                  className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl border ${
                    isSekarang
                      ? 'border-rose-400/40 bg-rose-600/15 text-rose-400'
                      : sudahLewat
                        ? 'border-ink-800/60 bg-ink-900/60 text-mute-500/50'
                        : 'border-ink-800/60 bg-ink-900/60 text-mute-500'
                  }`}
                >
                  <IconWaktu tipe={w.ikonTipe} className="h-5 w-5" />
                </div>

                {/* Nama & waktu */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-[15px] font-semibold leading-tight ${
                        isSekarang ? 'text-rose-400' : sudahLewat ? 'text-mute-500/60' : 'text-parchment-100'
                      }`}
                    >
                      {w.nama}
                    </p>
                    {isSekarang && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-600/20 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-rose-400">
                        <span className="h-1 w-1 rounded-full bg-rose-400 animate-pulse" />
                        Sekarang
                      </span>
                    )}
                  </div>
                  <p className={`mt-0.5 font-mono text-[12px] ${sudahLewat ? 'text-mute-500/50' : 'text-mute-500'}`}>
                    {w.jamMulai} – {w.jamAkhir}
                  </p>
                </div>

                {/* Toggle notifikasi */}
                <ToggleNotif defaultOn={!sudahLewat} />
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Keterangan ── */}
      <p className="mt-4 px-5 text-center text-[11px] leading-relaxed text-mute-500/70">
        {jadwal.keterangan}
      </p>
    </div>
  );
}
