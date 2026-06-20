import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { IconMoon } from '../components/icons';
import { jadwalMakkah, type WaktuSholat } from '../data/jadwalSholat';

// Ikon waktu per tipe sholat — garis stroke konsisten 1.5
function IconWaktu({ tipe, className = '' }: { tipe: WaktuSholat['ikonTipe']; className?: string }) {
  if (tipe === 'subuh' || tipe === 'isya') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 12.79 A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79 Z" />
      </svg>
    );
  }
  if (tipe === 'maghrib') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17 18 a5 5 0 0 0-10 0" />
        <path d="M12 9 V2" />
        <path d="M4.22 10.22 L5.64 11.64" />
        <path d="M1 18 h3 M20 18 h3" />
        <path d="M18.36 11.64 L19.78 10.22" />
      </svg>
    );
  }
  if (tipe === 'ashar') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2 v3 M12 19 v3 M4.22 4.22 l2.12 2.12 M17.66 17.66 l2.12 2.12 M2 12 h3 M19 12 h3 M4.22 19.78 l2.12-2.12" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2 v3 M12 19 v3 M4.22 4.22 l2.12 2.12 M17.66 17.66 l2.12 2.12 M2 12 h3 M19 12 h3 M4.22 19.78 l2.12-2.12 M17.66 6.34 l2.12-2.12" />
    </svg>
  );
}

// Bintang 5 sudut — penanda waktu malam (Isya)
function IconStar({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2.5 L14.3 9.5 H21.8 L15.9 13.8 L18.1 20.8 L12 16.5 L5.9 20.8 L8.1 13.8 L2.2 9.5 H9.7 Z" />
    </svg>
  );
}

// Gauge setengah lingkaran — menunjukkan posisi waktu saat ini dalam hari
function GaugeArc({ progressMenit }: { progressMenit: number }) {
  const totalMenit = 1440;
  const progress = Math.min(1, Math.max(0, progressMenit / totalMenit));
  const w = 300, h = 162, cx = 150, cy = 150, r = 120, sw = 14;
  const trackPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 0 ${cx + r} ${cy}`;
  const angle = Math.PI * (1 - progress);
  const px = cx + r * Math.cos(angle);
  const py = cy - r * Math.sin(angle);
  const progressPath = progress > 0.005
    ? `M ${cx - r} ${cy} A ${r} ${r} 0 0 0 ${px.toFixed(2)} ${py.toFixed(2)}`
    : null;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="mx-auto" aria-hidden>
      <defs>
        <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ea2804" />
          <stop offset="60%" stopColor="#ea2804" />
          <stop offset="100%" stopColor="#d4a24e" />
        </linearGradient>
      </defs>
      {/* Track: jalur abu-abu latar */}
      <path d={trackPath} fill="none" stroke="#f3f0e8" strokeWidth={sw} strokeLinecap="round" />
      {/* Progress: jalur berwarna sesuai waktu */}
      {progressPath && (
        <path d={progressPath} fill="none" stroke="url(#gaugeGrad)" strokeWidth={sw} strokeLinecap="round" />
      )}
      {/* Titik posisi sekarang */}
      {progress > 0.01 && (
        <circle cx={px} cy={py} r="7" fill="#d4a24e" opacity="0.95" />
      )}
    </svg>
  );
}

// Toggle notifikasi — semua default ON saat halaman pertama dibuka
function ToggleNotif() {
  const [on, setOn] = useState(true);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className={`relative h-6 w-11 flex-none rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        on ? 'bg-primary' : 'bg-surface-bone border border-hairline'
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-canvas shadow transition-transform ${
          on ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

export default function JadwalSholat() {
  const jadwal = jadwalMakkah;
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const jam = now.getHours().toString().padStart(2, '0');
  const menit = now.getMinutes().toString().padStart(2, '0');
  const detik = now.getSeconds().toString().padStart(2, '0');
  const progressMenit = now.getHours() * 60 + now.getMinutes();

  // Waktu sholat berikutnya = yang START-nya lebih dari sekarang
  const sholatBerikutnya = jadwal.waktuList.find((w) => {
    const [h, m] = w.jamMulai.split(':').map(Number);
    return h * 60 + m > progressMenit;
  });

  return (
    <div className="pb-24">
      <PageHeader title="Jadwal Sholat" eyebrow="Ibadah" backTo="/ibadah" />

      {/* ── Gauge & jam ── */}
      <div className="relative mt-5 px-5">
        <p className="relative text-center font-mono text-[11px] uppercase tracking-[0.25em] text-mute">
          {jadwal.kota}
        </p>

        <div className="relative mt-1">
          <GaugeArc progressMenit={progressMenit} />

          {/* Jam besar di tengah bawah gauge */}
          <div className="absolute inset-x-0 bottom-4 flex flex-col items-center">
            <div className="flex items-baseline gap-0.5">
              <p className="font-display text-5xl font-bold tabular-nums leading-none text-ink">
                {jam}:{menit}
              </p>
              <p className="font-mono text-[17px] font-semibold tabular-nums text-mute leading-none">
                :{detik}
              </p>
            </div>
          </div>
        </div>

        {/* Label Subuh ← tengah → Isya, dengan ikon penanda waktu */}
        <div className="relative mt-1 flex items-start justify-between px-1">
          {/* Subuh — kiri */}
          <div className="flex items-center gap-1.5">
            <IconMoon className="h-4 w-4 text-mute flex-none" />
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-mute">Subuh</p>
              <p className="mt-0.5 font-mono text-[14px] font-semibold text-ink">{jadwal.jamSubuh}</p>
            </div>
          </div>

          {/* Waktu berikutnya — tengah */}
          {sholatBerikutnya && (
            <div className="text-center">
              <p className="font-mono text-[9px] uppercase tracking-widest text-primary/80">Berikutnya</p>
              <p className="mt-0.5 font-mono text-[13px] font-semibold text-primary">{sholatBerikutnya.nama}</p>
              <p className="font-mono text-[11px] text-mute">{sholatBerikutnya.jamMulai}</p>
            </div>
          )}

          {/* Isya — kanan */}
          <div className="flex items-center gap-1.5">
            <div className="text-right">
              <p className="font-mono text-[9px] uppercase tracking-widest text-mute">Isya</p>
              <p className="mt-0.5 font-mono text-[14px] font-semibold text-ink">{jadwal.jamIsya}</p>
            </div>
            <IconStar className="h-4 w-4 text-mute flex-none" />
          </div>
        </div>
      </div>

      {/* ── List 5 waktu sholat ── */}
      <section className="mt-6 px-5">
        <h2 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-mute">
          Waktu Sholat
        </h2>

        <div className="overflow-hidden rounded-md border border-hairline bg-surface-card shadow-drop-card">
          {jadwal.waktuList.map((w, i) => {
            const [h, m] = w.jamMulai.split(':').map(Number);
            const mulaiMenit = h * 60 + m;

            const isSekarang = (() => {
              const [ah, am] = w.jamAkhir.split(':').map(Number);
              const akhirMenit = ah * 60 + am;
              return progressMenit >= mulaiMenit && progressMenit < akhirMenit;
            })();

            const sudahLewat = mulaiMenit < progressMenit && !isSekarang;
            const isBerikutnya = sholatBerikutnya?.id === w.id && !isSekarang;

            return (
              <div
                key={w.id}
                className={`flex min-h-[64px] items-center gap-4 px-4 py-3.5 ${
                  i < jadwal.waktuList.length - 1 ? 'border-b border-hairline' : ''
                } ${isSekarang ? 'bg-primary/5' : isBerikutnya ? 'bg-gold/5' : ''}`}
              >
                {/* Ikon tipe sholat */}
                <div
                  className={`flex h-10 w-10 flex-none items-center justify-center rounded-md border ${
                    isSekarang
                      ? 'border-primary/30 bg-primary/10 text-primary'
                      : isBerikutnya
                        ? 'border-gold/30 bg-gold/10 text-gold'
                        : sudahLewat
                          ? 'border-hairline bg-surface-bone text-ash'
                          : 'border-hairline bg-surface-bone text-charcoal'
                  }`}
                >
                  <IconWaktu tipe={w.ikonTipe} className="h-5 w-5" />
                </div>

                {/* Nama & jam */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p
                      className={`text-[15px] font-semibold leading-tight ${
                        isSekarang ? 'text-primary' : isBerikutnya ? 'text-gold' : sudahLewat ? 'text-ash' : 'text-ink'
                      }`}
                    >
                      {w.nama}
                    </p>

                    {/* Badge "Sekarang" */}
                    {isSekarang && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary">
                        <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                        Sekarang
                      </span>
                    )}

                    {/* Badge "Berikutnya" */}
                    {isBerikutnya && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-gold">
                        <span className="h-1 w-1 rounded-full bg-gold" />
                        Berikutnya
                      </span>
                    )}
                  </div>

                  <p className={`mt-0.5 font-mono text-[12px] ${sudahLewat ? 'text-ash' : 'text-mute'}`}>
                    {w.jamMulai} – {w.jamAkhir}
                  </p>
                </div>

                {/* Toggle notifikasi */}
                <ToggleNotif />
              </div>
            );
          })}
        </div>
      </section>

      <p className="mt-4 px-5 text-center text-[11px] leading-relaxed text-ash">
        {jadwal.keterangan}
      </p>
    </div>
  );
}
